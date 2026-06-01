import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { getTeamFlagUrl } from '../utils/flagHelper';
import type { Participant } from '../types';

interface TeamStat {
  name: string;
  count: number;
  percentage: number;
}

interface TrendData {
  date: string;
  count: number;
}

interface PredictionStatsProps {
  participants: Participant[];
}

export default function PredictionStats({ participants }: PredictionStatsProps) {
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
      .slice(0, 5);
  };

  const calculateTrend = (): TrendData[] => {
    const withPredictions = participants.filter(p => p.champion);
    if (withPredictions.length === 0) return [];

    const dateMap = new Map<string, number>();
    withPredictions.forEach(p => {
      const date = new Date(p.registeredAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });

    const sortedDates = Array.from(dateMap.entries()).sort((a, b) => {
      const dateA = new Date(a[0].split('/').reverse().join('-'));
      const dateB = new Date(b[0].split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });

    let cumulative = 0;
    return sortedDates.map(([date, count]) => {
      cumulative += count;
      return { date, count: cumulative };
    });
  };

  const championStats = calculateStats('champion');
  const subchampionStats = calculateStats('subchampion');
  const thirdPlaceStats = calculateStats('thirdPlace');
  const trendData = calculateTrend();

  const StatCard = ({ title, icon: Icon, stats, color }: {
    title: string;
    icon: any;
    stats: TeamStat[];
    color: string;
  }) => {
    const maxCount = Math.max(...stats.map(s => s.count), 1);

    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Icon size={18} className={color} />
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">{title}</h3>
        </div>

        {stats.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-4">Sin datos aún</p>
        ) : (
          <div className="space-y-3">
            {stats.map((stat, index) => (
              <div key={stat.name} className="flex items-end gap-3">
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
                    <span className="text-gray-400 text-[10px] font-mono ml-auto">{stat.count}</span>
                  </div>
                  <div className="h-8 bg-zinc-800 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full rounded-lg transition-all duration-500 ${color.replace('text-', 'bg-')} bg-opacity-80`}
                      style={{ width: `${(stat.count / maxCount) * 100}%` }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow">
                      {stat.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const TrendChart = ({ data }: { data: TrendData[] }) => {
    if (data.length === 0) return null;

    const maxCount = Math.max(...data.map(d => d.count));
    const width = 100;
    const height = 60;
    const padding = 5;

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - (d.count / maxCount) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-gold" />
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Evolución de Predicciones</h3>
        </div>
        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1={padding}
                y1={height - padding - ratio * (height - 2 * padding)}
                x2={width - padding}
                y2={height - padding - ratio * (height - 2 * padding)}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
              />
            ))}
            {/* Line */}
            <polyline
              points={points}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Points */}
            {data.map((d, i) => {
              const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
              const y = height - padding - (d.count / maxCount) * (height - 2 * padding);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="#f59e0b"
                  className="hover:r-3 transition-all"
                />
              );
            })}
          </svg>
          <div className="flex justify-between mt-2 text-[10px] text-gray-500">
            <span>{data[0].date}</span>
            <span>{data[data.length - 1].date}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Trophy size={20} className="text-gold" />
        <h2 className="text-white font-bold text-lg uppercase tracking-wider">Estadísticas de Predicciones</h2>
      </div>

      <TrendChart data={trendData} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Campeón"
          icon={Trophy}
          stats={championStats}
          color="text-yellow-400"
        />
        <StatCard
          title="Subcampeón"
          icon={Medal}
          stats={subchampionStats}
          color="text-gray-300"
        />
        <StatCard
          title="Tercer Puesto"
          icon={Award}
          stats={thirdPlaceStats}
          color="text-orange-400"
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="text-gray-400 text-xs text-center">
          Total de participantes con predicciones: <span className="text-white font-bold">{participants.filter(p => p.champion).length}</span>
        </p>
      </div>
    </div>
  );
}
