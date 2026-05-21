import { supabase } from './supabaseClient';
import type { Participant, Winner, Prediction, BracketData } from '../types';

// ---------- Participants ----------
export async function fetchParticipants(): Promise<Participant[]> {
  const { data: participantsData, error: participantsError } = await supabase.from('participants').select('*');
  if (participantsError) throw participantsError;

  // Fetch predictions – if the table is missing or RLS blocks it, still return participants
  let predMap = new Map<string, any>();
  try {
    const { data: predictionsData, error: predictionsError } = await supabase.from('predictions').select('*');
    if (predictionsError) {
      console.warn('⚠️ [fetchParticipants] No se pudo leer predictions:', predictionsError.message);
    } else {
      console.log('✅ [fetchParticipants] Predictions cargadas:', predictionsData?.length ?? 0, 'filas');
      (predictionsData as any[]).forEach(p => {
        console.log('   → prediction row:', { participant_id: p.participant_id, champion: p.champion, subchampion: p.subchampion, third_place: p.third_place });
        predMap.set(p.participant_id, p);
      });
    }
  } catch (e) {
    console.warn('⚠️ [fetchParticipants] Error al cargar predictions:', e);
  }

  // Merge predictions into participant objects
  return (participantsData as any[]).map(p => {
    const pred = predMap.get(p.id);
    return {
      id: p.id,
      fullName: p.full_name,
      dni: p.dni,
      email: p.email,
      phone: p.phone,
      placa: p.placa,
      registeredAt: p.registered_at,
      ticketCode: p.ticket_code,
      champion: pred?.champion ?? undefined,
      subchampion: pred?.subchampion ?? undefined,
      thirdPlace: pred?.third_place ?? undefined,
    };
  });
}

export async function insertParticipant(p: {
  fullName: string;
  dni: string;
  email: string;
  phone: string;
  placa: string;
  ticketCode?: string;
}): Promise<void> {
  const { error } = await supabase.from('participants').insert({
    full_name: p.fullName,
    dni: p.dni,
    email: p.email,
    phone: p.phone,
    placa: p.placa,
    ticket_code: p.ticketCode,
  });
  if (error) throw error;
}

export async function deleteParticipant(id: string): Promise<void> {
  // First, delete related predictions
  const { error: predError } = await supabase.from('predictions').delete().eq('participant_id', id);
  if (predError) throw predError;

  // Then delete the participant
  const { error: partError } = await supabase.from('participants').delete().eq('id', id);
  if (partError) throw partError;
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
      fullName: row.participant.full_name,
      dni: row.participant.dni,
      email: row.participant.email,
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
