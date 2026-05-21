import { useState } from 'react';
import { Search, Trash2, Users, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToExcel } from '../utils/storage';
import { getTeamFlagUrl } from '../utils/flagHelper';
import type { Participant } from '../types';

export default function ParticipantsTable() {
  const { participants, removeParticipant, showToast } = useApp();
  const [query, setQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = participants.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.dni.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      (p.placa && p.placa.toLowerCase().includes(q)) ||
      (p.champion && p.champion.toLowerCase().includes(q)) ||
      (p.subchampion && p.subchampion.toLowerCase().includes(q)) ||
      (p.thirdPlace && p.thirdPlace.toLowerCase().includes(q))
    );
  });

  const handleDelete = async (id: string) => {
    await removeParticipant(id);
    setConfirmDelete(null);
    // The context already shows a success/error toast
  };

  const handleExport = async () => {
    const data: Record<string, string | number>[] = participants.map((p) => ({
      Nombre: p.fullName,
      DNI: p.dni,
      Email: p.email,
      Telefono: p.phone,
      Placa: p.placa || '',
      Campeon: p.champion || '',
      Subcampeon: p.subchampion || '',
      TercerPuesto: p.thirdPlace || '',
      Registro: new Date(p.registeredAt).toLocaleString('es-ES'),
    }));
    
    try {
      await exportToExcel(data, 'participantes_mundial2026.xlsx');
      showToast('Exportación exitosa', 'success');
    } catch (e) {
      console.error(e);
      showToast('Error al exportar', 'error');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, DNI o email..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 outline-none focus:border-gold transition-colors text-sm"
          />
        </div>
        <button
          onClick={handleExport}
          disabled={participants.length === 0}
          className="flex items-center gap-2 bg-[#107c41] hover:bg-[#107c41]/80 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download size={15} />
          Exportar Excel
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Users size={36} className="mx-auto text-gray-700 mb-3" />
            <p className="text-gray-500">
              {query ? 'Sin resultados para la busqueda' : 'No hay participantes registrados'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Nombre', 'DNI', 'Email', 'Telefono', 'Placa', 'Predicciones', 'Fecha', ''].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p: Participant, i) => (
                  <tr
                    key={p.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/2'
                      }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-black text-gold">
                            {p.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white text-sm font-medium">{p.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{p.dni}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{p.email}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{p.phone}</td>
                    <td className="px-4 py-3">
                      <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-0.5 rounded font-mono font-bold text-xs uppercase">
                        {p.placa || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 text-[10px] min-w-[120px]">
                        {/* Champion */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">🥇</span>
                          {p.champion && getTeamFlagUrl('', p.champion) ? (
                            <div className="w-3.5 h-3.5 rounded-full overflow-hidden shrink-0 border border-white/10">
                              <img src={getTeamFlagUrl('', p.champion)!} alt="c" className="w-full h-full object-cover" />
                            </div>
                          ) : null}
                          <span className="text-orange-400 font-extrabold truncate">
                            {p.champion ? p.champion.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]/g, '').trim() : 'N/A'}
                          </span>
                        </div>

                        {/* Subchampion */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">🥈</span>
                          {p.subchampion && getTeamFlagUrl('', p.subchampion) ? (
                            <div className="w-3.5 h-3.5 rounded-full overflow-hidden shrink-0 border border-white/10">
                              <img src={getTeamFlagUrl('', p.subchampion)!} alt="s" className="w-full h-full object-cover" />
                            </div>
                          ) : null}
                          <span className="text-gray-300 font-extrabold truncate">
                            {p.subchampion ? p.subchampion.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]/g, '').trim() : 'N/A'}
                          </span>
                        </div>

                        {/* Third place */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">🥉</span>
                          {p.thirdPlace && getTeamFlagUrl('', p.thirdPlace) ? (
                            <div className="w-3.5 h-3.5 rounded-full overflow-hidden shrink-0 border border-white/10">
                              <img src={getTeamFlagUrl('', p.thirdPlace)!} alt="t" className="w-full h-full object-cover" />
                            </div>
                          ) : null}
                          <span className="text-orange-300/80 font-extrabold truncate">
                            {p.thirdPlace ? p.thirdPlace.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]/g, '').trim() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(p.registeredAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {confirmDelete === p.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-xs text-gray-500 hover:text-white transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(p.id)}
                          className="text-gray-600 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-gray-600 text-xs">
        {filtered.length} de {participants.length} participantes
      </p>
    </div>
  );
}
