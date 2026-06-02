import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Participant, Winner, BracketData } from '../types';
import {
  fetchParticipants,
  fetchWinners,
  insertParticipant,
  insertPrediction,
  addWinner,
  getBracketData,
  saveBracketData,
  deleteParticipant,
  importParticipantsFromExcel,
} from '../utils/supabaseStorage';
import { buildTicketCode } from '../utils/excelImport';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  participants: Participant[];
  winners: Winner[];
  toasts: Toast[];
  excludePrevious: boolean;
  bracketData: BracketData;
  setExcludePrevious: (val: boolean) => void;
  registerParticipant: (
    data: Omit<Participant, 'id' | 'registeredAt'> & {
      champion: string;
      subchampion: string;
      thirdPlace: string;
      sede?: string;
    }
  ) => Promise<string | null>; // returns ticketCode on success, null on failure
  removeParticipant: (id: string) => Promise<void>;
  importParticipants: (data: Array<{
    DNI: string;
    Telefono: string;
    Placa: string;
    Sede?: string;
    Campeon?: string;
    Subcampeon?: string;
    TercerPuesto?: string;
  }>) => Promise<{ success: number; errors: string[] }>;
  conductDraw: () => Promise<Winner | null>;
  showToast: (message: string, type: Toast['type']) => void;
  dismissToast: (id: string) => void;
  updateBracketData: (data: BracketData) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [excludePrevious, setExcludePrevious] = useState(true);
  const [bracketData, setBracketData] = useState<BracketData>({
    octavos: [],
    quarters: [],
    semis: [],
    final: { id: 'f1', date: '', stadium: '', teamA: { name: '', flag: '' }, teamB: { name: '', flag: '' } },
    upcoming: [],
  });

  // Load initial data
  useEffect(() => {
    (async () => {
      try {
        const [p, w] = await Promise.all([fetchParticipants(), fetchWinners()]);
        setParticipants(p);
        setWinners(w);
      } catch (e) {
        console.error('Error loading participants/winners', e);
      }
    })();
    // Load bracket data (static JSON or fallback)
    fetch('/api/bracket.json')
      .then((res) => {
        if (!res.ok) throw new Error('API Response not ok');
        return res.json();
      })
      .then((data: BracketData) => {
        setBracketData(data);
        console.log('⚽ [REST API] Bracket data loaded successfully.');
      })
      .catch(() => {
        setBracketData(getBracketData());
      });
  }, []);

  const showToast = useCallback((message: string, type: Toast['type']) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const registerParticipant = useCallback(
    async (data: Omit<Participant, 'id' | 'registeredAt'> & { champion: string; subchampion: string; thirdPlace: string; }): Promise<string | null> => {
      // Check for duplicate DNI
      const existing = await fetchParticipants();
      if (existing.some((p) => p.dni.toLowerCase() === data.dni.toLowerCase())) {
        showToast('Este DNI ya está registrado', 'error');
        return null;
      }
      // Ticket: GSC-PLACA + sequential (continues global counter)
      const ticketCode = buildTicketCode(data.placa, existing.length + 1);
      // Insert participant core data
      await insertParticipant({
        dni: data.dni,
        phone: data.phone,
        placa: data.placa,
        sede: data.sede,
        ticketCode: ticketCode,
      });
      // Retrieve the newly created participant to get its ID
      const participantsNow = await fetchParticipants();
      const participant = participantsNow.find((p) => p.dni === data.dni);
      if (!participant) {
        showToast('Error al crear participante', 'error');
        return null;
      }
      // Insert predictions linked to participant
      await insertPrediction({
        participantId: participant.id,
        champion: data.champion,
        subchampion: data.subchampion,
        thirdPlace: data.thirdPlace,
      });
      // Refresh participant list
      setParticipants(await fetchParticipants());
      showToast('Registro exitoso! Ya eres parte del sorteo', 'success');
      return ticketCode; // ← real ticket code, same as what's in DB
    },
    [showToast]
  );

  const removeParticipant = useCallback(async (id: string) => {
    try {
      await deleteParticipant(id);
      setParticipants((prev) => prev.filter((p) => p.id !== id));
      showToast('Participante eliminado con éxito', 'success');
    } catch (err) {
      console.error('Error deleting participant', err);
      showToast('Error al eliminar participante. Revisa los permisos.', 'error');
    }
  }, [showToast]);

  const importParticipants = useCallback(async (data: Array<{
    DNI: string;
    Telefono: string;
    Placa: string;
    Sede?: string;
    Campeon?: string;
    Subcampeon?: string;
    TercerPuesto?: string;
  }>) => {
    try {
      const result = await importParticipantsFromExcel(data);

      // Show success toast
      if (result.success > 0) {
        setParticipants(await fetchParticipants());
        showToast(`✅ ${result.success} participante${result.success !== 1 ? 's' : ''} importado${result.success !== 1 ? 's' : ''} exitosamente`, 'success');
      }

      if (result.errors.length > 0) {
        // Separate duplicate-DNI errors from other errors
        const duplicateErrors = result.errors.filter(e => e.includes('ya existe'));
        const otherErrors = result.errors.filter(e => !e.includes('ya existe'));

        // Notify duplicate DNIs
        if (duplicateErrors.length > 0) {
          const THRESHOLD = 3;
          if (duplicateErrors.length <= THRESHOLD) {
            // Show each skipped DNI individually
            duplicateErrors.forEach(errMsg => {
              // Extract DNI from message like "DNI 40664545 ya existe"
              const match = errMsg.match(/DNI\s+(\S+)/i);
              const dni = match ? match[1] : errMsg;
              showToast(`⚠️ DNI ${dni} ya estaba registrado — omitido`, 'error');
            });
          } else {
            // Summary for large batches
            showToast(
              `⚠️ Se omitieron ${duplicateErrors.length} registros porque sus DNIs ya existen en el sistema`,
              'error'
            );
          }
        }

        // Notify other errors (non-duplicate)
        if (otherErrors.length > 0) {
          showToast(`❌ ${otherErrors.length} error${otherErrors.length !== 1 ? 'es' : ''} adicional${otherErrors.length !== 1 ? 'es' : ''} durante la importación`, 'error');
          otherErrors.forEach(e => console.error('[Import error]', e));
        }
      }

      // Edge case: nothing was imported at all
      if (result.success === 0 && result.errors.length === 0) {
        showToast('El archivo no contiene registros válidos para importar', 'info');
      }

      return result;
    } catch (err) {
      console.error('Error importing participants', err);
      showToast('❌ Error al importar participantes. Revisa el archivo.', 'error');
      return { success: 0, errors: ['Error general al importar'] };
    }
  }, [showToast]);

  const conductDraw = useCallback(async (): Promise<Winner | null> => {
    let eligible = participants;
    if (excludePrevious) {
      const winnerIds = new Set(winners.map((w) => w.participant.id));
      eligible = participants.filter((p) => !winnerIds.has(p.id));
    }
    if (eligible.length === 0) return null;
    const participant = eligible[Math.floor(Math.random() * eligible.length)];
    const newWinner: Winner = {
      participant,
      drawnAt: new Date().toISOString(),
      drawNumber: winners.length + 1,
    };
    await addWinner(newWinner);
    setWinners(await fetchWinners());
    return newWinner;
  }, [participants, winners, excludePrevious]);

  const updateBracketData = useCallback((data: BracketData) => {
    saveBracketData(data);
    setBracketData(data);
    showToast('Bracket y marcadores actualizados con éxito', 'success');
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        participants,
        winners,
        toasts,
        excludePrevious,
        bracketData,
        setExcludePrevious,
        registerParticipant,
        removeParticipant,
        importParticipants,
        conductDraw,
        showToast,
        dismissToast,
        updateBracketData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
