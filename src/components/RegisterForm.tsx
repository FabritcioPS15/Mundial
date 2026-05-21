import { useState, type FormEvent, forwardRef } from 'react';
import { User, CreditCard, Mail, Phone, Car } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTeamFlagUrl } from '../utils/flagHelper';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { FaCar, FaDownload, FaPlus, FaQrcode, FaShieldAlt, FaUserAlt, FaTrophy, FaCalendarAlt } from 'react-icons/fa';

const GoldMedalIcon = () => (
  <svg className="w-12 h-12 filter drop-shadow-md select-none shrink-0" viewBox="0 0 100 100" fill="none">
    {/* Ribbons */}
    <path d="M35 50 L20 88 L50 72 L80 88 L65 50 Z" fill="#3B82F6" />
    <path d="M42 50 L30 88 L50 72 L70 88 L58 50 Z" fill="#1D4ED8" />
    {/* Medal Circle */}
    <circle cx="50" cy="45" r="28" fill="url(#goldGrad)" stroke="#F59E0B" strokeWidth="2" />
    <circle cx="50" cy="45" r="22" fill="none" stroke="#FEF3C7" strokeWidth="1.5" strokeDasharray="3 3" />
    <text x="50" y="54" textAnchor="middle" fill="#78350F" fontSize="26" fontWeight="black" fontFamily="Outfit">1</text>
    <defs>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
  </svg>
);
const generateTicketCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'RTP-2026-';

  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};
const SilverMedalIcon = () => (
  <svg className="w-12 h-12 filter drop-shadow-md select-none shrink-0" viewBox="0 0 100 100" fill="none">
    {/* Ribbons */}
    <path d="M35 50 L20 88 L50 72 L80 88 L65 50 Z" fill="#A855F7" />
    <path d="M42 50 L30 88 L50 72 L70 88 L58 50 Z" fill="#7C3AED" />
    {/* Medal Circle */}
    <circle cx="50" cy="45" r="28" fill="url(#silverGrad)" stroke="#94A3B8" strokeWidth="2" />
    <circle cx="50" cy="45" r="22" fill="none" stroke="#F8FAFC" strokeWidth="1.5" strokeDasharray="3 3" />
    <text x="50" y="54" textAnchor="middle" fill="#334155" fontSize="26" fontWeight="black" fontFamily="Outfit">2</text>
    <defs>
      <linearGradient id="silverGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F8FAFC" />
        <stop offset="50%" stopColor="#CBD5E1" />
        <stop offset="100%" stopColor="#64748B" />
      </linearGradient>
    </defs>
  </svg>
);

const BronzeMedalIcon = () => (
  <svg className="w-12 h-12 filter drop-shadow-md select-none shrink-0" viewBox="0 0 100 100" fill="none">
    {/* Ribbons */}
    <path d="M35 50 L20 88 L50 72 L80 88 L65 50 Z" fill="#F97316" />
    <path d="M42 50 L30 88 L50 72 L70 88 L58 50 Z" fill="#EA580C" />
    {/* Medal Circle */}
    <circle cx="50" cy="45" r="28" fill="url(#bronzeGrad)" stroke="#B45309" strokeWidth="2" />
    <circle cx="50" cy="45" r="22" fill="none" stroke="#FFEDD5" strokeWidth="1.5" strokeDasharray="3 3" />
    <text x="50" y="54" textAnchor="middle" fill="#78350F" fontSize="26" fontWeight="black" fontFamily="Outfit">3</text>
    <defs>
      <linearGradient id="bronzeGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFEDD5" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>
  </svg>
);

