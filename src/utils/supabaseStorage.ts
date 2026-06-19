import { supabase } from './supabaseClient';
import type { Participant, Winner, BracketData } from '../types';
import { buildTicketCode } from './excelImport';

// ---------- Participants ----------
export async function fetchParticipants(): Promise<Participant[]> {
  let allParticipants: any[] = [];
  let from = 0;
  const step = 1000;
  let fetchMore = true;

  while (fetchMore) {
    const { data: participantsData, error: participantsError } = await supabase
      .from('participants')
      .select('*')
      .range(from, from + step - 1);
      
    if (participantsError) throw participantsError;

    if (participantsData && participantsData.length > 0) {
      allParticipants = allParticipants.concat(participantsData);
      if (participantsData.length < step) {
        fetchMore = false;
      } else {
        from += step;
      }
    } else {
      fetchMore = false;
    }
  }

  // Fetch predictions – if the table is missing or RLS blocks it, still return participants
  let predMap = new Map<string, any>();
  try {
    let allPredictions: any[] = [];
    let pFrom = 0;
    let pFetchMore = true;

    while (pFetchMore) {
      const { data: predictionsData, error: predictionsError } = await supabase
        .from('predictions')
        .select('*')
        .range(pFrom, pFrom + step - 1);

      if (predictionsError) {
        console.warn('⚠️ [fetchParticipants] No se pudo leer predictions:', predictionsError.message);
        pFetchMore = false;
      } else {
        if (predictionsData && predictionsData.length > 0) {
          allPredictions = allPredictions.concat(predictionsData);
          if (predictionsData.length < step) {
            pFetchMore = false;
          } else {
            pFrom += step;
          }
        } else {
          pFetchMore = false;
        }
      }
    }

    console.log('✅ [fetchParticipants] Predictions cargadas:', allPredictions.length, 'filas');
    allPredictions.forEach(p => {
      predMap.set(p.participant_id, p);
    });
  } catch (e) {
    console.warn('⚠️ [fetchParticipants] Error al cargar predictions:', e);
  }

  // Merge predictions into participant objects
  return allParticipants.map(p => {
    const pred = predMap.get(p.id);
    return {
      id: p.id,
      dni: p.dni,
      phone: p.phone,
      placa: p.placa,
      sede: p.sede,
      registeredAt: p.registered_at,
      ticketCode: p.ticket_code,
      champion: pred?.champion ?? undefined,
      subchampion: pred?.subchampion ?? undefined,
      thirdPlace: pred?.third_place ?? undefined,
    };
  });
}

export async function insertParticipant(p: {
  dni: string;
  phone: string;
  placa: string;
  sede?: string;
  ticketCode?: string;
}): Promise<string> {
  const { data, error } = await supabase.from('participants').insert({
    dni: p.dni,
    phone: p.phone,
    placa: p.placa,
    sede: p.sede,
    ticket_code: p.ticketCode,
  }).select('id').single();
  
  if (error) throw error;
  return data.id;
}

export async function deleteParticipant(id: string): Promise<void> {
  // First, delete related predictions
  const { error: predError } = await supabase.from('predictions').delete().eq('participant_id', id);
  if (predError) throw predError;

  // Then delete the participant
  const { error: partError } = await supabase.from('participants').delete().eq('id', id);
  if (partError) throw partError;
}

export async function importParticipantsFromExcel(
  data: Array<{
    DNI: string;
    Telefono: string;
    Placa: string;
    Sede?: string;
    Campeon?: string;
    Subcampeon?: string;
    TercerPuesto?: string;
  }>
): Promise<{ success: number; errors: string[] }> {
  const errors: string[] = [];
  let successCount = 0;

  // Fetch existing participants for duplicate check and sequential counter base
  const existing = await fetchParticipants();
  const existingDnis = new Set(existing.map(p => p.dni.toLowerCase()));
  const existingPlacas = new Set(existing.map(p => p.placa.toUpperCase()));
  // Global sequence starts after all current participants
  let globalSeq = existing.length + 1;

  for (const row of data) {
    try {
      // Check for duplicate DNI
      if (existingDnis.has(row.DNI.toLowerCase())) {
        errors.push(`DNI ${row.DNI} ya existe`);
        continue;
      }

      // Check for duplicate Placa
      if (row.Placa && existingPlacas.has(row.Placa.toUpperCase())) {
        errors.push(`Placa ${row.Placa} ya existe`);
        continue;
      }

      // Build structured ticket code: GSC + PLACA + sequential (e.g. GSCABC123001)
      const ticketCode = buildTicketCode(row.Placa, globalSeq);

      // Insert participant and retrieve its new ID
      const { data: partData, error: partError } = await supabase
        .from('participants')
        .insert({
          dni: row.DNI,
          phone: row.Telefono,
          placa: row.Placa,
          sede: row.Sede || null,
          ticket_code: ticketCode,
        })
        .select('id')
        .single();

      if (partError) throw partError;

      const participantId = partData?.id;
      if (!participantId) {
        errors.push(`No se pudo obtener ID para DNI ${row.DNI}`);
        continue;
      }

      // Insert predictions if provided
      if (row.Campeon || row.Subcampeon || row.TercerPuesto) {
        const { error: predError } = await supabase.from('predictions').insert({
          participant_id: participantId,
          champion: row.Campeon || '',
          subchampion: row.Subcampeon || '',
          third_place: row.TercerPuesto || '',
        });

        if (predError) {
          console.warn('Error inserting prediction:', predError);
        }
      }

      successCount++;
      globalSeq++;   // advance sequential for next ticket
    } catch (error: any) {
      errors.push(`Error con DNI ${row.DNI}: ${error.message}`);
    }
  }

  return { success: successCount, errors };
}

// ---------- Predictions ----------
export async function insertPrediction(pred: {
  participantId: string;
  champion: string;
  subchampion: string;
  thirdPlace: string;
}): Promise<void> {
  const { error } = await supabase.from('predictions').insert({
    participant_id: pred.participantId,
    champion: pred.champion,
    subchampion: pred.subchampion,
    third_place: pred.thirdPlace,
  });
  if (error) throw error;
}
export async function addWinner(winner: Winner): Promise<void> {
  const { error } = await supabase.from('winners').insert({
    participant_id: winner.participant.id,
    drawn_at: winner.drawnAt,
    draw_number: winner.drawNumber,
  });
  if (error) throw error;
}

// ---------- Winners (optional – you may keep local) ----------
export async function fetchWinners(): Promise<Winner[]> {
  const { data, error } = await supabase.from('winners').select('*, participant:participants(*)');
  if (error) throw error;
  return (data as any[]).map((row) => ({
    participant: {
      id: row.participant.id,
      dni: row.participant.dni,
      phone: row.participant.phone,
      placa: row.participant.placa,
      registeredAt: row.participant.registered_at,
    },
    drawnAt: row.drawn_at,
    drawNumber: row.draw_number,
  }));
}

// ---------- Bracket data (kept in‑memory) ----------
import { getBracketData as localBracket, saveBracketData as localSaveBracket } from './storage';
export function getBracketData(): BracketData {
  return localBracket();
}
export function saveBracketData(data: BracketData): void {
  localSaveBracket(data);
}
