import RegisterForm from './RegisterForm';

interface HeroProps {
  formRef: React.RefObject<HTMLDivElement>;
}

export default function Hero({ formRef }: HeroProps) {
  return (
    <section 
      id="hero-section" 
      className="relative min-h-screen flex items-center justify-center py-24 md:py-28 px-4 md:px-8 overflow-hidden bg-[#08090d]"
    >
      {/* Stadium Player Background Overlay with enhanced contrast */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.55] pointer-events-none z-0 scale-105 transition-all duration-1000 ease-out"
        style={{ backgroundImage: "url('/stadium_bg.png')" }}
      />

      {/* Dark Vignette overlays to add depth and center focus */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08090d]/60 via-transparent to-[#08090d] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1)_0%,transparent_75%)] pointer-events-none z-0" />

      {/* Smooth fade-to-white transition at the bottom of the hero to blend with the Bracket section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />

      {/* Main Grid Content */}
      <div className="relative z-20 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-6">

        {/* Left Column: Slanted Titles */}
        <div className="col-span-1 lg:col-span-4 flex flex-col justify-center text-center lg:text-left space-y-6 pt-4 lg:pt-12">

          {/* Header titles in Teko premium sports font - Slanted & Italic */}
          <div className="space-y-0 select-none">
            <h1 className="font-teko text-7xl sm:text-8xl md:text-9xl text-white uppercase tracking-wide leading-[0.8] italic font-black drop-shadow-[0_4px_15px_rgba(255,255,255,0.15)] animate-slide-in">
              GRAN SORTEO
            </h1>
            <h2 className="font-teko text-7xl sm:text-8xl md:text-9xl text-[#f97316] uppercase tracking-wide leading-[0.8] italic font-black drop-shadow-[0_4px_30px_rgba(249,115,22,0.5)]">
              MUNDIAL 2026
            </h2>
          </div>

        </div>

        {/* Right Column: Glassmorphic Registration Card aligned to the right */}
        <div className="col-span-1 lg:col-span-8 w-full flex items-center justify-end animate-scale-in">
          <RegisterForm ref={formRef} />
        </div>

      </div>

    </section>
  );
}
