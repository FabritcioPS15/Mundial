import { useState } from 'react';
import { Calendar, MapPin, Trophy, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTeamFlagUrl } from '../utils/flagHelper';

interface Team {
  name: string;
  flag: string;
  score?: number | string;
  winner?: boolean;
}

interface Match {
  id: string;
  date: string;
  stadium: string;
  teamA: Team;
  teamB: Team;
  phase?: string;
  isoDate?: string;
}

const OCTAVOS: Match[] = [
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

const QUARTERS: Match[] = [
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

const SEMIS: Match[] = [
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

const FINAL: Match = {
  id: 'f1',
  date: '19 de Julio, 2026 - 16:00',
  stadium: 'MetLife Stadium, NY',
  teamA: { name: 'Ganador Semifinal 1', flag: '⚽' },
  teamB: { name: 'Ganador Semifinal 2', flag: '⚽' },
  phase: 'Gran Final'
};

const UPCOMING_MATCHES: Match[] = [
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

export default function WorldCupBracket() {
  const { bracketData } = useApp();
  const [activeTab, setActiveTab] = useState<'bracket' | 'fixture'>('bracket');
  const [hoveredTeam, setHoveredTeam] = useState<string | null>(null);

  const octavos = bracketData.octavos.length > 0 ? bracketData.octavos : OCTAVOS;
  const quarters = bracketData.quarters.length > 0 ? bracketData.quarters : QUARTERS;
  const semis = bracketData.semis.length > 0 ? bracketData.semis : SEMIS;
  const final = bracketData.final.teamA?.name ? bracketData.final : FINAL;
  const upcoming = (bracketData.upcoming.length > 0 ? bracketData.upcoming : UPCOMING_MATCHES)
    .sort((a, b) => {
      if (!a.isoDate) return 1;
      if (!b.isoDate) return -1;
      return new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime();
    })
    .slice(0, 6);

  const renderTeamRow = (team: Team) => {
    const isHovered = hoveredTeam === team.name;
    const isWinner = team.winner;

    return (
      <div
        onMouseEnter={() => setHoveredTeam(team.name)}
        onMouseLeave={() => setHoveredTeam(null)}
        className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer ${isHovered
          ? 'bg-orange-500/10 border border-orange-500/20'
          : 'border border-transparent'
          }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-zinc-50 border border-zinc-200">
            {getTeamFlagUrl(team.flag, team.name) ? (
              <img src={getTeamFlagUrl(team.flag, team.name)!} alt={team.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs shrink-0 select-none">{team.flag}</span>
            )}
          </div>
          <span className={`text-xs uppercase font-bold truncate ${isWinner ? 'text-orange-600 font-extrabold' : 'text-zinc-700'
            }`}>
            {team.name}
          </span>
        </div>
        <div className={`text-xs font-black px-2 py-0.5 rounded-md font-mono ${isWinner
          ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20'
          : 'bg-zinc-100 text-zinc-400 border border-zinc-200/50'
          }`}>
          {team.score}
        </div>
      </div>
    );
  };

  return (
    <section id="fixture-section" className="py-20 px-4 relative max-w-7xl mx-auto bg-white">

      <div className="text-center mb-10 select-none">
        <p className="text-orange-500 font-black tracking-widest uppercase text-xs mb-1">
          Calendario & Fases
        </p>
        <h2 className="font-teko text-5xl text-zinc-900 uppercase tracking-widest">
          BRACKET FINAL REAL
        </h2>
        <div className="w-16 h-[2px] bg-orange-500 mx-auto mt-2 rounded-full" />
      </div>

      {/* Tabs Selector */}
      <div className="flex justify-center mb-10">
        <div className="bg-zinc-100 border border-zinc-200 rounded-full p-1.5 flex gap-1 shadow-sm backdrop-blur-md">
          <button
            onClick={() => setActiveTab('bracket')}
            className={`px-6 py-2 rounded-full font-teko text-lg uppercase tracking-wider transition-all duration-300 ${activeTab === 'bracket'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-zinc-500 hover:text-zinc-900'
              }`}
          >
            Bracket Octavos a Final
          </button>
          <button
            onClick={() => setActiveTab('fixture')}
            className={`px-6 py-2 rounded-full font-teko text-lg uppercase tracking-wider transition-all duration-300 ${activeTab === 'fixture'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'text-zinc-500 hover:text-zinc-900'
              }`}
          >
            Próximos Partidos
          </button>
        </div>
      </div>

      {activeTab === 'bracket' ? (
        /* Round of 16 Bracket tree with horizontal scrolling on mobile, 4 columns layout on desktop */
        <div className="w-full overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent">
          <div className="min-w-[1000px] lg:min-w-0 grid grid-cols-4 gap-6 items-start relative z-10 select-none px-2">

            {/* COLUMN 1: OCTAVOS DE FINAL */}
            <div className="space-y-4">
              <h4 className="text-[10px] text-zinc-400 uppercase tracking-widest font-black text-center mb-4 border-b border-zinc-200/80 pb-2">
                Octavos de Final
              </h4>

              <div className="space-y-4">
                {octavos.map((m) => (
                  <div key={m.id} className="bg-white border border-zinc-200/85 rounded-2xl p-3 shadow-md hover:border-orange-500/20 transition-all duration-300">
                    <div className="flex items-center justify-between text-[9px] text-zinc-400 mb-2 border-b border-zinc-100 pb-1 font-mono uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Calendar size={9} /> {m.date.split(' - ')[0]}</span>
                      <span className="text-orange-500 font-black">{m.phase}</span>
                    </div>
                    <div className="space-y-1">
                      {renderTeamRow(m.teamA)}
                      {renderTeamRow(m.teamB)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 2: CUARTOS DE FINAL */}
            <div className="space-y-4">
              <h4 className="text-[10px] text-zinc-400 uppercase tracking-widest font-black text-center mb-4 border-b border-zinc-200/80 pb-2">
                Cuartos de Final
              </h4>

              {/* Spaced vertically to line up with Octavos on desktop */}
              <div className="space-y-4 md:space-y-24 md:pt-10">
                {quarters.map((m) => (
                  <div key={m.id} className="bg-white border border-zinc-200/85 rounded-2xl p-3 shadow-md hover:border-orange-500/20 transition-all duration-300">
                    <div className="flex items-center justify-between text-[9px] text-zinc-400 mb-2 border-b border-zinc-100 pb-1 font-mono uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Calendar size={9} /> {m.date.split(' - ')[0]}</span>
                      <span className="text-orange-500 font-black">{m.phase}</span>
                    </div>
                    <div className="space-y-1">
                      {renderTeamRow(m.teamA)}
                      {renderTeamRow(m.teamB)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 3: SEMIFINALES */}
            <div className="space-y-4">
              <h4 className="text-[10px] text-zinc-400 uppercase tracking-widest font-black text-center mb-4 border-b border-zinc-200/80 pb-2">
                Semifinales
              </h4>

              {/* Spaced vertically to line up with Cuartos */}
              <div className="space-y-4 md:space-y-[340px] md:pt-[130px]">
                {semis.map((m) => (
                  <div key={m.id} className="bg-white border border-zinc-200/85 rounded-2xl p-3.5 shadow-md hover:border-orange-500/20 transition-all duration-300">
                    <div className="flex items-center justify-between text-[9px] text-zinc-400 mb-2 border-b border-zinc-100 pb-1 font-mono uppercase tracking-wider">
                      <span className="flex items-center gap-1"><Calendar size={9} /> {m.date.split(' - ')[0]}</span>
                      <span className="text-orange-500 font-bold">{m.phase}</span>
                    </div>
                    <div className="space-y-1">
                      {renderTeamRow(m.teamA)}
                      {renderTeamRow(m.teamB)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMN 4: GRAN FINAL */}
            <div className="space-y-4">
              <h4 className="text-[10px] text-zinc-400 uppercase tracking-widest font-black text-center mb-4 border-b border-zinc-200/80 pb-2">
                Gran Final
              </h4>

              <div className="space-y-6 md:pt-[220px]">
                <div className="bg-gradient-to-b from-orange-500/5 to-white border border-orange-500/20 rounded-3xl p-5 shadow-[0_15px_40px_rgba(249,115,22,0.06)] relative overflow-hidden">

                  <div className="text-center mb-4 relative">
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto mb-2">
                      <Trophy size={20} className="text-orange-500" />
                    </div>
                    <h5 className="font-teko text-2xl text-zinc-900 uppercase tracking-wider">{final.phase}</h5>
                    <p className="text-[9px] text-zinc-400 font-mono mt-0.5 uppercase tracking-widest">{final.date.split(' - ')[0]}</p>
                  </div>

                  <div className="space-y-1.5 mb-4 bg-zinc-50 border border-zinc-100 rounded-2xl p-2.5">
                    {renderTeamRow(final.teamA)}
                    <div className="h-[1px] bg-zinc-200/50 my-1" />
                    {renderTeamRow(final.teamB)}
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[9px] text-zinc-500 font-mono uppercase bg-white border border-zinc-200 py-2 px-3 rounded-xl shadow-sm">
                    <MapPin size={10} className="text-orange-500" />
                    <span className="truncate">{final.stadium.split(' / ')[0]}</span>
                  </div>
                </div>

                {/* Third place footer notice */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3 text-center">
                  <span className="text-[9px] text-zinc-400 uppercase font-black tracking-widest block mb-1">
                    Tercer Puesto
                  </span>
                  <p className="text-xs text-zinc-800 font-bold">
                    ⚽ Perdedor Semifinal 1 vs ⚽ Perdedor Semifinal 2 &mdash; 18 de Julio
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      ) : (
        /* Fixture Symmetric Ticket Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 select-none relative z-10">
          {upcoming.map((m) => {
            const hasScores = m.teamA.score !== undefined && m.teamA.score !== null && m.teamB.score !== undefined && m.teamB.score !== null;

            return (
              <div
                key={m.id}
                className={`bg-white border rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between shadow-md relative group overflow-hidden ${hasScores
                  ? 'border-orange-500/20 shadow-[0_20px_45px_rgba(249,115,22,0.04)] hover:border-orange-500/35'
                  : 'border-zinc-200 hover:border-orange-500/35 hover:shadow-[0_20px_45px_rgba(0,0,0,0.04)]'
                  }`}
              >
                {/* Header card info with dynamic badge */}
                <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-wider mb-5">
                  <span className="inline-flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full text-orange-600">
                    <Activity size={10} className="animate-pulse" /> {m.phase}
                  </span>
                  {hasScores ? (
                    <span className="bg-orange-500 text-white px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider shadow-sm">
                      Marcador
                    </span>
                  ) : (
                    <span className="bg-zinc-100 text-zinc-500 px-2.5 py-1 rounded-full text-[8px] font-black">
                      Próximo
                    </span>
                  )}
                </div>

                {/* Symmetric Match Layout */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  {/* Team A */}
                  <div className="flex-1 flex flex-col items-center text-center min-w-0">
                    <div className="w-14 h-14 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-inner overflow-hidden group-hover:scale-110 transition-transform duration-300 shrink-0 select-none">
                      {getTeamFlagUrl(m.teamA.flag, m.teamA.name) ? (
                        <img src={getTeamFlagUrl(m.teamA.flag, m.teamA.name)!} alt={m.teamA.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl shrink-0">{m.teamA.flag}</span>
                      )}
                    </div>
                    <span className="text-[11px] font-black uppercase text-zinc-800 tracking-wide mt-2 block w-full truncate">
                      {m.teamA.name}
                    </span>
                  </div>

                  {/* VS Badge / Scoreboard */}
                  <div className="flex flex-col items-center shrink-0 px-2">
                    {hasScores ? (
                      <div className="flex items-center gap-2.5 bg-zinc-950 px-3.5 py-2 rounded-2xl border border-zinc-800 shadow-xl font-mono text-lg font-black text-[#f97316] tracking-wider select-none">
                        <span>{m.teamA.score}</span>
                        <span className="text-zinc-600 text-xs font-bold">:</span>
                        <span>{m.teamB.score}</span>
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-zinc-950 flex items-center justify-center border-4 border-white shadow-md">
                        <span className="text-[10px] text-[#f97316] font-mono font-black">VS</span>
                      </div>
                    )}
                  </div>

                  {/* Team B */}
                  <div className="flex-1 flex flex-col items-center text-center min-w-0">
                    <div className="w-14 h-14 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-inner overflow-hidden group-hover:scale-110 transition-transform duration-300 shrink-0 select-none">
                      {getTeamFlagUrl(m.teamB.flag, m.teamB.name) ? (
                        <img src={getTeamFlagUrl(m.teamB.flag, m.teamB.name)!} alt={m.teamB.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl shrink-0">{m.teamB.flag}</span>
                      )}
                    </div>
                    <span className="text-[11px] font-black uppercase text-zinc-800 tracking-wide mt-2 block w-full truncate text-zinc-800">
                      {m.teamB.name}
                    </span>
                  </div>
                </div>

                {/* Match Venue & Time footer info */}
                <div className="border-t border-zinc-100 pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold bg-zinc-50 px-3 py-2 rounded-xl border border-zinc-100">
                    <Calendar size={12} className="text-orange-500 shrink-0" />
                    <span className="truncate">{m.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 bg-zinc-50/50 px-3 py-2 rounded-xl border border-zinc-100/50">
                    <MapPin size={12} className="text-zinc-400 shrink-0" />
                    <span className="truncate">{m.stadium}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
