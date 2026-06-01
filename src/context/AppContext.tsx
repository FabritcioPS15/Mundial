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
  ) => Promise<boolean>;
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
    async (data: Omit<Participant, 'id' | 'registeredAt'> & { champion: string; subchampion: string; thirdPlace: string; }) => {
      // Check for duplicate DNI
      const existing = await fetchParticipants();
      if (existing.some((p) => p.dni.toLowerCase() === data.dni.toLowerCase())) {
        showToast('Este DNI ya está registrado', 'error');
        return false;
      }
      const ticketCode = Math.random().toString(36).substring(2, 8).toUpperCase();
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
        return false;
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
      return true;
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
      if (result.success > 0) {
        setParticipants(await fetchParticipants());
        showToast(`${result.success} participantes importados exitosamente`, 'success');
      }
      if (result.errors.length > 0) {
        result.errors.forEach(err => console.error(err));
        showToast(`${result.errors.length} errores durante la importación`, 'error');
      }
      return result;
    } catch (err) {
      console.error('Error importing participants', err);
      showToast('Error al importar participantes', 'error');
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
