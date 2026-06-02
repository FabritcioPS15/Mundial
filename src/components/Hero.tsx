import RegisterForm from './RegisterForm';

interface HeroProps {
  formRef: React.RefObject<HTMLDivElement>;
}

export default function Hero({ formRef }: HeroProps) {
  return (
    <section
      id="hero-section"
      className="relative min-h-screen flex items-center justify-center py-12 md:py-28 px-4 md:px-8 overflow-hidden bg-[#08090d]"
    >
      {/* Stadium Player Background Overlay with enhanced contrast */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.35] pointer-events-none z-0 scale-105 transition-all duration-1000 ease-out"
        style={{ backgroundImage: "url('/Fondo.png')" }}
      />

      {/* Dark Vignette overlays to add depth and center focus */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08090d]/60 via-transparent to-[#08090d] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1)_0%,transparent_75%)] pointer-events-none z-0" />

      {/* Smooth fade-to-white transition at the bottom of the hero to blend with the Bracket section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/20 to-transparent pointer-events-none z-10" />

      {/* Main Grid Content */}
      <div className="relative z-20 w-full mx-auto flex flex-col items-center pt-2 px-2">

        {/* Header titles in Teko premium sports font - Slanted & Italic */}
        <div className="text-center space-y-0 select-none mb-6 md:mb-8">
          <h1 className="font-teko text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white uppercase tracking-wide leading-[0.85] italic font-black drop-shadow-[0_4px_15px_rgba(255,255,255,0.15)] animate-slide-in">
            GRAN SORTEO
          </h1>
          <h2 className="font-teko text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#f97316] uppercase tracking-wide leading-[0.85] italic font-black drop-shadow-[0_4px_30px_rgba(249,115,22,0.5)]">
            MUNDIAL 2026
          </h2>
        </div>

        {/* Registration Card */}
        <div className="w-full flex items-center justify-center animate-scale-in">
          <RegisterForm ref={formRef} />
        </div>

      </div>

    </section>
  );
}
