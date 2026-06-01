import { useState } from 'react';
import { Search, Trash2, Users, Download, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToExcel } from '../utils/storage';
import { getTeamFlagUrl } from '../utils/flagHelper';
import { readExcelFile } from '../utils/excelImport';
import type { Participant } from '../types';

export default function ParticipantsTable() {
  const { participants, removeParticipant, showToast, importParticipants } = useApp();
  const [query, setQuery] = useState('');
  const [selectedSede, setSelectedSede] = useState<string>('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  // Get unique sedes
  const sedes = Array.from(new Set(participants.map(p => p.sede).filter(Boolean))).sort();

  const filtered = participants.filter((p) => {
    const q = query.toLowerCase();
    const matchesQuery =
      p.dni.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      (p.placa && p.placa.toLowerCase().includes(q)) ||
      (p.champion && p.champion.toLowerCase().includes(q)) ||
      (p.subchampion && p.subchampion.toLowerCase().includes(q)) ||
      (p.thirdPlace && p.thirdPlace.toLowerCase().includes(q));
    
    const matchesSede = !selectedSede || p.sede === selectedSede;
    
    return matchesQuery && matchesSede;
  });

  const handleDelete = async (id: string) => {
    await removeParticipant(id);
    setConfirmDelete(null);
    // The context already shows a success/error toast
  };

  const handleExport = async () => {
    const data: Record<string, string | number>[] = participants.map((p) => ({
      DNI: p.dni,
      Telefono: p.phone,
      Placa: p.placa || '',
      Sede: p.sede || '',
      Ticket: p.ticketCode || '',
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

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const data = await readExcelFile(file);
      const result = await importParticipants(data);
      
      if (result.success > 0) {
        showToast(`${result.success} participantes importados correctamente`, 'success');
      }
      if (result.errors.length > 0) {
        console.error('Import errors:', result.errors);
        showToast(`${result.errors.length} errores durante la importación. Revisa la consola.`, 'error');
      }
    } catch (error) {
      console.error('Error importing file:', error);
      showToast('Error al procesar el archivo Excel', 'error');
    } finally {
      setImporting(false);
      e.target.value = ''; // Reset file input
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por DNI, teléfono o placa..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 outline-none focus:border-gold transition-colors text-sm"
            />
          </div>
          <div className="relative min-w-[200px]">
            <select
              value={selectedSede}
              onChange={(e) => setSelectedSede(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-white outline-none focus:border-gold transition-colors text-sm appearance-none cursor-pointer"
            >
              <option value="">Todas las sedes</option>
              {sedes.map((sede) => (
                <option key={sede} value={sede} className="bg-zinc-900 text-white">
                  {sede}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</span>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImport}
            disabled={importing}
            className="hidden"
            id="excel-import"
          />
          <button
            onClick={() => document.getElementById('excel-import')?.click()}
            disabled={importing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Upload size={15} />
            {importing ? 'Importando...' : 'Importar Excel'}
          </button>
          <button
            onClick={handleExport}
            disabled={participants.length === 0}
            className="flex items-center gap-2 bg-[#107c41] hover:bg-[#107c41]/80 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={15} />
            Exportar Excel
          </button>
        </div>
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
                  {['DNI', 'Telefono', 'Placa', 'Sede', 'Ticket', 'Predicciones', 'Fecha', ''].map((h) => (
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
                    <td className="px-4 py-3 text-gray-400 text-sm">{p.dni}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{p.phone}</td>
                    <td className="px-4 py-3">
                      <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2.5 py-0.5 rounded font-mono font-bold text-xs uppercase">
                        {p.placa || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{p.sede || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded font-mono font-bold text-xs">
                        {p.ticketCode || 'N/A'}
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
