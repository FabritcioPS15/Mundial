import { useState } from 'react';
import { Trophy, Shuffle, Clock, Users, Sparkles, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import WinnerModal from '../components/WinnerModal';
import type { Winner } from '../types';

export default function DrawSection() {
  const { participants, winners, conductDraw, excludePrevious, setExcludePrevious } = useApp();
  const [drawing, setDrawing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [currentWinner, setCurrentWinner] = useState<Winner | null>(null);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'spinning' | 'slowing' | 'winner'>('idle');

  const eligible = excludePrevious
    ? participants.filter((p) => !winners.some((w) => w.participant.id === p.id))
    : participants;

  const handleDraw = async () => {
    if (eligible.length === 0) return;
    setDrawing(true);
    setAnimationPhase('spinning');

    // Roulette animation with phases
    const pool = eligible.map((p) => p.placa || p.dni);
    let i = 0;
    let speed = 50;

    const spin = () => {
      setDisplayName(pool[i % pool.length]);
      i++;
    };

    // Fast spin phase
    const fastInterval = setInterval(spin, speed);
    await new Promise((r) => setTimeout(r, 1500));
    clearInterval(fastInterval);

    // Slowing down phase
    setAnimationPhase('slowing');
    let slowSpeed = 150;
    const slowInterval = setInterval(() => {
      setDisplayName(pool[i % pool.length]);
      i++;
      slowSpeed += 20;
      if (slowSpeed > 400) {
        clearInterval(slowInterval);
      }
    }, slowSpeed);
    await new Promise((r) => setTimeout(r, 2000));

    // Winner phase
    setAnimationPhase('winner');
    const winner = await conductDraw();
    setDrawing(false);
    if (winner) {
      setDisplayName(winner.participant.placa || winner.participant.dni);
      setCurrentWinner(winner);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Shuffle size={20} className="text-orange-400" /> Ejecutar Sorteo
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-5 text-center hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
              <Users size={24} className="text-blue-400" />
            </div>
            <p className="text-4xl font-black text-white">{participants.length}</p>
            <p className="text-gray-400 text-sm mt-1">Total participantes</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-5 text-center hover:border-orange-500/30 transition-all">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
              <Trophy size={24} className="text-orange-400" />
            </div>
            <p className="text-4xl font-black text-orange-400">{eligible.length}</p>
            <p className="text-gray-400 text-sm mt-1">Elegibles</p>
          </div>
        </div>

        <label className="flex items-center gap-4 mb-6 cursor-pointer group p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
          <div
            onClick={() => setExcludePrevious(!excludePrevious)}
            className={`w-14 h-7 rounded-full transition-colors relative cursor-pointer ${
              excludePrevious ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-white/10'
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-lg ${
                excludePrevious ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </div>
          <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
            Evitar repetir ganadores anteriores
          </span>
        </label>

        {/* Roulette display */}
        <div className={`relative bg-gradient-to-br from-black/80 to-black/60 border-2 rounded-3xl p-8 text-center min-h-[180px] flex items-center justify-center transition-all duration-500 ${
          animationPhase === 'winner' ? 'border-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.5)]' : 'border-orange-500/20'
        }`}>
          {/* Background effects */}
          {animationPhase === 'spinning' && (
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
            </div>
          )}

          {animationPhase === 'winner' && (
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse" />
              <Sparkles className="absolute top-4 left-4 text-orange-400 w-6 h-6 animate-spin" />
              <Sparkles className="absolute top-4 right-4 text-yellow-400 w-6 h-6 animate-spin" style={{ animationDelay: '0.5s' }} />
              <Sparkles className="absolute bottom-4 left-4 text-orange-400 w-6 h-6 animate-spin" style={{ animationDelay: '1s' }} />
              <Sparkles className="absolute bottom-4 right-4 text-yellow-400 w-6 h-6 animate-spin" style={{ animationDelay: '1.5s' }} />
            </div>
          )}

          <div className="relative z-10">
            {drawing ? (
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-widest mb-3 font-semibold">
                  {animationPhase === 'spinning' ? '🎰 GIRANDO...' : animationPhase === 'slowing' ? '🎯 DETENIENDO...' : '🏆 GANADOR'}
                </p>
                <p className={`text-white font-black text-2xl md:text-3xl truncate max-w-md ${
                  animationPhase === 'spinning' ? 'animate-pulse' : animationPhase === 'winner' ? 'text-orange-400' : ''
                }`}>
                  {displayName}
                </p>
                {animationPhase === 'spinning' && (
                  <div className="flex justify-center gap-2 mt-4">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className="w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                )}
                {animationPhase === 'slowing' && (
                  <div className="flex justify-center gap-2 mt-4">
                    <Zap className="text-yellow-400 w-6 h-6 animate-pulse" />
                  </div>
                )}
              </div>
            ) : displayName ? (
              <div>
                <p className="text-orange-400 text-sm uppercase tracking-widest mb-2 font-semibold flex items-center justify-center gap-2">
                  <Trophy size={14} /> Último ganador
                </p>
                <p className="text-white font-black text-2xl md:text-3xl">{displayName}</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 text-base">Presiona el botón para iniciar el sorteo</p>
                <p className="text-gray-600 text-sm mt-2">🎲 ¡Buena suerte!</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleDraw}
          disabled={drawing || eligible.length === 0}
          className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 text-white py-5 rounded-2xl font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-orange-500/30 text-lg"
        >
          {drawing ? (
            <>
              <span className="w-6 h-6 border-3 border-white/40 border-t-white rounded-full animate-spin" />
              {animationPhase === 'spinning' ? 'Girando...' : animationPhase === 'slowing' ? 'Deteniendo...' : 'Procesando...'}
            </>
          ) : (
            <>
              <Trophy size={20} />
              Realizar Sorteo
            </>
          )}
        </button>

        {eligible.length === 0 && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
            <p className="text-red-400 text-sm font-medium">
              {participants.length === 0
                ? 'No hay participantes registrados'
                : 'Todos los participantes ya han ganado'}
            </p>
          </div>
        )}
      </div>

      {/* Winners history */}
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Trophy size={20} className="text-orange-400" /> Historial de Ganadores
        </h3>
        {winners.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-600" />
            </div>
            <p className="text-gray-500 text-base font-medium">Aún no se han realizado sorteos</p>
            <p className="text-gray-600 text-sm mt-1">Los ganadores aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...winners].reverse().map((w, index) => (
              <div
                key={`${w.participant.id}-${w.drawnAt}`}
                className={`flex items-center gap-4 bg-gradient-to-r from-black/30 to-black/20 rounded-2xl p-5 border border-white/5 hover:border-orange-500/30 transition-all ${
                  index === 0 ? 'border-orange-500/30 shadow-lg shadow-orange-500/10' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  index === 0
                    ? 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 shadow-lg shadow-orange-500/30'
                    : 'bg-white/5 border border-white/10'
                }`}>
                  <Trophy size={20} className={index === 0 ? 'text-black' : 'text-gray-600'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold truncate">{w.participant.placa || w.participant.dni}</p>
                    {index === 0 && (
                      <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-black px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        Reciente
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase">
                      {w.participant.placa || 'N/A'}
                    </span>
                    <p className="text-gray-500 text-xs">{w.participant.phone}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-xs font-bold ${index === 0 ? 'text-orange-400' : 'text-gray-400'}`}>
                    Sorteo #{w.drawNumber}
                  </p>
                  <p className="text-gray-600 text-xs flex items-center gap-1 justify-end mt-1">
                    <Clock size={12} />
                    {new Date(w.drawnAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: '2-digit',
                    })}
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
