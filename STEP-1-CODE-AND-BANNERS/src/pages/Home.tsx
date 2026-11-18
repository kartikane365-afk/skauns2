import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { CategoryCarousel } from '../components/CategoryCarousel';
import FitAdvisor from '../components/FitAdvisor';
import { dispatchContactInquiryToAdmin } from '../services/adminDispatcher';
import { useStore, type HeroSlideConfig } from '../context/StoreContext';

const codeOfConduct = [
  { num: '01', text: 'WEAR IT UNTIL IT BREAKS.', sub: 'Built for longevity — not seasons.' },
  { num: '02', text: 'DO NOT IRON. LET IT WRINKLE.', sub: 'Imperfection is the aesthetic.' },
  { num: '03', text: 'IF THEY STARE, LET THEM.', sub: 'Visibility is power.' },
  { num: '04', text: 'BLACK IS THE ONLY COLOR.', sub: 'The absence of compromise.' },
];

function renderHeroHeadline(slide: HeroSlideConfig) {
  if (slide.headlineStyle === 'armor' || slide.theme === 'light') {
    return (
      <h1 className="font-syne font-black text-[11.5vw] sm:text-[9.5vw] lg:text-[8vw] leading-[0.88] uppercase tracking-tighter text-black select-none drop-shadow-[0_2px_14px_rgba(255,255,255,0.95)]">
        <span className="text-black block">{slide.headlineLine1}</span>
        <span className="text-black/85 block" style={{ WebkitTextStroke: '1.5px #000' }}>
          {slide.headlineLine2}
        </span>
      </h1>
    );
  }
  if (slide.headlineStyle === 'avant') {
    return (
      <h1 className="select-none leading-[0.84] uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
        <span className="font-bebas text-[12.5vw] sm:text-[10.5vw] lg:text-[9vw] text-white tracking-normal block">
          {slide.headlineLine1}
        </span>
        <span className="font-syne font-black text-[9vw] sm:text-[7.2vw] lg:text-[6vw] text-[#f4f4f0]/90 tracking-tighter block -mt-1.5 sm:-mt-4">
          {slide.headlineLine2}
        </span>
      </h1>
    );
  }
  return (
    <h1 className="font-syne font-black text-[11.5vw] sm:text-[9.5vw] lg:text-[8vw] leading-[0.88] uppercase tracking-tighter text-white select-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
      {slide.headlineLine1}
      <br />
      <span className="text-[#f4f4f0]">{slide.headlineLine2}</span>
    </h1>
  );
}

