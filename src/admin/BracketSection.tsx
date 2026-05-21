import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, Trophy, Save, HelpCircle, ArrowRight } from 'lucide-react';
import type { Match, BracketData } from '../types';

export default function BracketSection() {
  const { bracketData, updateBracketData } = useApp();

  // Local state to modify bracket matches before saving
  const [localBracket, setLocalBracket] = useState<BracketData>({ ...bracketData });
  const [selectedPhase, setSelectedPhase] = useState<'octavos' | 'quarters' | 'semis' | 'final'>('octavos');
  const [activeMatchId, setActiveMatchId] = useState<string>('o1');

  // Find currently active match
  const getActiveMatch = (): Match | null => {
    if (selectedPhase === 'final') return localBracket.final;
    const matches = localBracket[selectedPhase] as Match[];
    return matches.find((m) => m.id === activeMatchId) || null;
  };

  const activeMatch = getActiveMatch();

  // Score changer callback
  const handleScoreChange = (teamKey: 'teamA' | 'teamB', value: string) => {
    if (!activeMatch) return;
    const updatedMatch = {
      ...activeMatch,
      [teamKey]: {
        ...activeMatch[teamKey],
        score: value === '' ? '?' : value,
      },
    };
    updateMatchInState(updatedMatch);
  };

  // Name and Flag changer callback
  const handleNameFlagChange = (teamKey: 'teamA' | 'teamB', field: 'name' | 'flag', value: string) => {
    if (!activeMatch) return;
    const updatedMatch = {
      ...activeMatch,
      [teamKey]: {
        ...activeMatch[teamKey],
        [field]: value,
      },
    };
    
    // Automatically propagate the updated details to the next phase if winner is selected
    const nextBracket = propagateWinner(updatedMatch);
    setLocalBracket(nextBracket);
  };

  // Winner selector callback
  const handleWinnerToggle = (winnerKey: 'teamA' | 'teamB') => {
    if (!activeMatch) return;
    const loserKey = winnerKey === 'teamA' ? 'teamB' : 'teamA';
    const updatedMatch = {
      ...activeMatch,
      [winnerKey]: { ...activeMatch[winnerKey], winner: true },
      [loserKey]: { ...activeMatch[loserKey], winner: false },
    };
    
    // Automatically propagate the winner to the next phase
    const nextBracket = propagateWinner(updatedMatch);
    setLocalBracket(nextBracket);
  };

  // Internal helper to update a match in the local state
  const updateMatchInState = (updatedMatch: Match) => {
    if (selectedPhase === 'final') {
      setLocalBracket((prev) => ({ ...prev, final: updatedMatch }));
    } else {
      setLocalBracket((prev) => ({
        ...prev,
        [selectedPhase]: (prev[selectedPhase] as Match[]).map((m) =>
          m.id === updatedMatch.id ? updatedMatch : m
        ),
      }));
    }
  };

  // Propagation logic to automatically advance winners!
  const propagateWinner = (match: Match): BracketData => {
    const next = { ...localBracket };
    
    // Deep clone arrays to avoid mutation
    next.octavos = [...next.octavos];
    next.quarters = [...next.quarters];
    next.semis = [...next.semis];
    next.final = { ...next.final };

    // 1. Update matching stage
    if (selectedPhase === 'octavos') {
      next.octavos = next.octavos.map((m) => (m.id === match.id ? match : m));
    } else if (selectedPhase === 'quarters') {
      next.quarters = next.quarters.map((m) => (m.id === match.id ? match : m));
    } else if (selectedPhase === 'semis') {
      next.semis = next.semis.map((m) => (m.id === match.id ? match : m));
    } else if (selectedPhase === 'final') {
      next.final = match;
      return next;
    }

    const winner = match.teamA.winner ? match.teamA : match.teamB.winner ? match.teamB : null;
    if (!winner) return next;

    // 2. Propagate from Octavos to Quarters
    if (selectedPhase === 'octavos') {
      // o1 & o2 -> q1
      if (match.id === 'o1') next.quarters[0].teamA = { ...next.quarters[0].teamA, name: winner.name, flag: winner.flag };
      if (match.id === 'o2') next.quarters[0].teamB = { ...next.quarters[0].teamB, name: winner.name, flag: winner.flag };
      // o3 & o4 -> q2
      if (match.id === 'o3') next.quarters[1].teamA = { ...next.quarters[1].teamA, name: winner.name, flag: winner.flag };
      if (match.id === 'o4') next.quarters[1].teamB = { ...next.quarters[1].teamB, name: winner.name, flag: winner.flag };
      // o5 & o6 -> q3
      if (match.id === 'o5') next.quarters[2].teamA = { ...next.quarters[2].teamA, name: winner.name, flag: winner.flag };
      if (match.id === 'o6') next.quarters[2].teamB = { ...next.quarters[2].teamB, name: winner.name, flag: winner.flag };
      // o7 & o8 -> q4
      if (match.id === 'o7') next.quarters[3].teamA = { ...next.quarters[3].teamA, name: winner.name, flag: winner.flag };
      if (match.id === 'o8') next.quarters[3].teamB = { ...next.quarters[3].teamB, name: winner.name, flag: winner.flag };
    }

    // 3. Propagate from Quarters to Semis
    if (selectedPhase === 'quarters') {
      // q1 & q2 -> s1
      if (match.id === 'q1') next.semis[0].teamA = { ...next.semis[0].teamA, name: winner.name, flag: winner.flag };
      if (match.id === 'q2') next.semis[0].teamB = { ...next.semis[0].teamB, name: winner.name, flag: winner.flag };
      // q3 & q4 -> s2
      if (match.id === 'q3') next.semis[1].teamA = { ...next.semis[1].teamA, name: winner.name, flag: winner.flag };
      if (match.id === 'q4') next.semis[1].teamB = { ...next.semis[1].teamB, name: winner.name, flag: winner.flag };
    }

    // 4. Propagate from Semis to Grand Final
    if (selectedPhase === 'semis') {
      if (match.id === 's1') next.final.teamA = { ...next.final.teamA, name: winner.name, flag: winner.flag };
      if (match.id === 's2') next.final.teamB = { ...next.final.teamB, name: winner.name, flag: winner.flag };
    }

    return next;
  };

  // Submit back to context
  const handleSave = () => {
    updateBracketData(localBracket);
  };

  return (
    <div className="space-y-6 text-white">
      
      {/* Visual Instruction Banner */}
      <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex gap-3 items-center">
        <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
          <HelpCircle size={20} />
        </div>
        <div>
          <h4 className="font-bold text-sm">Flujo de Bracket Inteligente Activo</h4>
          <p className="text-gray-400 text-xs mt-0.5">
            Ingresa los goles y selecciona al ganador. El sistema **avanzará automáticamente** al equipo victorioso a la siguiente fase del fixture.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Match List Selector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Fase del Torneo</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'octavos', label: 'Octavos (16)', startId: 'o1' },
                { id: 'quarters', label: 'Cuartos (8)', startId: 'q1' },
                { id: 'semis', label: 'Semifinales (4)', startId: 's1' },
                { id: 'final', label: 'Gran Final (2)', startId: 'f1' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPhase(p.id as any);
                    setActiveMatchId(p.startId);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold uppercase transition-all ${
                    selectedPhase === p.id
                      ? 'bg-orange-500 text-black shadow-md'
                      : 'bg-zinc-950 border border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Matches in the selected phase */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4 space-y-2 max-h-[350px] overflow-y-auto">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Partidos Disponibles</h3>
            {selectedPhase === 'final' ? (
              <button
                onClick={() => setActiveMatchId('f1')}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left border transition-all ${
                  activeMatchId === 'f1'
                    ? 'border-orange-500/50 bg-orange-500/10'
                    : 'border-white/5 bg-zinc-950/40 hover:bg-zinc-950'
                }`}
              >
                <div>
                  <span className="text-[10px] text-orange-500 font-bold block mb-1">FINALÍSIMA</span>
                  <span className="text-xs font-semibold block">{localBracket.final.teamA.name || '?'} vs {localBracket.final.teamB.name || '?'}</span>
                </div>
                <ArrowRight size={14} className="text-gray-500" />
              </button>
            ) : (
              (localBracket[selectedPhase] as Match[]).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMatchId(m.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left border transition-all ${
                    activeMatchId === m.id
                      ? 'border-orange-500/50 bg-orange-500/10'
                      : 'border-white/5 bg-zinc-950/40 hover:bg-zinc-950'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="text-[9px] text-gray-500 block mb-0.5">{m.phase}</span>
                    <span className="text-xs font-semibold truncate block">
                      {m.teamA.flag} {m.teamA.name || '?'} vs {m.teamB.flag} {m.teamB.name || '?'}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono bg-zinc-950 px-2 py-0.5 rounded text-gray-400">
                    {m.teamA.score ?? '?'} - {m.teamB.score ?? '?'}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Score Editor Details */}
        <div className="lg:col-span-7">
          {activeMatch ? (
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 space-y-6 relative overflow-hidden">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="bg-orange-500/10 text-orange-400 border border-orange-500/25 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase">
                    {activeMatch.phase || selectedPhase}
                  </span>
                  <h4 className="text-base font-bold mt-1 text-white">Editor de Marcadores</h4>
                </div>
                <Trophy size={20} className="text-orange-500" />
              </div>

              {/* Graphical Team vs Team Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center bg-zinc-950/80 p-5 rounded-2xl border border-white/5">
                
                {/* TEAM A Column */}
                <div className="sm:col-span-5 flex flex-col items-center space-y-3">
                  {/* Flag and Name inputs */}
                  <div className="flex flex-col gap-2 items-center w-full">
                    <input
                      type="text"
                      maxLength={10}
                      value={activeMatch.teamA.flag}
                      onChange={(e) => handleNameFlagChange('teamA', 'flag', e.target.value)}
                      placeholder="⚽"
                      className="w-12 h-10 bg-zinc-900 border border-white/10 text-center rounded-xl text-2xl text-white focus:outline-none focus:border-orange-500"
                      title="Icono/Emoji"
                    />
                    <input
                      type="text"
                      value={activeMatch.teamA.name}
                      onChange={(e) => handleNameFlagChange('teamA', 'name', e.target.value)}
                      placeholder="Equipo A"
                      className="w-full h-9 bg-zinc-900 border border-white/10 px-2 rounded-xl text-xs font-black text-center text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <input
                    type="text"
                    value={activeMatch.teamA.score === '?' ? '' : activeMatch.teamA.score}
                    placeholder="?"
                    onChange={(e) => handleScoreChange('teamA', e.target.value)}
                    className="w-16 h-12 bg-zinc-900 border border-white/10 text-center rounded-xl font-black text-xl text-orange-500 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    onClick={() => handleWinnerToggle('teamA')}
                    className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg border transition-all ${
                      activeMatch.teamA.winner
                        ? 'bg-orange-500 border-orange-500 text-black'
                        : 'border-white/10 text-gray-500 hover:text-white'
                    }`}
                  >
                    {activeMatch.teamA.winner ? '¡Ganador!' : 'Marcar Ganador'}
                  </button>
                </div>

                {/* VS center Column */}
                <div className="sm:col-span-1 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-600 font-mono font-bold">VS</span>
                </div>

                {/* TEAM B Column */}
                <div className="sm:col-span-5 flex flex-col items-center space-y-3">
                  {/* Flag and Name inputs */}
                  <div className="flex flex-col gap-2 items-center w-full">
                    <input
                      type="text"
                      maxLength={10}
                      value={activeMatch.teamB.flag}
                      onChange={(e) => handleNameFlagChange('teamB', 'flag', e.target.value)}
                      placeholder="⚽"
                      className="w-12 h-10 bg-zinc-900 border border-white/10 text-center rounded-xl text-2xl text-white focus:outline-none focus:border-orange-500"
                      title="Icono/Emoji"
                    />
                    <input
                      type="text"
                      value={activeMatch.teamB.name}
                      onChange={(e) => handleNameFlagChange('teamB', 'name', e.target.value)}
                      placeholder="Equipo B"
                      className="w-full h-9 bg-zinc-900 border border-white/10 px-2 rounded-xl text-xs font-black text-center text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <input
                    type="text"
                    value={activeMatch.teamB.score === '?' ? '' : activeMatch.teamB.score}
                    placeholder="?"
                    onChange={(e) => handleScoreChange('teamB', e.target.value)}
                    className="w-16 h-12 bg-zinc-900 border border-white/10 text-center rounded-xl font-black text-xl text-orange-500 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    onClick={() => handleWinnerToggle('teamB')}
                    className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg border transition-all ${
                      activeMatch.teamB.winner
                        ? 'bg-orange-500 border-orange-500 text-black'
                        : 'border-white/10 text-gray-500 hover:text-white'
                    }`}
                  >
                    {activeMatch.teamB.winner ? '¡Ganador!' : 'Marcar Ganador'}
                  </button>
                </div>

              </div>

              {/* Stadium and Calendar Detail settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black block mb-1">
                    Estadio y Ubicación
                  </label>
                  <div className="flex items-center gap-2 bg-zinc-950 p-2.5 rounded-xl border border-white/5 text-xs text-gray-300">
                    <MapPin size={14} className="text-orange-500 shrink-0" />
                    <input
                      type="text"
                      value={activeMatch.stadium}
                      onChange={(e) => updateMatchInState({ ...activeMatch, stadium: e.target.value })}
                      className="bg-transparent border-none focus:outline-none w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black block mb-1">
                    Fecha y Hora
                  </label>
                  <div className="flex items-center gap-2 bg-zinc-950 p-2.5 rounded-xl border border-white/5 text-xs text-gray-300">
                    <Calendar size={14} className="text-orange-500 shrink-0" />
                    <input
                      type="text"
                      value={activeMatch.date}
                      onChange={(e) => updateMatchInState({ ...activeMatch, date: e.target.value })}
                      className="bg-transparent border-none focus:outline-none w-full"
                    />
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="border-t border-white/10 pt-4 flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold uppercase tracking-widest px-8 py-3 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 transition-all text-xs"
                >
                  <Save size={14} /> Guardar Bracket
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-12 text-center text-gray-500">
              Selecciona un partido a la izquierda para comenzar a editar
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
