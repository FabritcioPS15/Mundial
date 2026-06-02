import { useState } from 'react';
import { Search, Trash2, Users, Download, Upload, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id: string) => {
    await removeParticipant(id);
    setConfirmDelete(null);
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
      e.target.value = '';
    }
  };

  // Reset page when filters change
  const handleFilterChange = (newQuery: string, newSede: string) => {
    setQuery(newQuery);
    setSelectedSede(newSede);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleFilterChange(e.target.value, selectedSede)}
              placeholder="Buscar por DNI, teléfono o placa..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm"
            />
          </div>
          <div className="relative min-w-[220px]">
            <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <select
              value={selectedSede}
              onChange={(e) => handleFilterChange(query, e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-10 py-3 text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="">Todas las sedes</option>
              {sedes.map((sede) => (
                <option key={sede} value={sede} className="bg-zinc-900 text-white">
                  {sede}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</span>
          </div>
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
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
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            <Upload size={16} />
            {importing ? 'Importando...' : 'Importar'}
          </button>
          <button
            onClick={handleExport}
            disabled={participants.length === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
          >
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-600" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              {query ? 'Sin resultados para la búsqueda' : 'No hay participantes registrados'}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {query ? 'Intenta con otros términos' : 'Los registros aparecerán aquí'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {['DNI', 'Teléfono', 'Placa', 'Sede', 'Ticket', 'Predicciones', 'Fecha', ''].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((p: Participant, i) => (
                  <tr
                    key={p.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-all ${i % 2 === 0 ? '' : 'bg-white/[0.02]'
                      }`}
                  >
                    <td className="px-4 py-4">
                      <span className="text-white text-sm font-medium">{p.dni}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-sm">{p.phone}</td>
                    <td className="px-4 py-4">
                      <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-lg font-mono font-bold text-xs uppercase inline-block">
                        {p.placa || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-sm max-w-[200px] truncate">{p.sede || 'N/A'}</td>
                    <td className="px-4 py-4">
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg font-mono font-bold text-xs inline-block">
                        {p.ticketCode || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5 text-[10px] min-w-[140px]">
                        {/* Champion */}
                        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1.5">
                          <span className="text-sm">🥇</span>
                          {p.champion && getTeamFlagUrl('', p.champion) ? (
                            <img src={getTeamFlagUrl('', p.champion)!} alt="c" className="w-4 h-3 rounded object-cover" />
                          ) : null}
                          <span className="text-orange-400 font-extrabold truncate">
                            {p.champion ? p.champion.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]/g, '').trim() : 'N/A'}
                          </span>
                        </div>

                        {/* Subchampion */}
                        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1.5">
                          <span className="text-sm">🥈</span>
                          {p.subchampion && getTeamFlagUrl('', p.subchampion) ? (
                            <img src={getTeamFlagUrl('', p.subchampion)!} alt="s" className="w-4 h-3 rounded object-cover" />
                          ) : null}
                          <span className="text-gray-300 font-extrabold truncate">
                            {p.subchampion ? p.subchampion.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]/g, '').trim() : 'N/A'}
                          </span>
                        </div>

                        {/* Third place */}
                        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1.5">
                          <span className="text-sm">🥉</span>
                          {p.thirdPlace && getTeamFlagUrl('', p.thirdPlace) ? (
                            <img src={getTeamFlagUrl('', p.thirdPlace)!} alt="t" className="w-4 h-3 rounded object-cover" />
                          ) : null}
                          <span className="text-orange-300/80 font-extrabold truncate">
                            {p.thirdPlace ? p.thirdPlace.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]/g, '').trim() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-xs">
                      {new Date(p.registeredAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-4">
                      {confirmDelete === p.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition-all font-semibold"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-xs text-gray-500 hover:text-white transition-colors px-2 py-1.5"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(p.id)}
                          className="text-gray-600 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > itemsPerPage && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-white/10 bg-white/5">
            <p className="text-gray-500 text-xs">
              Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filtered.length)} de {filtered.length} participantes
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                        currentPage === pageNum
                          ? 'bg-orange-500 text-black'
                          : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-xs">
        <p className="text-gray-500">
          Total: <span className="text-white font-semibold">{filtered.length}</span> de <span className="text-white font-semibold">{participants.length}</span> participantes
        </p>
        {selectedSede && (
          <button
            onClick={() => handleFilterChange('', '')}
            className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1"
          >
            <Filter size={12} />
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
