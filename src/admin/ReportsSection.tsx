import { Download, FileText, Trophy, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToExcel } from '../utils/storage';

export default function ReportsSection() {
  const { participants, winners, showToast } = useApp();

  const exportParticipants = async () => {
    const data = participants.map((p) => ({
      Nombre: p.fullName,
      DNI: p.dni,
      Email: p.email,
      Telefono: p.phone,
      Placa: p.placa || 'N/A',
      Campeon: p.champion || 'N/A',
      Subcampeon: p.subchampion || 'N/A',
      TercerPuesto: p.thirdPlace || 'N/A',
      'Fecha de registro': new Date(p.registeredAt).toLocaleString('es-ES'),
    }));
    try {
      await exportToExcel(data, 'participantes_mundial2026.xlsx');
      showToast('Participantes exportados exitosamente', 'success');
    } catch (e) {
      console.error(e);
      showToast('Error al exportar', 'error');
    }
  };

  const exportWinners = async () => {
    const data = winners.map((w) => ({
      'N° Sorteo': w.drawNumber,
      Ganador: w.participant.fullName,
      DNI: w.participant.dni,
      Email: w.participant.email,
      Telefono: w.participant.phone,
      'Fecha del sorteo': new Date(w.drawnAt).toLocaleString('es-ES'),
    }));
    try {
      await exportToExcel(data, 'ganadores_mundial2026.xlsx');
      showToast('Ganadores exportados exitosamente', 'success');
    } catch (e) {
      console.error(e);
      showToast('Error al exportar', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Participants export */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0">
              <Users size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">Participantes</h3>
              <p className="text-gray-500 text-sm mt-0.5">
                {participants.length} registros disponibles
              </p>
            </div>
          </div>
          <div className="bg-black/30 rounded-xl p-3 mb-5 text-xs text-gray-500 space-y-1">
            <p className="flex items-center gap-2"><FileText size={11} /> Nombre completo</p>
            <p className="flex items-center gap-2"><FileText size={11} /> DNI / Identificacion</p>
            <p className="flex items-center gap-2"><FileText size={11} /> Email y Telefono</p>
            <p className="flex items-center gap-2"><FileText size={11} /> Fecha de registro</p>
          </div>
          <button
            onClick={exportParticipants}
            disabled={participants.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-[#107c41] hover:bg-[#107c41]/80 text-white py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            Exportar participantes Excel
          </button>
        </div>

        {/* Winners export */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
              <Trophy size={22} className="text-gold" />
            </div>
            <div>
              <h3 className="text-white font-bold">Ganadores</h3>
              <p className="text-gray-500 text-sm mt-0.5">
                {winners.length} {winners.length === 1 ? 'ganador' : 'ganadores'} registrados
              </p>
            </div>
          </div>
          <div className="bg-black/30 rounded-xl p-3 mb-5 text-xs text-gray-500 space-y-1">
            <p className="flex items-center gap-2"><FileText size={11} /> N° de sorteo</p>
            <p className="flex items-center gap-2"><FileText size={11} /> Nombre del ganador</p>
            <p className="flex items-center gap-2"><FileText size={11} /> DNI, Email y Telefono</p>
            <p className="flex items-center gap-2"><FileText size={11} /> Fecha del sorteo</p>
          </div>
          <button
            onClick={exportWinners}
            disabled={winners.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-[#107c41]/10 border border-[#107c41]/20 text-[#107c41] hover:bg-[#107c41]/20 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            Exportar ganadores Excel
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4">Resumen estadistico</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Participantes', value: participants.length },
            { label: 'Sorteos realizados', value: winners.length },
            {
              label: 'Tasa de participacion',
              value: participants.length > 0
                ? `${Math.round((winners.length / participants.length) * 100)}%`
                : '0%',
            },
            {
              label: 'Elegibles restantes',
              value: participants.filter((p) => !winners.some((w) => w.participant.id === p.id)).length,
            },
          ].map(({ label, value }) => (
            <div key={label} className="bg-black/30 rounded-xl p-4 text-center">
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-gray-600 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
