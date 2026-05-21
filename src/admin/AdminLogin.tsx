import { useState, type FormEvent } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'mundial2026';

interface Props {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: Props) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem('admin_auth', '1');
      onLogin();
    } else {
      setError('Credenciales incorrectas');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-800/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(249,115,22,0.4)]">
            <Lock size={28} className="text-black" />
          </div>
          <h1 className="text-2xl font-black text-white">Panel Administrativo</h1>
          <p className="text-gray-500 text-sm mt-1">Mundial 2026 &mdash; Sistema de Sorteo</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Usuario</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Contrasena</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3 text-white placeholder-gray-600 outline-none focus:border-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gold py-4 rounded-xl font-bold text-base uppercase tracking-wider mt-6 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
            ) : (
              'Ingresar al panel'
            )}
          </button>

          <p className="text-center text-gray-600 text-xs mt-4">
            user: <span className="text-gray-400">admin</span> / pass:{' '}
            <span className="text-gray-400">mundial2026</span>
          </p>
        </form>

        <div className="text-center mt-6">
          <a href="/" className="text-gray-600 hover:text-gold text-sm transition-colors">
            &larr; Volver al sitio publico
          </a>
        </div>
      </div>
    </div>
  );
}