export default function Home() {
  useScrollReveal();
  const { products, categories, sectionBanners, heroSlides } = useStore();

  const [commsSubmitted, setCommsSubmitted] = useState(false);
  const [commsForm, setCommsForm] = useState({ name: '', email: '', message: '' });

  const handleHomeCommsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void dispatchContactInquiryToAdmin(commsForm);
    setCommsSubmitted(true);
  };
  const [cardsPerView, setCardsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCardsPerView(1);
      else if (window.innerWidth < 1024) setCardsPerView(2);
      else setCardsPerView(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [prevHeroIdx, setPrevHeroIdx] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [heroTouchStart, setHeroTouchStart] = useState<number | null>(null);

  // Clamp hero slide index if slides were deleted in Admin
  useEffect(() => {
    if (currentHeroSlide >= heroSlides.length) {
      setCurrentHeroSlide(0);
    }
  }, [heroSlides.length, currentHeroSlide]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (heroSlides.length <= 1) return;
    timerRef.current = setInterval(() => {
      goToSlide((prev: number) => (prev + 1) % heroSlides.length);
    }, 5000);
  };

  const goToSlide = (getNext: (prev: number) => number) => {
    if (transitioning || heroSlides.length <= 1) return;
    setTransitioning(true);
    setPrevHeroIdx(currentHeroSlide);
    const next = getNext(currentHeroSlide);
    setCurrentHeroSlide(next);
    setTimeout(() => {
      setPrevHeroIdx(null);
      setTransitioning(false);
    }, 900);
  };

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    timerRef.current = setInterval(() => {
      goToSlide((prev: number) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHeroSlide, heroSlides.length]);

  const nextHeroSlide = () => {
    resetTimer();
    goToSlide((prev: number) => (prev + 1) % heroSlides.length);
  };
  const prevHeroSlide = () => {
    resetTimer();
    goToSlide((prev: number) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleHeroTouchStart = (e: React.TouchEvent) => {
    setHeroTouchStart(e.touches[0].clientX);
  };

  const handleHeroTouchEnd = (e: React.TouchEvent) => {
    if (heroTouchStart === null) return;
    const deltaX = e.changedTouches[0].clientX - heroTouchStart;
    if (deltaX > 45) {
      prevHeroSlide();
    } else if (deltaX < -45) {
      nextHeroSlide();
    }
    setHeroTouchStart(null);
  };

  return (
    <div className="bg-white min-h-screen">

      {/* ═══════════════════════════════════════ */}
      {/* 1. HERO SECTION                         */}
      {/* ═══════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-white !mb-0">
        <div
          onTouchStart={handleHeroTouchStart}
          onTouchEnd={handleHeroTouchEnd}
          className="relative w-full h-[84vh] min-h-[530px] max-h-[820px] sm:h-auto sm:aspect-[2432/1408] sm:min-h-[640px] md:min-h-[720px] bg-black overflow-hidden"
        >

          {/* Slides */}
          {heroSlides.map((slide, idx) => {
            const isActive = currentHeroSlide === idx;
            const isPrev = prevHeroIdx === idx;
            const isDark = slide.theme === 'dark';
            return (
              <div
                key={slide.id}
                className="absolute inset-0 w-full h-full"
                style={{
                  zIndex: isActive ? 10 : isPrev ? 8 : 0,
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.85s cubic-bezier(0.23,1,0.32,1)',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                {/* Model image - Crystal Clear Razor Sharp */}
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className={`w-full h-full object-cover ${slide.objectPosition} block`}
                  style={{
                    transform: 'none',
                  }}
                  loading="eager"
                />

                {/* Scrim Overlay: Confined to far-left text area only so the model/hoodie is 100% unoccluded & unblurred */}
                {isDark ? (
                  <div
                    className="absolute inset-y-0 left-0 w-full sm:w-[50%] bg-gradient-to-t sm:bg-gradient-to-r from-black/85 via-black/40 to-transparent pointer-events-none transition-opacity duration-700"
                  />
                ) : (
                  /* Slide 2 (Hoodie) has natural bright concrete background - zero veil/scrim over hoodie */
                  <div
                    className="absolute inset-y-0 left-0 w-full sm:w-[35%] bg-gradient-to-t sm:bg-gradient-to-r from-white/40 via-white/15 to-transparent pointer-events-none transition-opacity duration-700 sm:opacity-60"
                  />
                )}

                {/* BG Watermark */}
                <div
                  className="absolute top-[8%] sm:top-[10%] inset-x-0 flex justify-center pointer-events-none select-none z-10 overflow-hidden"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateY(0)' : 'translateY(24px)',
                    transition: 'opacity 1s 0.2s cubic-bezier(0.23,1,0.32,1), transform 1s 0.2s cubic-bezier(0.23,1,0.32,1)',
                  }}
                >
                  <span className={`font-anton uppercase tracking-[0.16em] sm:tracking-[0.22em] text-[15vw] sm:text-[13.5vw] leading-none whitespace-nowrap ${
                    isDark ? 'text-white/[0.08]' : 'text-black/[0.06]'
                  }`}>
                    {slide.watermark}
                  </span>
                </div>

                {/* Main headline + CTA */}
                <div
                  className="absolute top-[18%] sm:top-[22%] lg:top-[26%] left-4 sm:left-14 lg:left-20 right-4 sm:right-auto z-20 max-w-[92vw] sm:max-w-2xl"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'opacity 0.9s 0.3s cubic-bezier(0.23,1,0.32,1), transform 0.9s 0.3s cubic-bezier(0.23,1,0.32,1)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2.5 sm:mb-4">
                    <div className={`w-8 sm:w-12 h-[1px] ${isDark ? 'bg-white/40' : 'bg-black/30'}`} />
                    <p className={`font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] font-semibold ${
                      isDark ? 'text-white/80' : 'text-black/75'
                    }`}>
                      {slide.category}
                    </p>
                  </div>

                  <p
                    className={`font-syne font-black text-xs sm:text-base lg:text-lg uppercase tracking-wider mb-1 sm:mb-2 ${
                      isDark ? 'text-white' : 'text-black'
                    }`}
                    style={{
                      clipPath: isActive ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
                      transition: 'clip-path 0.8s 0.5s cubic-bezier(0.77,0,0.175,1)',
                    }}
                  >
                    {slide.tagline}
                  </p>

                  {renderHeroHeadline(slide)}

                  <div className="mt-4 sm:mt-8 flex items-center gap-4">
                    <Link
                      to={slide.ctaLink}
                      className={`group relative border px-5 sm:px-8 py-2.5 sm:py-3 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-colors duration-500 overflow-hidden shadow-xl ${
                        isDark
                          ? 'border-white/50 text-white hover:text-black bg-black/60 hover:bg-white'
                          : 'border-black/50 text-black hover:text-white bg-white/80 hover:bg-black'
                      }`}
                    >
                      <span className="relative z-10 font-bold">{slide.ctaText}</span>
                      <span className={`absolute inset-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] ${
                        isDark ? 'bg-white' : 'bg-black'
                      }`} />
                    </Link>
                    <span className={`font-mono text-[9px] uppercase tracking-widest hidden sm:inline ${
                      isDark ? 'text-white/40' : 'text-black/35'
                    }`}>→</span>
                  </div>
                </div>

                {/* Vertical SCROLL label */}
                <div
                  className="absolute bottom-16 sm:bottom-24 left-3 sm:left-6 z-20 pointer-events-none select-none flex items-center gap-3 -rotate-90 origin-left hidden sm:flex"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.8s 0.6s cubic-bezier(0.23,1,0.32,1)',
                  }}
                >
                  <span className={`w-6 h-[1px] ${isDark ? 'bg-white/40' : 'bg-black/25'}`} />
                  <span className={`font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.4em] ${
                    isDark ? 'text-white/60' : 'text-black/45'
                  }`}>
                    Scroll
                  </span>
                </div>

                {/* Spec badge */}
                <div
                  className={`absolute bottom-16 sm:bottom-20 right-4 sm:right-10 z-20 pointer-events-none select-none text-right font-mono p-2 sm:p-0 border sm:border-0 ${
                    isDark
                      ? 'border-white/15 bg-black/40 sm:bg-transparent text-white'
                      : 'border-black/15 bg-white/60 sm:bg-transparent text-black'
                  }`}
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateY(0)' : 'translateY(12px)',
                    transition: 'opacity 0.8s 0.55s cubic-bezier(0.23,1,0.32,1), transform 0.8s 0.55s cubic-bezier(0.23,1,0.32,1)',
                  }}
                >
                  <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-white/90' : 'text-black/85'
                  }`}>
                    {slide.badgeTitle}
                  </p>
                  <p className={`text-[8px] sm:text-[10px] uppercase tracking-[0.3em] mt-0.5 sm:mt-1 ${
                    isDark ? 'text-white/65' : 'text-black/55'
                  }`}>
                    {slide.badgeSubtitle}
                  </p>
                </div>

                {/* Slide index top-right */}
                <div
                  className="absolute top-4 sm:top-8 right-4 sm:right-10 z-20 pointer-events-none select-none font-mono"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.8s 0.4s cubic-bezier(0.23,1,0.32,1)',
                  }}
                >
                  <span className={`text-[10px] sm:text-xs tracking-[0.4em] font-bold ${
                    isDark ? 'text-white/75' : 'text-black/70'
                  }`}>
                    0{idx + 1} / 0{heroSlides.length}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows */}
          <button
            onClick={prevHeroSlide}
            className={`absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center border transition-all duration-300 font-mono text-xs sm:text-sm ${
              heroSlides[currentHeroSlide]?.theme === 'dark'
                ? 'bg-black/50 hover:bg-white hover:text-black text-white border-white/20'
                : 'bg-white/70 hover:bg-black hover:text-white text-black border-black/15'
            }`}
            aria-label="Previous Hero Slide"
          >
            ←
          </button>
          <button
            onClick={nextHeroSlide}
            className={`absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center border transition-all duration-300 font-mono text-xs sm:text-sm ${
              heroSlides[currentHeroSlide]?.theme === 'dark'
                ? 'bg-black/50 hover:bg-white hover:text-black text-white border-white/20'
                : 'bg-white/70 hover:bg-black hover:text-white text-black border-black/15'
            }`}
            aria-label="Next Hero Slide"
          >
            →
          </button>

          {/* Slide Indicator Pills */}
          <div className="absolute bottom-4 sm:bottom-8 inset-x-0 flex justify-center items-center gap-1.5 sm:gap-3 z-30 px-3">
            {heroSlides.map((s, idx) => {
              const isActive = currentHeroSlide === idx;
              const currentIsDark = heroSlides[currentHeroSlide]?.theme === 'dark';
              return (
                <button
                  key={s.id}
                  onClick={() => { resetTimer(); setCurrentHeroSlide(idx); }}
                  className={`relative overflow-hidden flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 transition-all duration-400 border ${
                    isActive
                      ? currentIsDark
                        ? 'bg-white text-black border-white shadow-lg'
                        : 'bg-black text-white border-black shadow-lg'
                      : currentIsDark
                        ? 'bg-black/60 hover:bg-black/80 text-white/75 hover:text-white border-white/25'
                        : 'bg-white/70 hover:bg-white text-black/70 hover:text-black border-black/20'
                  }`}
                >
                  <span className="font-mono text-[8px] sm:text-[10px] tracking-wider uppercase font-bold relative z-10">
                    {s.label}
                  </span>
                  {isActive && (
                    <span
                      key={`progress-${currentHeroSlide}`}
                      className={`absolute bottom-0 left-0 right-0 h-[2px] origin-left ${
                        currentIsDark ? 'bg-black' : 'bg-white'
                      }`}
                      style={{ animation: 'lineGrow 5s linear forwards' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TICKER TAPE */}
        <div className="w-full bg-black py-3 sm:py-3.5 z-30 relative overflow-hidden -mt-[1px]">
          <div className="marquee-fast flex w-max whitespace-nowrap font-anton text-3xl sm:text-5xl text-white uppercase tracking-[0.15em]">
            <span className="px-6 sm:px-8">DESTROY THE NORM ✦ EMBRACE THE CHAOS ✦</span>
            <span className="px-6 sm:px-8">DESTROY THE NORM ✦ EMBRACE THE CHAOS ✦</span>
            <span className="px-6 sm:px-8">DESTROY THE NORM ✦ EMBRACE THE CHAOS ✦</span>
            <span className="px-6 sm:px-8">DESTROY THE NORM ✦ EMBRACE THE CHAOS ✦</span>
            <span className="px-6 sm:px-8">DESTROY THE NORM ✦ EMBRACE THE CHAOS ✦</span>
            <span className="px-6 sm:px-8">DESTROY THE NORM ✦ EMBRACE THE CHAOS ✦</span>
            <span className="px-6 sm:px-8">DESTROY THE NORM ✦ EMBRACE THE CHAOS ✦</span>
            <span className="px-6 sm:px-8">DESTROY THE NORM ✦ EMBRACE THE CHAOS ✦</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 2. THE MANIFESTO (WE ARE A SYNDICATE)   */}
      {/* ═══════════════════════════════════════ */}
      <section id="manifesto" className="bg-[#0a0a0a] text-white relative z-20 overflow-hidden -mt-[1px]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-4 sm:pt-6 pb-10 sm:pb-12 relative z-10">
          <div className="reveal-on-scroll opacity-0 translate-y-2 transition-all duration-700 ease-out">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
              <div className="lg:col-span-7">
                <p className="font-mono text-white/30 text-[9px] sm:text-[10px] tracking-[0.4em] uppercase mb-2 flex items-center gap-3">
                  <span className="w-6 h-[1px] bg-white/20" />
                  The Skauns Manifesto
                </p>
                <h2 className="font-bebas text-3xl sm:text-4xl lg:text-5xl leading-[0.95] tracking-tight !mb-0">
                  <span className="text-white/40">WE ARE NOT</span>{' '}
                  <span className="text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.6)' }}>A BRAND.</span>
                  <br />
                  <span className="text-white/40">WE ARE A</span>{' '}
                  <span className="font-anton uppercase text-white text-4xl sm:text-5xl lg:text-6xl tracking-tight inline-block relative">
                    SYNDICATE
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-white/25" />
                  </span>
                </h2>
              </div>
              <div className="lg:col-span-5">
                <div className="border-l border-white/10 pl-5 sm:pl-6">
                  <p className="font-mono text-xs sm:text-[13px] text-white/50 leading-[1.7] mb-4">
                    You don't wear our clothes to fit in. You wear them to declare war on the ordinary. Heavyweight fabrics, aggressive cuts, zero apologies.
                  </p>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-white/60 hover:text-white transition-all duration-300 group"
                  >
                    Read Full Manifesto
                    <span className="w-5 h-[1px] bg-white/30 group-hover:w-8 transition-all duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-0 text-[12vw] text-white/[0.015] font-bebas leading-none select-none pointer-events-none whitespace-nowrap">
          SKAUNS
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════ */}
      {/* DYNAMIC CATEGORIES & CAMPAIGN BANNERS (LIVE CMS)      */}
      {/* ═════════════════════════════════════════════════════ */}
      {categories.map((cat, index) => {
        const catProducts = products.filter((p) => p.category === cat.id);
        const banner = sectionBanners.find((b) => b.categoryId === cat.id);
        return (
          <CategoryCarousel
            key={cat.id}
            index={index}
            category={cat}
            banner={banner}
            products={catProducts}
            cardsPerView={cardsPerView}
          />
        );
      })}

      {/* ═════════════════════════════════════════════════════ */}
      {/* INTERACTIVE FIT ADVISOR & SIZING MATRIX               */}
      {/* ═════════════════════════════════════════════════════ */}
      <FitAdvisor />

      {/* ═══════════════════════════════════════ */}
      {/* 5. CODE OF CONDUCT                      */}
      {/* ═══════════════════════════════════════ */}
      <section className="bg-[#f9f9f7] py-24 sm:py-36 px-6 sm:px-10 relative overflow-hidden">
        {/* Ghost background numerals */}
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none select-none overflow-hidden">
          <span className="font-bebas text-[30vw] text-black/[0.025] leading-none pr-4 sm:pr-10">CODE</span>
        </div>

        <div className="max-w-7xl mx-auto reveal-on-scroll opacity-0 translate-y-12 transition-all duration-1000 ease-out">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-dark/30 mb-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-black/15" />
                Principles
              </p>
              <div className="font-bebas text-6xl sm:text-7xl lg:text-8xl leading-[0.85] text-black break-words">
                THE<br/>CODE<br/>OF<br/>CONDUCT
              </div>
            </div>
            <div className="lg:col-span-8 space-y-0 flex flex-col justify-center">
              {codeOfConduct.map((rule) => (
                <div
                  key={rule.num}
                  className="group flex gap-6 sm:gap-8 items-center py-6 sm:py-7 border-b border-black/[0.07] first:border-t hover:bg-white/70 transition-all duration-500 px-2 sm:px-4 -mx-2 sm:-mx-4"
                >
                  <span className="font-mono text-3xl sm:text-5xl text-black/[0.06] font-black tracking-tight min-w-[3rem] select-none group-hover:text-black/10 transition-colors duration-500">
                    {rule.num}
                  </span>
                  <div className="flex-1">
                    <p className="font-syne font-black text-xl sm:text-2xl lg:text-3xl uppercase tracking-tight text-dark/80 group-hover:text-dark transition-colors duration-300">
                      {rule.text}
                    </p>
                    <p className="font-mono text-[10px] sm:text-xs text-dark/30 mt-1 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-400 -translate-y-1 group-hover:translate-y-0">
                      {rule.sub}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-black/15 group-hover:text-black/40 transition-colors duration-300 pr-2 select-none">
                    →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 6. JOIN THE SYNDICATE                   */}
      {/* ═══════════════════════════════════════ */}
      <section className="bg-white pt-8 sm:pt-10 pb-14 sm:pb-20 px-6 sm:px-10 relative z-20">
        <div className="max-w-3xl mx-auto text-center reveal-on-scroll opacity-0 translate-y-8 transition-all duration-700 ease-out">
          <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-dark/30 mb-2">Newsletter</p>
          <h2 className="font-bebas text-3xl sm:text-5xl lg:text-6xl mb-3 leading-none text-dark tracking-tight">JOIN THE SYNDICATE</h2>
          <p className="font-mono text-dark/40 text-xs sm:text-[13px] mb-6 max-w-md mx-auto leading-relaxed">
            Classified intel on drops, vault openings, and release coordinates. No spam. Ever.
          </p>
          <form className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-[#f9f9f7] border border-black/10 px-4 py-3 font-mono text-xs text-dark placeholder:text-dark/25 outline-none focus:border-black/30 transition-colors"
            />
            <button className="bg-black text-white font-mono text-[11px] uppercase tracking-[0.2em] px-6 py-3 hover:bg-black/80 transition-all duration-300">
              Subscribe
            </button>
          </form>
          <p className="font-mono text-[8px] sm:text-[9px] text-dark/25 uppercase tracking-widest mt-4">
            By subscribing you agree to our privacy policy
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 7. COMMS SECTION                        */}
      {/* ═══════════════════════════════════════ */}
      <section id="comms" className="bg-[#0a0a0a] text-white relative z-20 px-6 sm:px-10 py-24 sm:py-36">
        <div className="max-w-[1400px] mx-auto reveal-on-scroll opacity-0 translate-y-12 transition-all duration-1000 ease-out">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
            <div className="lg:col-span-5 flex flex-col justify-center">
              <p className="font-mono text-white/25 text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-5 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-white/15" />
                Get In Touch
              </p>
              <h2 className="font-anton text-5xl sm:text-7xl uppercase tracking-tight mb-6 !mb-6">Comms Direct</h2>
              <p className="font-mono text-white/35 text-[13px] sm:text-sm leading-[1.8] mb-10">
                Inquiries regarding sizing, custom allocations, or syndicate collaborations. Response within 24 hours.
              </p>
              <div className="space-y-6 font-mono text-sm">
                <div>
                  <p className="text-[10px] text-white/20 tracking-[0.3em] mb-2 uppercase">Email</p>
                  <a href="mailto:skauns.help@gmail.com" className="text-base text-white/70 hover:text-white transition-colors duration-300 link-underline">skauns.help@gmail.com</a>
                </div>
                <div>
                  <p className="uppercase tracking-[0.3em] text-white/20 text-[10px] mb-2">Social</p>
                  <div className="flex gap-6 text-white/40">
                    <a
                      href="https://www.instagram.com/skauns.25"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors duration-300 text-sm link-underline text-white/80 font-bold"
                    >
                      Instagram (@skauns.25) ↗
                    </a>
                    {['TikTok', 'Twitter'].map((s) => (
                      <a
                        key={s}
                        href="https://www.instagram.com/skauns.25"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors duration-300 text-sm link-underline"
                      >
                        {s}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-[#111] border border-white/[0.05] p-8 sm:p-12">
                {commsSubmitted ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[350px] text-center font-mono">
                    <div className="w-12 h-12 border border-white/20 flex items-center justify-center mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <h3 className="text-xl font-syne font-black uppercase tracking-wide mb-2">Transmission Received</h3>
                    <p className="text-white/30 mb-8 text-[13px]">We'll get back to you within 24 hours.</p>
                    <button onClick={() => setCommsSubmitted(false)} className="text-white/40 text-xs hover:text-white transition-colors duration-300 font-mono uppercase tracking-widest link-underline">Send Another</button>
                  </div>
                ) : (
                  <form onSubmit={handleHomeCommsSubmit} className="space-y-7">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
                      <div>
                        <label className="block font-mono uppercase tracking-[0.2em] text-white/20 text-[10px] mb-3">Name</label>
                        <input
                          required
                          type="text"
                          value={commsForm.name}
                          onChange={(e) => setCommsForm({ ...commsForm, name: e.target.value })}
                          className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/35 transition-colors font-mono"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block font-mono uppercase tracking-[0.2em] text-white/20 text-[10px] mb-3">Email</label>
                        <input
                          required
                          type="email"
                          value={commsForm.email}
                          onChange={(e) => setCommsForm({ ...commsForm, email: e.target.value })}
                          className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/35 transition-colors font-mono"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-mono uppercase tracking-[0.2em] text-white/20 text-[10px] mb-3">Message</label>
                      <textarea
                        required
                        rows={5}
                        value={commsForm.message}
                        onChange={(e) => setCommsForm({ ...commsForm, message: e.target.value })}
                        className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-white/35 transition-colors resize-none font-mono"
                        placeholder="Your message..."
                      />
                    </div>
                    <button type="submit" className="w-full bg-white text-black py-4 font-mono text-xs uppercase tracking-[0.25em] hover:bg-white/90 transition-all duration-300 mt-2">
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
