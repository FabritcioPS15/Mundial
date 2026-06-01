import { useState } from 'react';
import { Users, Trophy, BarChart2, LogOut, Menu, X, Home, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ParticipantsTable from './ParticipantsTable';
import DrawSection from './DrawSection';
import ReportsSection from './ReportsSection';
import BracketSection from './BracketSection';
import PredictionStats from './PredictionStats';

type Tab = 'dashboard' | 'participants' | 'bracket' | 'draw' | 'reports';

interface Props {
  onLogout: () => void;
}

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'participants', label: 'Participantes', icon: Users },
  { id: 'bracket', label: 'Editar Bracket', icon: Activity },
  { id: 'draw', label: 'Sorteo', icon: Trophy },
  { id: 'reports', label: 'Reportes', icon: BarChart2 },
];

export default function AdminDashboard({ onLogout }: Props) {
  const { participants, winners } = useApp();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [menuOpen, setMenuOpen] = useState(false);

  const recent = [...participants].reverse().slice(0, 5);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-zinc-900 to-black border-r border-white/10 transform transition-transform duration-300 md:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <Trophy size={18} className="text-black" />
          </div>
          <div>
            <p className="text-white font-black text-sm leading-tight">Admin Panel</p>
            <p className="text-gray-500 text-xs">Mundial 2026</p>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                tab === id
                  ? 'bg-gold text-black'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-all"
          >
            <LogOut size={17} />
            Cerrar sesion
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-black/90 border-b border-white/10 backdrop-blur-sm px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="text-white font-black text-lg">
              {TABS.find((t) => t.id === tab)?.label}
            </h1>
          </div>
          <a
            href="/"
            className="text-gray-500 hover:text-gold text-sm transition-colors flex items-center gap-1.5"
          >
            <Home size={14} /> Sitio publico
          </a>
        </header>

        <main className="flex-1 p-4 md:p-6">
          {tab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total participantes', value: participants.length, color: 'text-white', icon: Users },
                  { label: 'Sorteos realizados', value: winners.length, color: 'text-gold', icon: Trophy },
                  { label: 'Elegibles activos', value: participants.filter(p => !winners.some(w => w.participant.id === p.id)).length, color: 'text-emerald-400', icon: Users },
                  { label: 'Ultimo sorteo', value: winners.length > 0 ? new Date(winners[winners.length - 1].drawnAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : '—', color: 'text-gray-300', icon: Trophy },
                ].map(({ label, value, color, icon: Icon }) => (
                  <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{label}</p>
                      <Icon size={16} className="text-gray-700" />
                    </div>
                    <p className={`text-2xl font-black ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Prediction Stats */}
              <PredictionStats participants={participants} />

              {/* Recent */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Users size={16} className="text-gold" /> Ultimos Registros
                </h3>
                {recent.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">Sin participantes aun</p>
                ) : (
                  <div className="space-y-3">
                    {recent.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
                          <span className="text-gold text-xs font-black">{p.placa?.charAt(0) || p.dni.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white text-sm font-medium truncate">{p.dni}</p>
                            <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded font-mono font-bold text-[9px] uppercase">
                              {p.placa || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-600 text-xs">{p.phone}</p>
                            {p.sede && <span className="text-gray-500 text-[10px]">• {p.sede}</span>}
                          </div>
                          {p.ticketCode && (
                            <p className="text-blue-400 text-[10px] font-mono">{p.ticketCode}</p>
                          )}
                        </div>
                        <span className="text-gray-600 text-xs">
                          {new Date(p.registeredAt).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'participants' && <ParticipantsTable />}
          {tab === 'bracket' && <BracketSection />}
          {tab === 'draw' && <DrawSection />}
          {tab === 'reports' && <ReportsSection />}
        </main>
      </div>
    </div>
  );
}
