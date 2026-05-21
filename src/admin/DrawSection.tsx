import { useState } from 'react';
import { Trophy, Shuffle, Clock, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import WinnerModal from '../components/WinnerModal';
import type { Winner } from '../types';

export default function DrawSection() {
  const { participants, winners, conductDraw, excludePrevious, setExcludePrevious } = useApp();
  const [drawing, setDrawing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [currentWinner, setCurrentWinner] = useState<Winner | null>(null);

  const eligible = excludePrevious
    ? participants.filter((p) => !winners.some((w) => w.participant.id === p.id))
    : participants;

  const handleDraw = async () => {
    if (eligible.length === 0) return;
    setDrawing(true);

    // Roulette animation
    const pool = eligible.map((p) => p.fullName);
    let i = 0;
    const interval = setInterval(() => {
      setDisplayName(pool[i % pool.length]);
      i++;
    }, 80);

    await new Promise((r) => setTimeout(r, 2500));
    clearInterval(interval);

    const winner = await conductDraw();
    setDrawing(false);
    if (winner) {
      setDisplayName(winner.participant.fullName);
      setCurrentWinner(winner);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Shuffle size={18} className="text-gold" /> Ejecutar Sorteo
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-800/30 border border-white/5 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-white">{participants.length}</p>
            <p className="text-gray-400 text-sm mt-1">Total participantes</p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-gold">{eligible.length}</p>
            <p className="text-gray-400 text-sm mt-1">Elegibles</p>
          </div>
        </div>

        <label className="flex items-center gap-3 mb-6 cursor-pointer group">
          <div
            onClick={() => setExcludePrevious(!excludePrevious)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              excludePrevious ? 'bg-gold' : 'bg-white/10'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
                excludePrevious ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </div>
          <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
            Evitar repetir ganadores anteriores
          </span>
        </label>

        {/* Roulette display */}
        <div className="bg-black/50 border border-gold/20 rounded-2xl p-6 text-center mb-6 min-h-[100px] flex items-center justify-center">
          {drawing ? (
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Seleccionando...</p>
              <p className="text-white font-black text-xl animate-pulse truncate max-w-xs">{displayName}</p>
              <div className="flex justify-center gap-1 mt-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 bg-gold rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          ) : displayName ? (
            <div>
              <p className="text-gold text-xs uppercase tracking-widest mb-1">Ultimo ganador</p>
              <p className="text-white font-black text-xl">{displayName}</p>
            </div>
          ) : (
            <p className="text-gray-600 text-sm">Presiona el boton para iniciar el sorteo</p>
          )}
        </div>

        <button
          onClick={handleDraw}
          disabled={drawing || eligible.length === 0}
          className="w-full btn-gold py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {drawing ? (
            <>
              <span className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
              Sorteando...
            </>
          ) : (
            <>
              <Trophy size={18} />
              Realizar Sorteo
            </>
          )}
        </button>

        {eligible.length === 0 && (
          <p className="text-orange-400 text-sm text-center mt-3">
            {participants.length === 0
              ? 'No hay participantes registrados'
              : 'Todos los participantes ya han ganado'}
          </p>
        )}
      </div>

      {/* Winners history */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Trophy size={18} className="text-gold" /> Historial de Ganadores
        </h3>
        {winners.length === 0 ? (
          <div className="text-center py-8">
            <Users size={32} className="mx-auto text-gray-700 mb-2" />
            <p className="text-gray-500 text-sm">Aun no se han realizado sorteos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...winners].reverse().map((w) => (
              <div
                key={`${w.participant.id}-${w.drawnAt}`}
                className="flex items-center gap-3 bg-black/30 rounded-xl p-4 border border-white/5"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0">
                  <Trophy size={15} className="text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold truncate">{w.participant.fullName}</p>
                    <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded font-mono font-bold text-[9px] uppercase">
                      {w.participant.placa || 'N/A'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs">{w.participant.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-gold text-xs font-bold">Sorteo #{w.drawNumber}</p>
                  <p className="text-gray-600 text-xs flex items-center gap-1 justify-end">
                    <Clock size={10} />
                    {new Date(w.drawnAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {currentWinner && (
        <WinnerModal winner={currentWinner} onClose={() => setCurrentWinner(null)} />
      )}
    </div>
  );
}
