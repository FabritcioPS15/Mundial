export interface Participant {
  id: string;
  dni: string;
  phone: string;
  placa: string;
  sede?: string;
  champion?: string;
  subchampion?: string;
  thirdPlace?: string;
  ticketCode?: string;
  registeredAt: string;
}

export interface Prediction {
  id: string;
  participantId: string;
  champion: string;
  subchampion: string;
  thirdPlace: string;
}

export interface Winner {
  participant: Participant;
  drawnAt: string;
  drawNumber: number;
}

export interface Team {
  name: string;
  flag: string;
  score?: number | string;
  winner?: boolean;
}

export interface Match {
  id: string;
  date: string;
  stadium: string;
  teamA: Team;
  teamB: Team;
  phase?: string;
  isoDate?: string;
}

export interface BracketData {
  octavos: Match[];
  quarters: Match[];
  semis: Match[];
  final: Match;
  upcoming: Match[];
}
