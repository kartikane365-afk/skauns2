import React, { useState, useEffect, useCallback } from 'react';
import { playTactileClick, playShutterClick } from '../utils/audio';

export interface LookbookItem {
  id: string;
  lookNumber: string;
  title: string;
  category: 'Boxy Tees' | 'Cotton Blend Waffles' | 'Pure Cotton Hoodies';
  image: string;
  metadata: string;
  sector: string;
  garmentNotes: string;
  gsm: number;
  focalLength: string;
  shutterSpeed: string;
  aperture: string;
  productId?: string;
  silhouette: string;
  colorway: string;
}

export interface LookbookGalleryProps {
  onProductSelect?: (productId: string) => void;
}

const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: 'look-01',
    lookNumber: 'LOOK 01',
    title: 'BIO-SPINE SLOUCH HOODIE',
    category: 'Pure Cotton Hoodies',
    image: '/direct/Gemini_Generated_Image (18).jpeg',
    metadata: '35MM MONOCHROME // 1/250S F/2.8',
    sector: 'LOS ANGELES SECTOR 04',
    garmentNotes: '360 GSM pure cotton heavyweight fleece with articulated drop-shoulder slouch. Reverse cyber-sigil spine graphic with dense raised lacquer ink.',
    gsm: 360,
    focalLength: '35mm',
    shutterSpeed: '1/250s',
    aperture: 'f/2.8',
    productId: 'hoodie-cybersigil-bio-spine',
    silhouette: 'Oversized Box Hoodie',
    colorway: 'Pitch Black',
  },
  {
    id: 'look-02',
    lookNumber: 'LOOK 02',
    title: 'RAW BONE MONOLITH TEE',
    category: 'Boxy Tees',
    image: '/direct/Gemini_Generated_Image (24).jpeg',
    metadata: '50MM TACTICAL // 1/500S F/1.8',
    sector: 'TOKYO SHIBUYA SUB-LEVEL 2',
    garmentNotes: '240 GSM unbleached combed ecru cotton. Architectural square torso with reinforced high-rib crew collar and raw shoulder drop.',
    gsm: 240,
    focalLength: '50mm',
    shutterSpeed: '1/500s',
    aperture: 'f/1.8',
    productId: 'neo-tribal-totem',
    silhouette: 'Heavyweight Boxy Tee',
    colorway: 'Raw Bone Ecru',
  },
  {
    id: 'look-03',
    lookNumber: 'LOOK 03',
    title: 'SACRED SPIRE HONEYCOMB KNIT',
    category: 'Cotton Blend Waffles',
    image: '/direct/Gemini_Generated_Image (29).jpeg',
    metadata: '85MM PORTRAIT // 1/160S F/2.0',
    sector: 'BERLIN MITTE BUNKER 09',
    garmentNotes: '240 GSM micro-honeycomb cotton blend knit weave. Extended knuckles with thumbhole contouring and stone-washed distressed ribbing.',
    gsm: 240,
    focalLength: '85mm',
    shutterSpeed: '1/160s',
    aperture: 'f/2.0',
    productId: 'waffle-kneeling-angel',
    silhouette: 'Cotton Blend Waffle Longsleeve',
    colorway: 'Raw Bone / Silver',
  },
  {
    id: 'look-04',
    lookNumber: 'LOOK 04',
    title: 'CATHEDRAL SHADOW BOX CUT',
    category: 'Boxy Tees',
    image: '/direct/Gemini_Generated_Image (21).jpeg',
    metadata: '28MM WIDE BRUTALIST // 1/320S F/4.0',
    sector: 'LONDON WHITECHAPEL SECTOR',
    garmentNotes: '240 GSM pitch black carbonized jersey. Needlepoint gothic cathedral arches with high-density silver ink and distressed hemline.',
    gsm: 240,
    focalLength: '28mm',
    shutterSpeed: '1/320s',
    aperture: 'f/4.0',
    productId: 'cathedral-spire',
    silhouette: 'Heavyweight Boxy Tee',
    colorway: 'Pitch Black',
  },
  {
    id: 'look-05',
    lookNumber: 'LOOK 05',
    title: 'DUAL-ZIP CYBER PURE COTTON HOODIE',
    category: 'Pure Cotton Hoodies',
    image: '/direct/Gemini_Generated_Image (27).jpeg',
    metadata: '40MM PRIME // 1/200S F/2.2',
    sector: 'SEOUL GANGNAM MONOLITH',
    garmentNotes: '360 GSM ultra-heavy pure cotton fleece. Rigid double-layer hood with zero slouch deformation and heavy gunmetal hardware.',
    gsm: 360,
    focalLength: '40mm',
    shutterSpeed: '1/200s',
    aperture: 'f/2.2',
    productId: 'hoodie-crimson-bleed-spine',
    silhouette: 'Pure Cotton Hoodie Pullover',
    colorway: 'Deep Charcoal Black',
  },
  {
    id: 'look-06',
    lookNumber: 'LOOK 06',
    title: 'BAT CATHEDRAL WAFFLE KNIT',
    category: 'Cotton Blend Waffles',
    image: '/direct/Gemini_Generated_Image (32).jpeg',
    metadata: '35MM COLD SPECTRUM // 1/400S F/2.5',
    sector: 'MILAN NAVIGLI INDUSTRIAL',
    garmentNotes: '240 GSM cotton blend knit waffle matrix. Cold-dyed pigment finish with gothic nocturnal scripture along spine and forearm ribs.',
    gsm: 240,
    focalLength: '35mm',
    shutterSpeed: '1/400s',
    aperture: 'f/2.5',
    productId: 'waffle-bat-cathedral',
    silhouette: 'Cotton Blend Waffle Longsleeve',
    colorway: 'Raw Bone Ecru',
  },
  {
    id: 'look-07',
    lookNumber: 'LOOK 07',
    title: 'CRIMSON SERAPH OVERSIZED TEE',
    category: 'Boxy Tees',
    image: '/direct/Gemini_Generated_Image (35).jpeg',
    metadata: '50MM CINE // 1/250S F/1.4',
    sector: 'PARIS BELLEVILLE DISTRICT',
    garmentNotes: '240 GSM bio-washed raw bone jersey. Front seraph angel illustration with arterial crimson lacquer wings and dropped armholes.',
    gsm: 240,
    focalLength: '50mm',
    shutterSpeed: '1/250s',
    aperture: 'f/1.4',
    productId: 'crimson-fallen-angel',
    silhouette: 'Heavyweight Boxy Tee',
    colorway: 'Raw Bone / Blood Red',
  },
  {
    id: 'look-08',
    lookNumber: 'LOOK 08',
    title: 'MONOLITH HOODED FORTRESS',
    category: 'Pure Cotton Hoodies',
    image: '/direct/Gemini_Generated_Image (39).jpeg',
    metadata: '70MM TELE // 1/640S F/2.8',
    sector: 'REYKJAVIK GEOTHERMAL DOCK',
    garmentNotes: '360 GSM double-faced pure cotton fleece shield. Reinforced kangaroo pocket with dual concealed device sleeves and raw marrow stitching.',
    gsm: 360,
    focalLength: '70mm',
    shutterSpeed: '1/640s',
    aperture: 'f/2.8',
    productId: 'hoodie-cathedral-spires-needlepoint',
    silhouette: 'Pure Cotton Hoodie Pullover',
    colorway: 'Pitch Black',
  },
];

