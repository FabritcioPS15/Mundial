import { Clock, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTeamFlagUrl } from '../utils/flagHelper';

export default function RecentParticipants() {
  const { participants } = useApp();
  const recent = [...participants].reverse().slice(0, 10);

  return (
    <section id="recent-section" className="py-16 px-4 bg-transparent relative">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-6 select-none">
          <p className="text-orange-500 font-black tracking-widest uppercase text-xs mb-1">
            Comunidad
          </p>
          <h2 className="font-teko text-5xl text-zinc-900 uppercase tracking-widest">
            Últimos Registrados
          </h2>
          <div className="w-12 h-[2px] bg-orange-500 mx-auto mt-2 rounded-full" />
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-12 border border-zinc-200 rounded-3xl bg-zinc-50">
            <Users size={36} className="mx-auto text-zinc-300 mb-3" />
            <p className="text-zinc-500 text-sm font-semibold">Se el primero en registrarte</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-200 hover:scrollbar-thumb-zinc-300 scrollbar-track-transparent">
            {recent.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-4 bg-white border border-zinc-200/80 rounded-2xl px-4 py-3 hover:border-orange-500/25 hover:shadow-[0_8px_25px_rgba(0,0,0,0.02)] transition-all duration-300 shadow-sm"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Clean Light Avatar Circle */}
                <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200/60 flex items-center justify-center shrink-0">
                  <span className="text-zinc-800 font-black text-xs select-none">
                    {p.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-zinc-800 font-bold truncate text-sm">{p.fullName}</p>
                    {p.placa && (
                      <span className="bg-orange-500/10 text-orange-600 border border-orange-500/20 px-1.5 py-0.5 rounded font-mono font-bold text-[9px] uppercase tracking-wider">
                        🚗 {p.placa.replace(/(.{3}).+(.{1})/, '$1-**$2')}
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-400 text-[11px] truncate mt-0.5">
                    {p.email.replace(/(.{3}).+(@.+)/, '$1***$2')}
                  </p>

                  {/* Predicciones con banderas */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[10px] text-zinc-600 font-bold select-none">
                    <span className="text-[9px] text-zinc-400 font-mono uppercase tracking-widest mr-0.5">Predicción:</span>

                    {/* Champion */}
                    <span className="flex items-center gap-1 bg-zinc-50 border border-zinc-200/70 px-1.5 py-0.5 rounded-md text-[9px]">
                      <span className="text-xs shrink-0 select-none">🥇</span>
                      {p.champion && getTeamFlagUrl('', p.champion) ? (
                        <div className="w-3.5 h-3.5 rounded-full overflow-hidden shrink-0 border border-zinc-200/50">
                          <img src={getTeamFlagUrl('', p.champion)!} alt="c" className="w-full h-full object-cover" />
                        </div>
                      ) : null}
                      <span className="truncate">{p.champion ? p.champion.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]/g, '').trim() : 'N/A'}</span>
                    </span>

                    {/* Subchampion */}
                    <span className="flex items-center gap-1 bg-zinc-50 border border-zinc-200/70 px-1.5 py-0.5 rounded-md text-[9px]">
                      <span className="text-xs shrink-0 select-none">🥈</span>
                      {p.subchampion && getTeamFlagUrl('', p.subchampion) ? (
                        <div className="w-3.5 h-3.5 rounded-full overflow-hidden shrink-0 border border-zinc-200/50">
                          <img src={getTeamFlagUrl('', p.subchampion)!} alt="s" className="w-full h-full object-cover" />
                        </div>
                      ) : null}
                      <span className="truncate">{p.subchampion ? p.subchampion.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]/g, '').trim() : 'N/A'}</span>
                    </span>

                    {/* Third place */}
                    <span className="flex items-center gap-1 bg-zinc-50 border border-zinc-200/70 px-1.5 py-0.5 rounded-md text-[9px]">
                      <span className="text-xs shrink-0 select-none">🥉</span>
                      {p.thirdPlace && getTeamFlagUrl('', p.thirdPlace) ? (
                        <div className="w-3.5 h-3.5 rounded-full overflow-hidden shrink-0 border border-zinc-200/50">
                          <img src={getTeamFlagUrl('', p.thirdPlace)!} alt="t" className="w-full h-full object-cover" />
                        </div>
                      ) : null}
                      <span className="truncate">{p.thirdPlace ? p.thirdPlace.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]/g, '').trim() : 'N/A'}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-zinc-400 text-xs shrink-0 font-mono">
                  <Clock size={11} className="text-zinc-300" />
                  <span>
                    {new Date(p.registeredAt).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {participants.length > 10 && (
          <p className="text-center text-zinc-500 text-sm mt-5">
            y <span className="font-extrabold text-orange-500">{participants.length - 10}</span> participantes más...
          </p>
        )}
      </div>
    </section>
  );
}