const TEAMS = [
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'ZA', name: 'Sudáfrica', flag: '🇿🇦' },
  { code: 'KR', name: 'Corea del Sur', flag: '🇰🇷' },
  { code: 'CZ', name: 'República Checa', flag: '🇨🇿' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦' },
  { code: 'BA', name: 'Bosnia y Herzegovina', flag: '🇧🇦' },
  { code: 'QA', name: 'Catar', flag: '🇶🇦' },
  { code: 'CH', name: 'Suiza', flag: '🇨🇭' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'MA', name: 'Marruecos', flag: '🇲🇦' },
  { code: 'HT', name: 'Haití', flag: '🇭🇹' },
  { code: 'GB-SCT', name: 'Escocia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'TR', name: 'Turquía', flag: '🇹🇷' },
  { code: 'DE', name: 'Alemania', flag: '🇩🇪' },
  { code: 'CW', name: 'Curazao', flag: '🇨🇼' },
  { code: 'CI', name: 'Costa de Marfil', flag: '🇨🇮' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'NL', name: 'Países Bajos', flag: '🇳🇱' },
  { code: 'JP', name: 'Japón', flag: '🇯🇵' },
  { code: 'SE', name: 'Suecia', flag: '🇸🇪' },
  { code: 'TN', name: 'Túnez', flag: '🇹🇳' },
  { code: 'BE', name: 'Bélgica', flag: '🇧🇪' },
  { code: 'EG', name: 'Egipto', flag: '🇪🇬' },
  { code: 'IR', name: 'Irán', flag: '🇮🇷' },
  { code: 'NZ', name: 'Nueva Zelanda', flag: '🇳🇿' },
  { code: 'ES', name: 'España', flag: '🇪🇸' },
  { code: 'CV', name: 'Cabo Verde', flag: '🇨🇻' },
  { code: 'SA', name: 'Arabia Saudita', flag: '🇸🇦' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'FR', name: 'Francia', flag: '🇫🇷' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
  { code: 'IQ', name: 'Irak', flag: '🇮🇶' },
  { code: 'NO', name: 'Noruega', flag: '🇳🇴' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'DZ', name: 'Argelia', flag: '🇩🇿' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'JO', name: 'Jordania', flag: '🇯🇴' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'CD', name: 'RD Congo', flag: '🇨🇩' },
  { code: 'UZ', name: 'Uzbekistán', flag: '🇺🇿' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'GB-ENG', name: 'Inglaterra', flag: '🏴\u200D󠁢󠁥󠁮󠁧󠁿' },
  { code: 'HR', name: 'Croacia', flag: '🇭🇷' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'PA', name: 'Panamá', flag: '🇵🇦' },
].sort((a, b) => a.name.localeCompare(b.name));

const cleanCountryName = (name: string): string => {
  if (!name) return '';
  return name
    .replace(/[\uD83C-\uDBFF\uDC00-\uDFFF\u2600-\u27BF]/g, '') // strip emojis
    .replace(/^[a-zA-Z]{2}\s+/i, '') // strip 2-letter codes like QA, MX, ES followed by a space
    .trim();
};

const getFlagByCountryName = (countryName: string): string | null => {
  if (!countryName) return null;
  const cleanName = cleanCountryName(countryName);
  const team = TEAMS.find((t) => t.name.toLowerCase() === cleanName.toLowerCase());
  if (!team) return null;
  return getTeamFlagUrl(team.flag, team.name);
};

const RegisterForm = forwardRef<HTMLDivElement>((_, ref) => {
  const { registerParticipant, showToast } = useApp();

  const [form, setForm] = useState({
    fullName: '',
    dni: '',
    email: '',
    phone: '',
    placa: '',
    champion: '',
    subchampion: '',
    thirdPlace: ''
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [openDropdown, setOpenDropdown] = useState<'champion' | 'subchampion' | 'thirdPlace' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastRegistered, setLastRegistered] = useState<{
    name: string;
    placa: string;
    champion: string;
    subchampion: string;
    thirdPlace: string;
    ticketCode: string;
  } | null>(null);

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.fullName.trim()) errs.fullName = 'El nombre es obligatorio';
    if (!form.dni.trim()) {
      errs.dni = 'El documento es obligatorio';
    } else if (!/^\d+$/.test(form.dni.trim())) {
      errs.dni = 'Solo se permiten números';
    }
    if (!form.email.trim()) errs.email = 'El email es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email inválido';
    if (!form.phone.trim()) errs.phone = 'El teléfono es obligatorio';
    else if (!/^9\d{8}$/.test(form.phone.trim())) errs.phone = 'Debe iniciar con 9 y tener 9 dígitos';

    if (!form.placa.trim()) {
      errs.placa = 'La placa es obligatoria';
    } else if (!/^[A-Z0-9]{6}$/.test(form.placa.trim().toUpperCase())) {
      errs.placa = 'Placa inválida (6 caracteres alfanuméricos)';
    }

    if (!form.champion) errs.champion = 'Requerido';
    if (!form.subchampion) errs.subchampion = 'Requerido';
    if (!form.thirdPlace) errs.thirdPlace = 'Requerido';

    if (form.champion && form.subchampion && form.champion === form.subchampion) {
      errs.subchampion = 'Mismo equipo';
    }
    if (form.champion && form.thirdPlace && form.champion === form.thirdPlace) {
      errs.thirdPlace = 'Mismo equipo';
    }
    if (form.subchampion && form.thirdPlace && form.subchampion === form.thirdPlace) {
      errs.thirdPlace = 'Mismo equipo';
    }

    return errs;
  };
  const ticketCode = generateTicketCode();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      showToast('Por favor, completa tus predicciones y campos correctamente', 'error');
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    const cleanPlaca = form.placa.trim().toUpperCase();

    try {
      const ok = await registerParticipant({
        fullName: form.fullName.trim(),
        dni: form.dni.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        placa: cleanPlaca,
        champion: form.champion,
        subchampion: form.subchampion,
        thirdPlace: form.thirdPlace,
        ticketCode,
      });

      if (ok) {
        setLastRegistered({
          name: form.fullName.trim(),
          placa: cleanPlaca,
          champion: form.champion,
          subchampion: form.subchampion,
          thirdPlace: form.thirdPlace,
          ticketCode,
        });
        setSuccess(true);
        setForm({
          fullName: '',
          dni: '',
          email: '',
          phone: '',
          placa: '',
          champion: '',
          subchampion: '',
          thirdPlace: ''
        });
      }
    } catch (err) {
      console.error('Error en registro:', err);
      showToast('Error al registrar. Revisa tus datos.', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  const downloadTicket = async () => {
    const ticketEl = document.getElementById('ticket-container');
    if (!ticketEl) return;

    try {
      const canvas = await html2canvas(ticketEl, {
        scale: 3,
        backgroundColor: '#1c1b1e',
        useCORS: true,
        logging: false,
        allowTaint: true,
        onclone: (_, el) => {
          el.style.borderRadius = '20px';
          el.style.overflow = 'hidden';
        },
      });

      canvas.toBlob((blob) => {
        if (blob) saveAs(blob, `ticket_mundial2026_${lastRegistered?.placa}.png`);
      }, 'image/png');

    } catch (e) {
      console.error('Error al generar ticket', e);
      showToast('Error al generar el ticket', 'error');
    }
  };

  return (
    <div ref={ref} className="w-full max-w-xl mx-auto lg:mr-0">
      <div className="bg-orange-500/[0.08] backdrop-blur-2xl border border-orange-500/25 rounded-3xl p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.07)] relative transition-all duration-300">

        {/* Slanted premium sports header */}
        <div className="flex items-center gap-2.5 mb-2 select-none justify-start border-b border-orange-500/10 pb-3">
          <span className="w-1.5 h-6 bg-orange-500 transform -rotate-12 rounded-sm" />
          <h2 className="font-teko text-4xl text-white uppercase tracking-wider italic font-bold">
            REGISTRATE
          </h2>
        </div>

        {success && lastRegistered ? (
          <div className="text-center py-0 animate-scale-in relative z-10">
            <h3 className="font-teko text-4xl text-orange-500 mb-2 uppercase tracking-wide">¡REGISTRO CONFIRMADO!</h3>
            {/* TICKET WRAPPER */}
            <div className="w-full overflow-x-auto pb-4 flex justify-start sm:justify-center" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
              <div
                id="ticket-container"
                style={{
                  width: '480px',
                  minWidth: '480px',
                  margin: '0 auto 16px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
                  backgroundColor: '#0A0A0A',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              >
              {/* HEADER SECTION */}
              <div style={{
                position: 'relative',
                padding: '12px 16px 16px',
                backgroundImage: 'url(/Ticket3.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center -30px',
                backgroundRepeat: 'no-repeat',
              }}>
                {/* Top Bar: Logo and RTP Ticket */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <img src="/LogoRTPSanCristobal_horizontal.png" alt="RTP" style={{ height: '24px', filter: 'brightness(0) invert(1)' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <div style={{ border: '1px solid rgba(249,115,22,0.5)', borderRadius: '20px', padding: '4px 10px', fontSize: '9px', fontWeight: 800, color: '#fff', letterSpacing: '0.1em' }}>
                    RTP TICKET
                  </div>
                </div>

                {/* Title */}
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                  <div style={{ fontSize: '10px', color: '#f97316', fontWeight: 800, letterSpacing: '0.3em', marginBottom: '4px' }}>
                    PRONÓSTICO OFICIAL
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '0.02em', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                    MUNDIAL 2026
                  </div>
                </div>

                {/* Glowing QR / Code Section */}
                <div style={{
                  background: 'linear-gradient(90deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.05) 100%)',
                  border: '1px solid rgba(249,115,22,0.4)',
                  borderRadius: '6px',
                  padding: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {/* Text Info */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: '#f97316', fontWeight: 700, letterSpacing: '0.15em', marginBottom: '2px' }}>CÓDIGO OFICIAL</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 900, color: '#fff', letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>
                      {lastRegistered.ticketCode}
                    </div>
                  </div>
                </div>
              </div>

              {/* SEPARATOR WITH NOTCHES */}
              <div style={{ position: 'relative', height: '2px', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: '-12px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#1c1b1e', zIndex: 2 }} />
                <div style={{ flex: 1, borderTop: '2px dashed rgba(255,255,255,0.15)', margin: '0 20px' }} />
                <div style={{ position: 'absolute', right: '-12px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#1c1b1e', zIndex: 2 }} />
              </div>

              {/* BODY SECTION */}
              <div style={{ padding: '12px 16px' }}>
                {/* PARTICIPANT */}
                <div style={{
                  background: '#151515',
                  border: '1px solid #222',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(249,115,22,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaUserAlt style={{ color: '#f97316', fontSize: '16px' }} />
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: '9px', color: '#f97316', fontWeight: 800, letterSpacing: '0.15em', marginBottom: '2px' }}>PARTICIPANTE</div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', lineHeight: 1.2 }}>{lastRegistered.name}</div>
                  </div>
                </div>

                {/* PODIUM */}
                <div style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <FaTrophy style={{ color: '#f97316', fontSize: '12px' }} />
                    <div style={{ fontSize: '9px', color: '#f97316', fontWeight: 800, letterSpacing: '0.15em' }}>PODIO PRONOSTICADO</div>
                  </div>

                  {/* Rows */}
                  {[
                    { num: '1', label: 'Campeón', val: lastRegistered.champion, icon: <GoldMedalIcon /> },
                    { num: '2', label: 'Subcampeón', val: lastRegistered.subchampion, icon: <SilverMedalIcon /> },
                    { num: '3', label: 'Tercer puesto', val: lastRegistered.thirdPlace, icon: <BronzeMedalIcon /> }
                  ].map((row, i, arr) => (
                    <div key={row.label} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px 0',
                      borderBottom: i < arr.length - 1 ? '1px solid #222' : 'none'
                    }}>
                      <div style={{ width: '36px', display: 'flex', justifyContent: 'center', marginRight: '12px' }}>
                        <div style={{ transform: 'scale(0.65)' }}>
                          {row.icon}
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#888', fontWeight: 500, width: '90px' }}>{row.label}</div>
                      <div style={{ width: '1px', height: '18px', background: '#333', marginRight: '16px' }} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                        {row.val && getFlagByCountryName(row.val) ? (
                          <img src={getFlagByCountryName(row.val)!} style={{ width: '24px', height: '16px', objectFit: 'cover', borderRadius: '3px' }} alt="" />
                        ) : (
                          <div style={{ width: '24px', height: '16px', background: '#333', borderRadius: '3px' }} />
                        )}
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* INFO FOOTER SECTION */}
              <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0F0F0F' }}>
                {/* REGISTRADO */}
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <FaCalendarAlt style={{ color: '#f97316', fontSize: '10px' }} />
                    <div style={{ fontSize: '7px', color: '#f97316', fontWeight: 800, letterSpacing: '0.1em' }}>REGISTRADO</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ fontSize: '9px', color: '#fff', fontWeight: 700 }}>{new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</div>
                    <div style={{ fontSize: '8px', color: '#888' }}>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>

                <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />

                {/* ESTADO */}
                <div style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                    <FaShieldAlt style={{ color: '#f97316', fontSize: '10px' }} />
                    <div style={{ fontSize: '7px', color: '#f97316', fontWeight: 800, letterSpacing: '0.1em' }}>ESTADO</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ fontSize: '9px', color: '#fff', fontWeight: 700 }}>VALIDADO</div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  </div>
                </div>

                <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />

                {/* VEHÍCULO */}
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
                    <FaCar style={{ color: '#f97316', fontSize: '10px' }} />
                    <div style={{ fontSize: '7px', color: '#f97316', fontWeight: 800, letterSpacing: '0.1em' }}>VEHÍCULO</div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#fff', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '0.05em' }}>{lastRegistered.placa}</div>
                </div>
              </div>

              {/* BOTTOM ORANGE STRIP */}
              <div style={{
                background: 'linear-gradient(90deg, #ea580c 0%, #f97316 100%)',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '9px', color: '#fff', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '1px' }}>VÁLIDO PARA EL EVENTO REALIZADO</div>
                    <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.8)', fontWeight: 500, letterSpacing: '0.05em' }}>PRESENTA ESTE TICKET PARA SU VALIDACIÓN</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  ))}
                </div>
              </div>
            </div>
            </div>
            {/* FIN TICKET */}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={downloadTicket}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-4 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <FaDownload className="text-lg" /> Descargar Ticket
              </button>
              <button
                type="button"
                onClick={() => { setSuccess(false); setLastRegistered(null); }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <FaPlus className="text-lg" /> Nuevo Registro
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative z-10" noValidate>
            <div className="space-y-6">

              {/* Grupo 1: Datos de Contacto */}
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 border-b border-zinc-800/40 pb-2 mb-1">
                  <span className="w-1 h-3.5 bg-orange-500 transform -rotate-12 rounded-sm" />
                  <h3 className="text-[11px] font-black uppercase text-zinc-100 tracking-wider">
                    Datos de Contacto
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div className="space-y-1.5">
                    <label className="text-zinc-300 text-[10px] font-bold uppercase tracking-wider block text-left">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, fullName: e.target.value }));
                          if (errors.fullName) setErrors((err) => ({ ...err, fullName: undefined }));
                        }}
                        placeholder="Juan Pérez"
                        className={`w-full bg-white border rounded-xl pl-11 pr-4 py-2.5 text-zinc-950 placeholder-zinc-400 outline-none transition-all text-xs focus:ring-4 focus:ring-orange-500/10 ${errors.fullName ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 hover:border-zinc-300 focus:border-orange-500'
                          }`}
                      />
                    </div>
                    {errors.fullName && <p className="text-red-400 text-[10px] text-left pl-2 font-bold">{errors.fullName}</p>}
                  </div>

                  {/* DNI */}
                  <div className="space-y-1.5">
                    <label className="text-zinc-300 text-[10px] font-bold uppercase tracking-wider block text-left">
                      DNI / Documento
                    </label>
                    <div className="relative">
                      <CreditCard size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
                      <input
                        type="text"
                        value={form.dni}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, dni: e.target.value }));
                          if (errors.dni) setErrors((err) => ({ ...err, dni: undefined }));
                        }}
                        placeholder="Número de documento"
                        className={`w-full bg-white border rounded-xl pl-11 pr-4 py-2.5 text-zinc-950 placeholder-zinc-400 outline-none transition-all text-xs focus:ring-4 focus:ring-orange-500/10 ${errors.dni ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 hover:border-zinc-300 focus:border-orange-500'
                          }`}
                      />
                    </div>
                    {errors.dni && <p className="text-red-400 text-[10px] text-left pl-2 font-bold">{errors.dni}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-zinc-300 text-[10px] font-bold uppercase tracking-wider block text-left">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, email: e.target.value }));
                          if (errors.email) setErrors((err) => ({ ...err, email: undefined }));
                        }}
                        placeholder="correo@ejemplo.com"
                        className={`w-full bg-white border rounded-xl pl-11 pr-4 py-2.5 text-zinc-950 placeholder-zinc-400 outline-none transition-all text-xs focus:ring-4 focus:ring-orange-500/10 ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 hover:border-zinc-300 focus:border-orange-500'
                          }`}
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-[10px] text-left pl-2 font-bold">{errors.email}</p>}
                  </div>

                  {/* Telefono */}
                  <div className="space-y-1.5">
                    <label className="text-zinc-300 text-[10px] font-bold uppercase tracking-wider block text-left">
                      Teléfono Celular
                    </label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, phone: e.target.value }));
                          if (errors.phone) setErrors((err) => ({ ...err, phone: undefined }));
                        }}
                        placeholder="Número de teléfono"
                        className={`w-full bg-white border rounded-xl pl-11 pr-4 py-2.5 text-zinc-950 placeholder-zinc-400 outline-none transition-all text-xs focus:ring-4 focus:ring-orange-500/10 ${errors.phone ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 hover:border-zinc-300 focus:border-orange-500'
                          }`}
                      />
                    </div>
                    {errors.phone && <p className="text-red-400 text-[10px] text-left pl-2 font-bold">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Grupo 2: Datos de Entrada del Vehículo */}
              <div className="space-y-4 text-left pt-2">
                <div className="flex items-center gap-2 border-b border-zinc-800/40 pb-2 mb-1">
                  <span className="w-1 h-3.5 bg-orange-500 transform -rotate-12 rounded-sm" />
                  <h3 className="text-[11px] font-black uppercase text-zinc-100 tracking-wider">
                    Ticket de Entrada Vehicular
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-orange-500/[0.05] border border-orange-500/20 rounded-2xl p-4.5">
                  <div className="sm:col-span-2 space-y-1">
                    <p className="text-[10px] text-zinc-300 font-medium leading-relaxed">
                      Ingresa la placa de tu vehículo. Cada placa registrada funciona como un boleto exclusivo para participar en el sorteo final del auto cero kilómetros.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 text-[10px] font-bold uppercase tracking-wider block text-center">
                      Matrícula / Placa
                    </label>
                    <div className="relative">
                      <Car size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" />
                      <input
                        type="text"
                        value={form.placa}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, placa: e.target.value.toUpperCase() }));
                          if (errors.placa) setErrors((err) => ({ ...err, placa: undefined }));
                        }}
                        placeholder="ABC-123"
                        className={`w-full bg-white border-2 rounded-xl pl-9 pr-3 py-2 text-zinc-950 placeholder-zinc-400 outline-none transition-all text-xs font-black text-center tracking-widest focus:ring-4 focus:ring-orange-500/10 uppercase ${errors.placa ? 'border-red-400 focus:border-red-500' : 'border-orange-500/30 hover:border-orange-500/40 focus:border-orange-500'
                          }`}
                      />
                    </div>
                    {errors.placa && <p className="text-red-400 text-[9px] text-center font-bold">{errors.placa}</p>}
                  </div>
                </div>
              </div>

              {/* Podium Predictions Section */}
              <div className="space-y-4 pt-2">
                <div className="text-center space-y-1">
                  <h3 className="text-xs font-black uppercase text-zinc-100 tracking-wider flex items-center justify-center gap-1.5 select-none">
                    🏆 Tu Pronóstico del Podio 🏆
                  </h3>
                  <p className="text-[9px] text-orange-400/80 font-bold uppercase tracking-widest">
                    Elige los tres países que ocuparán las posiciones de medallas
                  </p>
                </div>

                <div className="relative pt-2">
                  {/* Single Consolidated Dropdown Panel relative to the full grid */}
                  {openDropdown && (
                    <>
                      {/* Close backdrop */}
                      <div className="fixed inset-0 z-40 cursor-default" onClick={() => setOpenDropdown(null)} />
                      {/* Dropdown Card */}
                      <div className="absolute left-0 right-0 bottom-full mb-3 bg-white border border-zinc-200/80 rounded-2xl shadow-2xl p-3.5 z-50 origin-bottom animate-scale-in">
                        <div className="flex items-center justify-between mb-2 border-b border-zinc-100 pb-2 px-1">
                          <span className="text-[10px] sm:text-xs font-black uppercase text-zinc-800 tracking-wider flex items-center gap-1.5 select-none">
                            {openDropdown === 'champion' ? '🥇 ELEGIR CAMPEÓN (1er puesto)' : openDropdown === 'subchampion' ? '🥈 ELEGIR SUBCAMPEÓN (2do puesto)' : '🥉 ELEGIR TERCER PUESTO (3er puesto)'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setOpenDropdown(null)}
                            className="text-zinc-400 hover:text-zinc-600 text-xs font-bold font-mono px-2 py-0.5 hover:bg-zinc-100 rounded transition-all cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2.5 max-h-[280px] sm:max-h-[360px] overflow-y-auto pr-1">
                          {TEAMS.map((t) => {
                            const teamValue = t.name;
                            const isSelected = form[openDropdown] === teamValue;
                            const isChosenElsewhere =
                              (openDropdown !== 'champion' && form.champion === teamValue) ||
                              (openDropdown !== 'subchampion' && form.subchampion === teamValue) ||
                              (openDropdown !== 'thirdPlace' && form.thirdPlace === teamValue);

                            return (
                              <button
                                key={`${openDropdown}-${t.code}`}
                                type="button"
                                disabled={isChosenElsewhere}
                                onClick={() => {
                                  setForm((f) => ({ ...f, [openDropdown]: teamValue }));
                                  if (errors[openDropdown]) setErrors((err) => ({ ...err, [openDropdown]: undefined }));
                                  setOpenDropdown(null);
                                }}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[9px] sm:text-[10px] font-bold transition-all h-[78px] cursor-pointer ${isSelected
                                  ? 'bg-orange-500/10 border-orange-500 text-orange-600 font-extrabold shadow-sm'
                                  : isChosenElsewhere
                                    ? 'opacity-30 bg-zinc-50 border-zinc-100 text-zinc-300 cursor-not-allowed'
                                    : 'bg-white border-zinc-100 hover:border-orange-500 hover:bg-orange-500/5 text-zinc-700'
                                  }`}
                              >
                                <img
                                  src={getTeamFlagUrl(t.flag, t.name) || `https://flagcdn.com/24x18/${t.code.toLowerCase()}.png`}
                                  alt={t.name}
                                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover mb-1 border border-zinc-200/80 shadow-sm"
                                />
                                <span className="truncate w-full text-center leading-tight text-[9px] sm:text-[10px] mt-0.5">{t.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-3 gap-3 items-end">

                    {/* 2nd Place: Subcampeón */}
                    <div className="order-2 sm:order-1 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-3 transition-all duration-300 flex flex-col items-center space-y-2.5 min-h-[145px] justify-between relative group shadow-sm hover:border-zinc-700/60">
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-zinc-600 text-white font-mono text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm select-none">
                        2do PUESTO
                      </div>
                      <div className="w-12 h-12 rounded-full bg-zinc-950 shadow-inner flex items-center justify-center overflow-hidden shrink-0 mt-1 select-none transition-all duration-300 border border-zinc-800">
                        {form.subchampion && getFlagByCountryName(form.subchampion) ? (
                          <img src={getFlagByCountryName(form.subchampion)!} alt="Subcampeón" className="w-full h-full object-cover" />
                        ) : (
                          <SilverMedalIcon />
                        )}
                      </div>
                      <div className="w-full relative">
                        <button
                          type="button"
                          onClick={() => setOpenDropdown(openDropdown === 'subchampion' ? null : 'subchampion')}
                          className={`w-full bg-white border rounded-lg px-2 py-1.5 text-zinc-950 outline-none transition-all text-[10px] font-bold text-center flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-orange-500/10 ${errors.subchampion ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-orange-500 hover:border-zinc-300'
                            }`}
                        >
                          <span className="truncate w-full text-center">
                            {form.subchampion ? cleanCountryName(form.subchampion) : 'ELEGIR PAÍS'}
                          </span>
                          <span className="text-[7px] text-zinc-400 font-black shrink-0 ml-1">▼</span>
                        </button>
                      </div>
                      {errors.subchampion && (
                        <p className="text-red-400 text-[8px] text-center font-bold">{errors.subchampion}</p>
                      )}
                    </div>

                    {/* 1st Place: Campeón */}
                    <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-500/15 to-amber-500/5 border-2 border-amber-500/35 rounded-2xl p-3.5 transition-all duration-300 flex flex-col items-center space-y-2.5 min-h-[155px] justify-between relative shadow-md shadow-orange-500/[0.04] hover:border-amber-400/50">
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white font-mono text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md select-none">
                        1er PUESTO
                      </div>
                      <div className="w-14 h-14 rounded-full bg-zinc-950 shadow-inner flex items-center justify-center overflow-hidden shrink-0 mt-1 select-none transition-all duration-300 border border-amber-500/30">
                        {form.champion && getFlagByCountryName(form.champion) ? (
                          <img src={getFlagByCountryName(form.champion)!} alt="Campeón" className="w-full h-full object-cover" />
                        ) : (
                          <GoldMedalIcon />
                        )}
                      </div>
                      <div className="w-full relative">
                        <button
                          type="button"
                          onClick={() => setOpenDropdown(openDropdown === 'champion' ? null : 'champion')}
                          className={`w-full bg-white border rounded-lg px-2 py-1.5 text-zinc-950 outline-none transition-all text-[10px] font-black text-center flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-orange-500/10 ${errors.champion ? 'border-red-400 focus:border-red-500' : 'border-amber-400 focus:border-amber-500 hover:border-amber-400'
                            }`}
                        >
                          <span className="truncate w-full text-center">
                            {form.champion ? cleanCountryName(form.champion) : 'ELEGIR PAÍS'}
                          </span>
                          <span className="text-[7px] text-zinc-400 font-black shrink-0 ml-1">▼</span>
                        </button>
                      </div>
                      {errors.champion && (
                        <p className="text-red-400 text-[8px] text-center font-bold">{errors.champion}</p>
                      )}
                    </div>

                    {/* 3rd Place: Tercero */}
                    <div className="order-3 sm:order-3 bg-orange-950/15 border border-orange-900/30 rounded-2xl p-3 transition-all duration-300 flex flex-col items-center space-y-2.5 min-h-[145px] justify-between relative group shadow-sm hover:border-orange-700/50">
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-800 text-white font-mono text-[8px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm select-none">
                        3er PUESTO
                      </div>
                      <div className="w-12 h-12 rounded-full bg-zinc-950 shadow-inner flex items-center justify-center overflow-hidden shrink-0 mt-1 select-none transition-all duration-300 border border-orange-850/50">
                        {form.thirdPlace && getFlagByCountryName(form.thirdPlace) ? (
                          <img src={getFlagByCountryName(form.thirdPlace)!} alt="Tercer Puesto" className="w-full h-full object-cover" />
                        ) : (
                          <BronzeMedalIcon />
                        )}
                      </div>
                      <div className="w-full relative">
                        <button
                          type="button"
                          onClick={() => setOpenDropdown(openDropdown === 'thirdPlace' ? null : 'thirdPlace')}
                          className={`w-full bg-white border rounded-lg px-2 py-1.5 text-zinc-950 outline-none transition-all text-[10px] font-bold text-center flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-orange-500/10 ${errors.thirdPlace ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-orange-500 hover:border-zinc-300'
                            }`}
                        >
                          <span className="truncate w-full text-center">
                            {form.thirdPlace ? cleanCountryName(form.thirdPlace) : 'ELEGIR PAÍS'}
                          </span>
                          <span className="text-[7px] text-zinc-400 font-black shrink-0 ml-1">▼</span>
                        </button>
                      </div>
                      {errors.thirdPlace && (
                        <p className="text-red-400 text-[8px] text-center font-bold">{errors.thirdPlace}</p>
                      )}
                    </div>

                  </div>
                </div>
              </div>

              {/* Botón de Enviar */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_25px_rgba(249,115,22,0.45)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      CONFIRMAR Y REGISTRAR &rarr;
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>
        )}

      </div>
    </div>
  );
});

RegisterForm.displayName = 'RegisterForm';
export default RegisterForm;