type FilterCategory = 'All' | 'Boxy Tees' | 'Cotton Blend Waffles' | 'Pure Cotton Hoodies';

export const LookbookGallery: React.FC<LookbookGalleryProps> = ({ onProductSelect }) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const [selectedLookIndex, setSelectedLookIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomCoords, setZoomCoords] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const filteredLooks = activeFilter === 'All'
    ? LOOKBOOK_ITEMS
    : LOOKBOOK_ITEMS.filter((item) => item.category === activeFilter);

  const handleFilterClick = (filter: FilterCategory) => {
    playTactileClick();
    setActiveFilter(filter);
  };

  const openLightbox = (look: LookbookItem) => {
    playShutterClick();
    const globalIdx = LOOKBOOK_ITEMS.findIndex((item) => item.id === look.id);
    setSelectedLookIndex(globalIdx >= 0 ? globalIdx : 0);
    setIsZoomed(false);
  };

  const closeLightbox = useCallback(() => {
    playTactileClick();
    setSelectedLookIndex(null);
    setIsZoomed(false);
  }, []);

  const nextLook = useCallback(() => {
    playShutterClick();
    setSelectedLookIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % LOOKBOOK_ITEMS.length;
    });
    setIsZoomed(false);
  }, []);

  const prevLook = useCallback(() => {
    playShutterClick();
    setSelectedLookIndex((prev) => {
      if (prev === null) return 0;
      return (prev - 1 + LOOKBOOK_ITEMS.length) % LOOKBOOK_ITEMS.length;
    });
    setIsZoomed(false);
  }, []);

  // Keyboard navigation inside lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedLookIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLook();
      if (e.key === 'ArrowLeft') prevLook();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLookIndex, closeLightbox, nextLook, prevLook]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedLookIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedLookIndex]);

  const activeLook = selectedLookIndex !== null ? LOOKBOOK_ITEMS[selectedLookIndex] : null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomCoords({ x, y });
  };

  const toggleZoom = () => {
    playTactileClick();
    setIsZoomed((prev) => !prev);
  };

  return (
    <section
      id="lookbook"
      className="relative w-full bg-[#0a0a0a] text-[#f4f4f0] py-20 sm:py-28 px-4 sm:px-8 lg:px-12 border-b border-[#262626] overflow-hidden"
      aria-label="SS26 Editorial Runway Lookbook"
    >
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      {/* Ghost Watermark */}
      <div
        className="absolute -top-10 -right-10 font-bebas text-[18vw] leading-none text-white/[0.02] uppercase pointer-events-none select-none tracking-widest hidden md:block"
        aria-hidden="true"
      >
        EDITORIAL
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#262626]">
          <div>
            <div className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#f4f4f0]/70 mb-3">
              <span className="w-2 h-2 bg-[#f4f4f0] inline-block animate-pulse" />
              <span>ARCHIVAL RUNWAY // SS26 CHAPTER 01</span>
            </div>
            <h2 className="font-syne font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tighter text-[#f4f4f0] !mb-2">
              LOOKBOOK<span className="text-[#f4f4f0]/40">.</span>
            </h2>
            <p className="font-mono text-xs sm:text-sm text-[#f4f4f0]/60 max-w-xl uppercase tracking-wider">
              Tactical silhouettes captured in raw industrial environments. Curated drape studies across 240 GSM boxy tees, 240 GSM cotton blend knit waffles, and 360 GSM pure cotton hoodies.
            </p>
          </div>

          {/* Technical Telemetry */}
          <div className="flex flex-col sm:items-end font-mono text-[10px] sm:text-xs text-[#f4f4f0]/60 tracking-widest uppercase space-y-1">
            <div>OPTICAL SENSOR: 35MM FULL-FRAME</div>
            <div>SHUTTER: MECHANICAL TITANIUM</div>
            <div className="text-[#f4f4f0] font-bold">TOTAL LOOKS: [08 UNITS]</div>
          </div>
        </div>

        {/* Filter Navigation & Counter */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-8">
          {/* Silhouette Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'Boxy Tees', 'Cotton Blend Waffles', 'Pure Cotton Hoodies'] as FilterCategory[]).map((tab) => {
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleFilterClick(tab)}
                  className={`font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] px-4 py-2 border transition-all duration-300 tactile-press ${
                    isActive
                      ? 'bg-[#f4f4f0] text-[#0a0a0a] border-[#f4f4f0] font-bold shadow-[0_0_15px_rgba(244,244,240,0.15)]'
                      : 'bg-black/50 text-[#f4f4f0]/70 border-[#262626] hover:border-[#f4f4f0]/60 hover:text-[#f4f4f0]'
                  }`}
                >
                  {tab === 'All' ? `ALL LOOKS (${LOOKBOOK_ITEMS.length})` : tab}
                </button>
              );
            })}
          </div>

          {/* Quick Progress Indicator */}
          <div className="font-mono text-xs text-[#f4f4f0]/50 tracking-widest uppercase">
            VIEWING <span className="text-[#f4f4f0] font-bold">{filteredLooks.length}</span> OF {LOOKBOOK_ITEMS.length} ARCHIVAL FRAMES
          </div>
        </div>

        {/* Lookbook Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-4">
          {filteredLooks.map((look) => (
            <article
              key={look.id}
              onClick={() => openLightbox(look)}
              className="group relative bg-[#0a0a0a] border border-[#262626] hover:border-[#f4f4f0] transition-colors duration-500 flex flex-col justify-between corner-tick overflow-hidden cursor-pointer"
            >
              {/* Image Frame with Aspect Ratio */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
                <img
                  src={look.image}
                  alt={`${look.lookNumber} - ${look.title}`}
                  className="w-full h-full object-cover object-center grayscale contrast-110 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
                  loading="lazy"
                />

                {/* Cyber HUD Badges on Image */}
                <div className="absolute top-3 left-3 z-10 font-mono text-[9px] uppercase tracking-[0.25em] bg-black/80 backdrop-blur-sm px-2.5 py-1 text-[#f4f4f0] border border-[#262626]">
                  {look.lookNumber}
                </div>

                <div className="absolute top-3 right-3 z-10 font-mono text-[9px] uppercase tracking-[0.2em] bg-black/80 backdrop-blur-sm px-2 py-1 text-[#f4f4f0]/80 border border-[#262626]">
                  {look.gsm} GSM
                </div>

                {/* Hover Inspection Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-none border border-[#f4f4f0] flex items-center justify-center mb-3 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="font-mono text-xs text-[#f4f4f0]">+</span>
                  </div>
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#f4f4f0] font-bold mb-1">
                    INSPECT FRAME
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#f4f4f0]/70">
                    SHUTTER CLICK // ZOOM ACTIVE
                  </span>
                </div>
              </div>

              {/* Look Card Metadata Body */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow border-t border-[#262626] bg-[#0d0d0d]">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#f4f4f0]/50 uppercase tracking-widest mb-1.5">
                    <span>{look.category}</span>
                    <span>{look.sector}</span>
                  </div>
                  <h3 className="font-syne font-bold text-base sm:text-lg text-[#f4f4f0] tracking-tight group-hover:text-white transition-colors line-clamp-1 mb-2">
                    {look.title}
                  </h3>
                  <p className="font-mono text-[11px] text-[#f4f4f0]/60 line-clamp-2 leading-relaxed mb-4">
                    {look.garmentNotes}
                  </p>
                </div>

                {/* Card Footer Technical Meta */}
                <div className="pt-3 border-t border-[#1f1f1f] flex items-center justify-between font-mono text-[9px] text-[#f4f4f0]/50 uppercase tracking-wider">
                  <span>{look.metadata}</span>
                  <span className="text-[#f4f4f0] font-bold group-hover:translate-x-1 transition-transform">
                    OPEN →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Lookbook Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#f4f4f0]/60">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block animate-ping" />
            <span className="tracking-widest uppercase">AUDIO ENGINE ACTIVE // PROCEDURAL SHUTTER ENABLED</span>
          </div>
          <div className="tracking-widest uppercase text-[10px] text-[#f4f4f0]/50">
            HIGH-SPEED TITANIUM FOCAL PLANE SIMULATION
          </div>
        </div>

      </div>

      {/* ─── Brutalist Inspection Lightbox Modal ─────────────────── */}
      {activeLook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-6 lg:p-10 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={`Inspection Modal - ${activeLook.title}`}
          onClick={closeLightbox}
        >
          {/* Modal Container */}
          <div
            className="relative w-full max-w-6xl max-h-[92vh] bg-[#0a0a0a] border border-[#333333] shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col lg:flex-row overflow-hidden corner-tick-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Controls for Mobile */}
            <div className="lg:hidden flex items-center justify-between p-3 border-b border-[#262626] bg-[#0d0d0d] font-mono text-xs">
              <span className="text-[#f4f4f0]/80 tracking-widest">{activeLook.lookNumber} // ARCHIVE</span>
              <button
                onClick={closeLightbox}
                className="px-3 py-1 border border-[#444] text-[#f4f4f0] font-bold uppercase text-xs"
              >
                CLOSE [ESC]
              </button>
            </div>

            {/* Left: Interactive Inspection Image Viewport */}
            <div
              className={`relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[360px] sm:min-h-[480px] lg:min-h-[640px] select-none ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onMouseMove={handleMouseMove}
              onClick={toggleZoom}
            >
              <img
                src={activeLook.image}
                alt={`${activeLook.lookNumber} Full Inspection`}
                className={`max-w-full max-h-[85vh] object-contain transition-transform duration-200 ease-out ${
                  isZoomed ? 'scale-[2.4]' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? { transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%` }
                    : undefined
                }
              />

              {/* Viewport Crosshair Coordinates HUD */}
              <div className="absolute top-4 left-4 pointer-events-none font-mono text-[9px] uppercase tracking-widest text-[#f4f4f0]/70 bg-black/80 px-2 py-1 border border-[#262626]">
                {isZoomed ? `ZOOM 2.4X // LOC: ${Math.round(zoomCoords.x)}% / ${Math.round(zoomCoords.y)}%` : 'CLICK TO TOGGLE 2.4X INSPECTION'}
              </div>

              {/* Shutter Blade Simulation Watermark */}
              <div className="absolute bottom-4 left-4 pointer-events-none font-mono text-[9px] uppercase tracking-widest text-[#f4f4f0]/60 bg-black/80 px-2.5 py-1 border border-[#262626]">
                EXPOSURE: {activeLook.metadata}
              </div>

              {/* Prev / Next Chevrons on Image */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevLook();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-black/70 hover:bg-[#f4f4f0] text-[#f4f4f0] hover:text-[#0a0a0a] border border-[#262626] hover:border-[#f4f4f0] transition-colors font-mono text-sm uppercase tracking-widest"
                aria-label="Previous Look"
              >
                ←
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextLook();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-black/70 hover:bg-[#f4f4f0] text-[#f4f4f0] hover:text-[#0a0a0a] border border-[#262626] hover:border-[#f4f4f0] transition-colors font-mono text-sm uppercase tracking-widest"
                aria-label="Next Look"
              >
                →
              </button>
            </div>

            {/* Right: Technical Garment Notes & Runway Metadata Panel */}
            <div className="w-full lg:w-[420px] bg-[#0c0c0c] border-t lg:border-t-0 lg:border-l border-[#262626] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              
              <div>
                {/* Header with Close */}
                <div className="hidden lg:flex items-center justify-between pb-4 border-b border-[#262626] mb-6">
                  <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#f4f4f0]/60">
                    FRAME INSPECTION [0{selectedLookIndex! + 1} / 0{LOOKBOOK_ITEMS.length}]
                  </div>
                  <button
                    onClick={closeLightbox}
                    className="font-mono text-xs tracking-widest uppercase text-[#f4f4f0]/70 hover:text-white px-2 py-1 border border-transparent hover:border-[#444] transition-colors"
                  >
                    [ESC]
                  </button>
                </div>

                {/* Runway Look Identification */}
                <div className="font-mono text-xs uppercase tracking-[0.35em] text-[#f4f4f0]/60 mb-1">
                  {activeLook.lookNumber} // SS26
                </div>
                <h3 className="font-syne font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#f4f4f0] mb-4">
                  {activeLook.title}
                </h3>

                {/* Garment Notes Dossier */}
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-black/60 border border-[#262626] font-mono text-xs text-[#f4f4f0]/80 leading-relaxed">
                    <div className="text-[10px] text-[#f4f4f0]/50 uppercase tracking-widest mb-1.5 font-bold">
                      ENGINEERING SPECIFICATION:
                    </div>
                    {activeLook.garmentNotes}
                  </div>

                  {/* Technical Spec Matrix */}
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="p-3 bg-black/40 border border-[#1f1f1f]">
                      <span className="text-[#f4f4f0]/50 block text-[9px] uppercase tracking-wider">FABRIC WEIGHT</span>
                      <span className="text-[#f4f4f0] font-bold">{activeLook.gsm} GSM</span>
                    </div>
                    <div className="p-3 bg-black/40 border border-[#1f1f1f]">
                      <span className="text-[#f4f4f0]/50 block text-[9px] uppercase tracking-wider">SILHOUETTE</span>
                      <span className="text-[#f4f4f0] font-bold truncate block">{activeLook.silhouette}</span>
                    </div>
                    <div className="p-3 bg-black/40 border border-[#1f1f1f]">
                      <span className="text-[#f4f4f0]/50 block text-[9px] uppercase tracking-wider">COLORWAY</span>
                      <span className="text-[#f4f4f0] font-bold">{activeLook.colorway}</span>
                    </div>
                    <div className="p-3 bg-black/40 border border-[#1f1f1f]">
                      <span className="text-[#f4f4f0]/50 block text-[9px] uppercase tracking-wider">LOCATION</span>
                      <span className="text-[#f4f4f0] font-bold truncate block">{activeLook.sector}</span>
                    </div>
                  </div>

                  {/* Optical Exposure Data */}
                  <div className="p-3 bg-black/40 border border-[#1f1f1f] font-mono text-[10px] text-[#f4f4f0]/70 flex justify-between">
                    <span>LENS: {activeLook.focalLength}</span>
                    <span>SHUTTER: {activeLook.shutterSpeed}</span>
                    <span>APERTURE: {activeLook.aperture}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions inside Lightbox */}
              <div className="pt-6 border-t border-[#262626] space-y-3">
                {activeLook.productId && (
                  <button
                    onClick={() => {
                      playTactileClick();
                      closeLightbox();
                      onProductSelect?.(activeLook.productId!);
                      const el = document.getElementById(activeLook.productId!);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="w-full py-3.5 bg-[#f4f4f0] hover:bg-white text-[#0a0a0a] font-mono text-xs uppercase tracking-[0.25em] font-bold border border-[#f4f4f0] transition-colors flex items-center justify-center gap-2 tactile-press"
                  >
                    <span>VIEW SILHOUETTE IN ARCHIVE</span>
                    <span>→</span>
                  </button>
                )}

                {/* Modal Navigation Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={prevLook}
                    className="py-2.5 px-3 bg-black border border-[#333] hover:border-[#f4f4f0] text-[#f4f4f0] font-mono text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                  >
                    <span>← PREV LOOK</span>
                  </button>
                  <button
                    onClick={nextLook}
                    className="py-2.5 px-3 bg-black border border-[#333] hover:border-[#f4f4f0] text-[#f4f4f0] font-mono text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                  >
                    <span>NEXT LOOK →</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default LookbookGallery;
