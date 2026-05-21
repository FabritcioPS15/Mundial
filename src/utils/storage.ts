import type { Participant, Winner, Match, BracketData } from '../types';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// In-Memory Variables replacing localStorage
let participantsInMemory: Participant[] = [];
let winnersInMemory: Winner[] = [];
let bracketInMemory: BracketData | null = null;

export function getParticipants(): Participant[] {
  return participantsInMemory;
}

export function saveParticipants(participants: Participant[]): void {
  participantsInMemory = participants;
}

export function addParticipant(participant: Participant): void {
  participantsInMemory.push(participant);
}

export function deleteParticipant(id: string): void {
  participantsInMemory = participantsInMemory.filter((p) => p.id !== id);
}

export function isDniTaken(dni: string): boolean {
  return participantsInMemory.some((p) => p.dni.toLowerCase() === dni.toLowerCase());
}

export function getWinners(): Winner[] {
  return winnersInMemory;
}

export function saveWinners(winners: Winner[]): void {
  winnersInMemory = winners;
}

export function addWinner(winner: Winner): void {
  winnersInMemory.push(winner);
}

export function pickRandomWinner(excludePrevious: boolean): Participant | null {
  const participants = getParticipants();
  if (participants.length === 0) return null;

  let eligible = participants;
  if (excludePrevious) {
    const winnerIds = new Set(getWinners().map((w) => w.participant.id));
    eligible = participants.filter((p) => !winnerIds.has(p.id));
  }

  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

export async function exportToExcel(data: Record<string, string | number>[], filename: string): Promise<void> {
  if (data.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Participantes');

  const headers = Object.keys(data[0]);
  worksheet.columns = headers.map(h => ({
    header: h,
    key: h,
    width: Math.max(h.length + 5, 20),
  }));

  // Decorate headers
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF97316' }, // Orange-500
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Add data
  data.forEach(row => {
    worksheet.addRow(row);
  });

  // Decorate data cells
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    row.eachCell(cell => {
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, filename.replace('.csv', '.xlsx'));
}

// 100% clean placeholder layout representing real tournament slots
const INITIAL_OCTAVOS: Match[] = [
  {
    id: 'o1',
    date: '28 de Junio, 2026 - 18:00',
    stadium: 'Estadio Azteca, CDMX',
    teamA: { name: '1° Grupo A', flag: '⚽' },
    teamB: { name: '2° Grupo B', flag: '⚽' },
    phase: 'Octavos 1'
  },
  {
    id: 'o2',
    date: '28 de Junio, 2026 - 21:00',
    stadium: 'SoFi Stadium, LA',
    teamA: { name: '1° Grupo C', flag: '⚽' },
    teamB: { name: '2° Grupo D', flag: '⚽' },
    phase: 'Octavos 2'
  },
  {
    id: 'o3',
    date: '29 de Junio, 2026 - 17:00',
    stadium: 'MetLife Stadium, NY',
    teamA: { name: '1° Grupo E', flag: '⚽' },
    teamB: { name: '2° Grupo F', flag: '⚽' },
    phase: 'Octavos 3'
  },
  {
    id: 'o4',
    date: '29 de Junio, 2026 - 20:00',
    stadium: 'Mercedes-Benz, Atlanta',
    teamA: { name: '1° Grupo G', flag: '⚽' },
    teamB: { name: '2° Grupo H', flag: '⚽' },
    phase: 'Octavos 4'
  },
  {
    id: 'o5',
    date: '30 de Junio, 2026 - 18:00',
    stadium: 'Hard Rock Stadium, Miami',
    teamA: { name: '1° Grupo B', flag: '⚽' },
    teamB: { name: '2° Grupo A', flag: '⚽' },
    phase: 'Octavos 5'
  },
  {
    id: 'o6',
    date: '30 de Junio, 2026 - 21:00',
    stadium: 'AT&T Stadium, Dallas',
    teamA: { name: '1° Grupo D', flag: '⚽' },
    teamB: { name: '2° Grupo C', flag: '⚽' },
    phase: 'Octavos 6'
  },
  {
    id: 'o7',
    date: '01 de Julio, 2026 - 17:00',
    stadium: 'BC Place, Vancouver',
    teamA: { name: '1° Grupo F', flag: '⚽' },
    teamB: { name: '2° Grupo E', flag: '⚽' },
    phase: 'Octavos 7'
  },
  {
    id: 'o8',
    date: '01 de Julio, 2026 - 20:00',
    stadium: 'Lumen Field, Seattle',
    teamA: { name: '1° Grupo H', flag: '⚽' },
    teamB: { name: '2° Grupo G', flag: '⚽' },
    phase: 'Octavos 8'
  }
];

const INITIAL_QUARTERS: Match[] = [
  {
    id: 'q1',
    date: '04 de Julio, 2026 - 18:00',
    stadium: 'Estadio Azteca, CDMX',
    teamA: { name: 'Ganador Octavos 1', flag: '⚽' },
    teamB: { name: 'Ganador Octavos 2', flag: '⚽' },
    phase: 'Cuartos 1'
  },
  {
    id: 'q2',
    date: '05 de Julio, 2026 - 20:00',
    stadium: 'MetLife Stadium, NY',
    teamA: { name: 'Ganador Octavos 3', flag: '⚽' },
    teamB: { name: 'Ganador Octavos 4', flag: '⚽' },
    phase: 'Cuartos 2'
  },
  {
    id: 'q3',
    date: '06 de Julio, 2026 - 17:00',
    stadium: 'SoFi Stadium, LA',
    teamA: { name: 'Ganador Octavos 5', flag: '⚽' },
    teamB: { name: 'Ganador Octavos 6', flag: '⚽' },
    phase: 'Cuartos 3'
  },
  {
    id: 'q4',
    date: '07 de Julio, 2026 - 19:00',
    stadium: 'AT&T Stadium, Dallas',
    teamA: { name: 'Ganador Octavos 7', flag: '⚽' },
    teamB: { name: 'Ganador Octavos 8', flag: '⚽' },
    phase: 'Cuartos 4'
  }
];

const INITIAL_SEMIS: Match[] = [
  {
    id: 's1',
    date: '11 de Julio, 2026 - 20:00',
    stadium: 'Mercedes-Benz Stadium, Atlanta',
    teamA: { name: 'Ganador Cuartos 1', flag: '⚽' },
    teamB: { name: 'Ganador Cuartos 2', flag: '⚽' },
    phase: 'Semifinal 1'
  },
  {
    id: 's2',
    date: '12 de Julio, 2026 - 20:00',
    stadium: 'Hard Rock Stadium, Miami',
    teamA: { name: 'Ganador Cuartos 3', flag: '⚽' },
    teamB: { name: 'Ganador Cuartos 4', flag: '⚽' },
    phase: 'Semifinal 2'
  }
];

const INITIAL_FINAL: Match = {
  id: 'f1',
  date: '19 de Julio, 2026 - 16:00',
  stadium: 'MetLife Stadium, NY',
  teamA: { name: 'Ganador Semifinal 1', flag: '⚽' },
  teamB: { name: 'Ganador Semifinal 2', flag: '⚽' },
  phase: 'Gran Final'
};

const INITIAL_UPCOMING: Match[] = [
  {
    id: 'up1',
    date: '11 de Junio, 2026 - 17:00',
    stadium: 'Estadio Azteca, CDMX',
    teamA: { name: 'México', flag: '🇲🇽' },
    teamB: { name: 'Sudáfrica', flag: '🇿🇦' },
    phase: 'Fase de Grupos - Grupo A',
    isoDate: '2026-06-11T17:00:00Z'
  },
  {
    id: 'up9',
    date: '11 de Junio, 2026 - 20:00',
    stadium: 'SoFi Stadium, Los Ángeles',
    teamA: { name: 'Canadá', flag: '🇨🇦' },
    teamB: { name: 'Suiza', flag: '🇨🇭' },
    phase: 'Fase de Grupos - Grupo B',
    isoDate: '2026-06-11T20:00:00Z'
  },
  {
    id: 'up2',
    date: '12 de Junio, 2026 - 20:00',
    stadium: 'SoFi Stadium, Los Ángeles',
    teamA: { name: 'Estados Unidos', flag: '🇺🇸' },
    teamB: { name: 'Paraguay', flag: '🇵🇾' },
    phase: 'Fase de Grupos - Grupo D',
    isoDate: '2026-06-12T20:00:00Z'
  },
  {
    id: 'up3',
    date: '13 de Junio, 2026 - 15:00',
    stadium: 'MetLife Stadium, Nueva York',
    teamA: { name: 'Argentina', flag: '🇦🇷' },
    teamB: { name: 'Argelia', flag: '🇩🇿' },
    phase: 'Fase de Grupos - Grupo J',
    isoDate: '2026-06-13T15:00:00Z'
  },
  {
    id: 'up4',
    date: '14 de Junio, 2026 - 18:00',
    stadium: 'Hard Rock Stadium, Miami',
    teamA: { name: 'España', flag: '🇪🇸' },
    teamB: { name: 'Cabo Verde', flag: '🇨🇻' },
    phase: 'Fase de Grupos - Grupo H',
    isoDate: '2026-06-14T18:00:00Z'
  },
  {
    id: 'up5',
    date: '15 de Junio, 2026 - 21:00',
    stadium: 'AT&T Stadium, Dallas',
    teamA: { name: 'Brasil', flag: '🇧🇷' },
    teamB: { name: 'Marruecos', flag: '🇲🇦' },
    phase: 'Fase de Grupos - Grupo C',
    isoDate: '2026-06-15T21:00:00Z'
  },
  {
    id: 'up6',
    date: '16 de Junio, 2026 - 19:00',
    stadium: 'Estadio BBVA, Monterrey',
    teamA: { name: 'Alemania', flag: '🇩🇪' },
    teamB: { name: 'Curazao', flag: '🇨🇼' },
    phase: 'Fase de Grupos - Grupo E',
    isoDate: '2026-06-16T19:00:00Z'
  },
  {
    id: 'up7',
    date: '17 de Junio, 2026 - 16:00',
    stadium: 'BC Place, Vancouver',
    teamA: { name: 'Inglaterra', flag: '🏴\u200D󠁢󠁥󠁮󠁧󠁿' },
    teamB: { name: 'Croacia', flag: '🇭🇷' },
    phase: 'Fase de Grupos - Grupo L',
    isoDate: '2026-06-17T16:00:00Z'
  },
  {
    id: 'up8',
    date: '18 de Junio, 2026 - 20:00',
    stadium: 'Lumen Field, Seattle',
    teamA: { name: 'Portugal', flag: '🇵🇹' },
    teamB: { name: 'Colombia', flag: '🇨🇴' },
    phase: 'Fase de Grupos - Grupo K',
    isoDate: '2026-06-18T20:00:00Z'
  }
];

export function getBracketData(): BracketData {
  if (!bracketInMemory) {
    bracketInMemory = {
      octavos: INITIAL_OCTAVOS,
      quarters: INITIAL_QUARTERS,
      semis: INITIAL_SEMIS,
      final: INITIAL_FINAL,
      upcoming: INITIAL_UPCOMING,
    };
  }
  return bracketInMemory;
}

export function saveBracketData(data: BracketData): void {
  bracketInMemory = data;
}
