import React from 'react';

export interface SectionBannerProps {
  title: string;
  categoryName: string;
  gsm: string;
  coolLine: string;
  image: string;
  targetSectionId: string;
  itemCount: number;
  objectPosition?: string;
}

export const SectionBanner: React.FC<SectionBannerProps> = ({
  title,
  categoryName,
  gsm,
  coolLine,
  image,
  targetSectionId,
  itemCount,
  objectPosition = 'object-[center_32%]',
}) => {
  const scrollToTarget = () => {
    const el = document.getElementById(targetSectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      onClick={scrollToTarget}
      className="relative w-full h-[260px] sm:h-[300px] md:h-[320px] overflow-hidden border-y border-black/10 select-none cursor-pointer group"
      aria-label={`SKAUNS ${title} Section Banner`}
    >
      {/* Full-width Edge-to-Edge Campaign Image (Cropped to optimal focal zone) */}
      <img
        src={image}
        alt={`SKAUNS ${title} Campaign`}
        className={`absolute inset-0 w-full h-full object-cover ${objectPosition} transition-transform duration-700 ease-out group-hover:scale-[1.03]`}
        loading="eager"
      />

      {/* Contrast Scrim for Text Legibility Over High-Key Backgrounds */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none transition-opacity duration-500 group-hover:bg-black/15" />

      {/* Center Brutalist Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        
        {/* Top Kicker: SKAUNS + GSM */}
        <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.45em] text-white font-bold mb-1 [text-shadow:_0_2px_14px_rgba(0,0,0,0.9)]">
          SKAUNS // {gsm}
        </p>

        {/* Center Title: Transparent center with distinct white outline & dark shadow */}
        <h2
          className="font-anton uppercase tracking-[0.06em] text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.85] text-transparent select-none !mb-0"
          style={{
            WebkitTextStroke: '2px rgba(255, 255, 255, 0.95)',
            filter: 'drop-shadow(0 4px 18px rgba(0, 0, 0, 0.85)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.9))',
          }}
        >
          {title}.
        </h2>

        {/* Bottom Cool Line */}
        <p className="font-mono text-[11px] sm:text-xs md:text-sm text-white/95 uppercase tracking-[0.25em] mt-2 sm:mt-3 max-w-2xl px-4 [text-shadow:_0_2px_12px_rgba(0,0,0,0.95)]">
          {coolLine}
        </p>

        {/* Scroll Pill Indicator */}
        <div className="mt-3.5 inline-flex items-center gap-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-white/80 group-hover:text-white transition-colors duration-300 [text-shadow:_0_2px_10px_rgba(0,0,0,0.9)]">
          <span>Explore {itemCount} {categoryName}</span>
          <span className="transform group-hover:translate-y-0.5 transition-transform duration-300 text-xs">↓</span>
        </div>

      </div>

      {/* Technical corner ticks */}
      <div className="absolute top-4 left-6 z-20 pointer-events-none font-mono text-[9px] text-white/70 tracking-[0.3em] uppercase [text-shadow:_0_1px_8px_rgba(0,0,0,0.9)] hidden sm:block">
        + {categoryName}
      </div>
      <div className="absolute top-4 right-6 z-20 pointer-events-none font-mono text-[9px] text-white/70 tracking-[0.3em] uppercase [text-shadow:_0_1px_8px_rgba(0,0,0,0.9)] hidden sm:block">
        {gsm} +
      </div>
      <div className="absolute bottom-4 left-6 z-20 pointer-events-none font-mono text-[9px] text-white/70 tracking-[0.3em] uppercase [text-shadow:_0_1px_8px_rgba(0,0,0,0.9)] hidden sm:block">
        + SKAUNS SS26
      </div>
      <div className="absolute bottom-4 right-6 z-20 pointer-events-none font-mono text-[9px] text-white/70 tracking-[0.3em] uppercase [text-shadow:_0_1px_8px_rgba(0,0,0,0.9)] hidden sm:block">
        CHAPTER ARCHIVE +
      </div>
    </section>
  );
};
