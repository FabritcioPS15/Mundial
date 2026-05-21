import { useRef } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import WorldCupBracket from './WorldCupBracket';
import RecentParticipants from './RecentParticipants';

export default function PublicPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const fixtureRef = useRef<HTMLDivElement>(null);
  const recentRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (section: 'hero' | 'register' | 'recent' | 'fixture') => {
    if (section === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'register') {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'recent') {
      recentRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'fixture') {
      fixtureRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Navbar onNavClick={handleNavClick} />
      <main className="pt-20 md:pt-0">
        <div ref={heroRef}>
          <Hero formRef={formRef} />
        </div>
        <div ref={fixtureRef}>
          <WorldCupBracket />
        </div>
        <div ref={recentRef}>
          <RecentParticipants />
        </div>
        <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/5 bg-zinc-950 relative z-10">
          &copy; 2026 Gran Sorteo Mundial &mdash; Todos los derechos reservados
        </footer>
      </main>
    </>
  );
}
