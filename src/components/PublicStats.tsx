import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTeamFlagUrl } from '../utils/flagHelper';

interface TeamStat {
  name: string;
  count: number;
  percentage: number;
}

export default function PublicStats() {
  const { participants } = useApp();

  const calculateStats = (field: 'champion' | 'subchampion' | 'thirdPlace'): TeamStat[] => {
    const validParticipants = participants.filter(p => p[field]);
    const total = validParticipants.length;

    if (total === 0) return [];

    const counts = new Map<string, number>();
    validParticipants.forEach(p => {
      const name = p[field]!;
      counts.set(name, (counts.get(name) || 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([name, count]) => ({
        name: name.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]/g, '').trim(),
        count,
        percentage: (count / total) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  };

  const championStats = calculateStats('champion');
  const totalPredictions = participants.filter(p => p.champion).length;

  if (totalPredictions === 0) return null;

  return (
    <div className="bg-gradient-to-b from-zinc-900 to-black py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp size={24} className="text-gold" />
            <h2 className="text-white font-black text-2xl md:text-3xl uppercase tracking-wider">
              ¿Cómo van las predicciones?
            </h2>
          </div>
          <p className="text-gray-400 text-sm">
            {totalPredictions} personas ya han hecho sus predicciones
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Campeón */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-gold/50 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={20} className="text-yellow-400" />
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Campeón</h3>
            </div>
            <div className="space-y-3">
              {championStats.slice(0, 3).map((stat, index) => (
                <div key={stat.name} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
                    <span className={`text-[10px] font-black ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : 'text-orange-400'}`}>
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getTeamFlagUrl('', stat.name) && (
                        <img
                          src={getTeamFlagUrl('', stat.name)!}
                          alt=""
                          className="w-4 h-3 rounded object-cover"
                        />
                      )}
                      <span className="text-white text-xs font-medium truncate">{stat.name}</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-gray-400 text-[10px] font-mono">{stat.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subcampeón */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-gray-400/50 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <Medal size={20} className="text-gray-300" />
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Subcampeón</h3>
            </div>
            <div className="space-y-3">
              {calculateStats('subchampion').slice(0, 3).map((stat, index) => (
                <div key={stat.name} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
                    <span className={`text-[10px] font-black ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : 'text-orange-400'}`}>
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getTeamFlagUrl('', stat.name) && (
                        <img
                          src={getTeamFlagUrl('', stat.name)!}
                          alt=""
                          className="w-4 h-3 rounded object-cover"
                        />
                      )}
                      <span className="text-white text-xs font-medium truncate">{stat.name}</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-300 rounded-full transition-all duration-500"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-gray-400 text-[10px] font-mono">{stat.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tercer Puesto */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-400/50 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <Award size={20} className="text-orange-400" />
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Tercer Puesto</h3>
            </div>
            <div className="space-y-3">
              {calculateStats('thirdPlace').slice(0, 3).map((stat, index) => (
                <div key={stat.name} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
                    <span className={`text-[10px] font-black ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : 'text-orange-400'}`}>
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getTeamFlagUrl('', stat.name) && (
                        <img
                          src={getTeamFlagUrl('', stat.name)!}
                          alt=""
                          className="w-4 h-3 rounded object-cover"
                        />
                      )}
                      <span className="text-white text-xs font-medium truncate">{stat.name}</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-400 rounded-full transition-all duration-500"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-gray-400 text-[10px] font-mono">{stat.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
