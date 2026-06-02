import { Trophy, Medal, Award, TrendingUp, BarChart3 } from 'lucide-react';
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

  const StatCard = ({ title, icon: Icon, stats, color, gradient }: {
    title: string;
    icon: any;
    stats: TeamStat[];
    color: string;
    gradient: string;
  }) => {
    const maxCount = Math.max(...stats.map(s => s.count), 1);

    return (
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-8 h-8 rounded-lg ${gradient} flex items-center justify-center`}>
            <Icon size={16} className={color} />
          </div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">{title}</h3>
        </div>

        {stats.length === 0 ? (
          <div className="text-center py-6">
            <BarChart3 size={24} className="mx-auto text-gray-600 mb-2" />
            <p className="text-gray-500 text-xs">Sin datos aún</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.map((stat, index) => (
              <div key={stat.name} className="group">
                <div className="flex items-center gap-2 mb-1.5">
                  {getTeamFlagUrl('', stat.name) && (
                    <img
                      src={getTeamFlagUrl('', stat.name)!}
                      alt=""
                      className="w-5 h-4 rounded object-cover border border-white/10"
                    />
                  )}
                  <span className="text-white text-xs font-medium truncate flex-1">{stat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-[10px] font-mono">{stat.count}</span>
                    <span className={`text-[10px] font-bold ${color}`}>{stat.percentage.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="h-10 bg-zinc-800/50 rounded-xl overflow-hidden relative group-hover:bg-zinc-800 transition-colors">
                  <div
                    className={`h-full rounded-xl transition-all duration-700 ease-out ${gradient} relative`}
                    style={{ width: `${(stat.count / maxCount) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
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
    const height = 70;
    const padding = 8;

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - (d.count / maxCount) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

    return (
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
            <TrendingUp size={16} className="text-orange-400" />
          </div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Evolución de Predicciones</h3>
        </div>
        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1={padding}
                y1={height - padding - ratio * (height - 2 * padding)}
                x2={width - padding}
                y2={height - padding - ratio * (height - 2 * padding)}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
            ))}
            {/* Area fill */}
            <polygon
              points={areaPoints}
              fill="url(#gradient)"
              opacity="0.3"
            />
            {/* Line */}
            <polyline
              points={points}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-lg"
            />
            {/* Points */}
            {data.map((d, i) => {
              const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
              const y = height - padding - (d.count / maxCount) * (height - 2 * padding);
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#f59e0b"
                    className="hover:r-5 transition-all cursor-pointer"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="2"
                    fill="#fff"
                  />
                </g>
              );
            })}
            {/* Gradients */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
          </svg>
          <div className="flex justify-between mt-3 text-[10px] text-gray-500">
            <span className="font-medium">{data[0].date}</span>
            <span className="font-medium">{data[data.length - 1].date}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
          <Trophy size={16} className="text-orange-400" />
        </div>
        <h2 className="text-white font-bold text-lg uppercase tracking-wider">Estadísticas de Predicciones</h2>
      </div>

      <TrendChart data={trendData} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Campeón"
          icon={Trophy}
          stats={championStats}
          color="text-yellow-400"
          gradient="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10"
        />
        <StatCard
          title="Subcampeón"
          icon={Medal}
          stats={subchampionStats}
          color="text-gray-300"
          gradient="bg-gradient-to-br from-gray-400/20 to-gray-500/10"
        />
        <StatCard
          title="Tercer Puesto"
          icon={Award}
          stats={thirdPlaceStats}
          color="text-orange-400"
          gradient="bg-gradient-to-br from-orange-500/20 to-orange-600/10"
        />
      </div>

      <div className="bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-center gap-3">
          <BarChart3 size={20} className="text-orange-400" />
          <p className="text-gray-400 text-sm">
            Total de participantes con predicciones: <span className="text-white font-bold text-lg">{participants.filter(p => p.champion).length}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
