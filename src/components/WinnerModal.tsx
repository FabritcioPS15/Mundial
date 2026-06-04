import { X, Trophy } from 'lucide-react';
import type { Winner } from '../types';

interface Props {
  winner: Winner;
  onClose: () => void;
}

export default function WinnerModal({ winner, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-gold/50 rounded-3xl p-8 max-w-md w-full shadow-[0_0_80px_rgba(249,115,22,0.3)] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Glow ring */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
        </div>

        <div className="relative text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.5)] animate-pulse-slow">
              <Trophy size={36} className="text-black" />
            </div>
          </div>

          <p className="text-gold font-semibold tracking-widest uppercase text-xs mb-2">
            Sorteo #{winner.drawNumber}
          </p>
          <h2 className="text-2xl font-black text-white mb-1">Tenemos Ganador!</h2>
          <p className="text-gray-500 text-sm mb-8">
            {new Date(winner.drawnAt).toLocaleString('es-ES')}
          </p>

          <div className="bg-white/5 border border-gold/30 rounded-2xl p-6 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zinc-800 to-black border-2 border-gold flex items-center justify-center mx-auto mb-4">
              <span className="text-gold font-black text-2xl">
                {(winner.participant.name || winner.participant.dni).charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="text-2xl font-black text-white mb-1">{winner.participant.name || winner.participant.dni}</h3>
            <div className="my-3">
              <span className="bg-orange-500/10 text-orange-400 border border-orange-500/30 px-3 py-1 rounded font-mono font-bold text-xs uppercase">
                🚗 {winner.participant.placa || 'N/A'}
              </span>
            </div>
            <p className="text-gray-500 text-xs">DNI: {winner.participant.dni}</p>

            <div className="border-t border-white/5 mt-4 pt-4">
              <span className="text-[9px] text-gray-500 uppercase tracking-widest block font-bold mb-2">Predicción del Podio</span>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="bg-zinc-950 border border-white/5 rounded-xl p-2">
                  <span className="text-xs block">🥇</span>
                  <span className="text-gray-500 block text-[8px] uppercase font-bold tracking-wider">Campeón</span>
                  <span className="text-orange-400 font-extrabold block mt-0.5 truncate">{winner.participant.champion || 'N/A'}</span>
                </div>
                <div className="bg-zinc-950 border border-white/5 rounded-xl p-2">
                  <span className="text-xs block">🥈</span>
                  <span className="text-gray-500 block text-[8px] uppercase font-bold tracking-wider">Subcampeón</span>
                  <span className="text-gray-300 font-extrabold block mt-0.5 truncate">{winner.participant.subchampion || 'N/A'}</span>
                </div>
                <div className="bg-zinc-950 border border-white/5 rounded-xl p-2">
                  <span className="text-xs block">🥉</span>
                  <span className="text-gray-500 block text-[8px] uppercase font-bold tracking-wider">3er Puesto</span>
                  <span className="text-orange-300/80 font-extrabold block mt-0.5 truncate">{winner.participant.thirdPlace || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-4xl mb-4">&#127881;</div>

          <button
            onClick={onClose}
            className="btn-gold px-8 py-3 rounded-xl font-bold uppercase tracking-wider"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
