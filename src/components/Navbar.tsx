import { useApp } from '../context/AppContext';

interface NavbarProps {
  onNavClick: (section: 'hero' | 'register' | 'recent' | 'fixture') => void;
}

export default function Navbar({ onNavClick }: NavbarProps) {
  const { participants } = useApp();

  const handleLinkClick = (section: 'hero' | 'register' | 'recent' | 'fixture') => {
    onNavClick(section);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-2 md:py-4 flex justify-center pointer-events-none">
      <nav className="w-full max-w-5xl pointer-events-auto px-4 md:px-8 py-2 md:py-4 flex items-center justify-between transition-all duration-300">

        {/* Brand Logo Image */}
        <div
          onClick={() => handleLinkClick('hero')}
          className="flex items-center cursor-pointer pointer-events-auto shrink-0 select-none"
        >
          <img
            src="/LogoRTPSanCristobal_horizontal.png"
            alt="RTP San Cristóbal Logo"
            className="h-10 md:h-11 w-auto object-contain transition-all duration-300 active:scale-95 hover:brightness-110"
          />
        </div>

        {/* Hidden Admin Link inside the Counter */}
        <div className="flex items-center">
          <a
            href="/admin"
            className="inline-flex items-center gap-2.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.2)] select-none cursor-default"
          >
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,1)]" />
            <span className="text-zinc-200 text-xs font-semibold">
              <span className="font-black text-orange-500 mr-1">{participants.length}</span>
              {participants.length === 1 ? 'persona inscrita actualmente' : 'personas inscritas actualmente'}
            </span>
          </a>
        </div>

      </nav>
    </div>
  );
}

