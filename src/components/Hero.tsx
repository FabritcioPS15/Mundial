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
      <div className="relative z-20 w-full max-w-7xl mx-auto pt-2 px-2">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Header titles in Teko premium sports font - Slanted & Italic */}
          <div className="text-center lg:text-left select-none order-1 lg:order-1 space-y-2">
            <h1 className="font-teko text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] text-white uppercase tracking-wider leading-[0.8] italic font-black drop-shadow-[0_6px_20px_rgba(255,255,255,0.2)] animate-slide-in">
              ACIERTA Y GANA
            </h1>
            <h2 className="font-teko text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] text-[#f97316] uppercase tracking-wider leading-[0.8] italic font-black drop-shadow-[0_6px_35px_rgba(249,115,22,0.6)]">
              MUNDIAL 2026
            </h2>
          </div>

          {/* Right: Registration Card */}
          <div className="w-full flex items-center justify-center lg:justify-end animate-scale-in order-2 lg:order-2">
            <RegisterForm ref={formRef} />
          </div>
        </div>

      </div>

    </section>
  );
}
