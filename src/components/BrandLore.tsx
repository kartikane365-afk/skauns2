import React, { useState } from 'react';
import { playTactileClick } from '../utils/audio';

type LoreTab = 'manifesto' | 'tenets' | 'protocol';

interface Tenet {
  number: string;
  code: string;
  title: string;
  subtitle: string;
  content: string;
  metric: string;
  metricLabel: string;
}

const SYNDICATE_TENETS: Tenet[] = [
  {
    number: '01',
    code: 'SEC-01-ARMOR',
    title: 'ARMOR OVER APPAREL',
    subtitle: 'WEARABLE ARCHITECTURAL FORTRESS',
    content: 'We do not build flimsy shirts for fleeting seasons. We forge wearable armor that protects the wearer from environmental noise and algorithmic homogenization. A silhouette that defines physical space instead of submitting to it.',
    metric: '360 GSM',
    metricLabel: 'PEAK PURE COTTON DENSITY',
  },
  {
    number: '02',
    code: 'SEC-02-DENSITY',
    title: 'THE DENSITY THRESHOLD',
    subtitle: 'RADICAL HEAVYWEIGHT PERMANENCE',
    content: 'Standard retail brands peddle 140–180 GSM polyester-cotton blends engineered to degrade in three washes. SKAUNS draws the lower limit strictly at 240 GSM for boxy tees & cotton blend waffles, and 360 GSM pure cotton for hoodies. Heavyweight mass creates kinetic presence.',
    metric: '< 1%',
    metricLabel: 'MAX RESIDUAL SHRINKAGE',
  },
  {
    number: '03',
    code: 'SEC-03-SIGILISM',
    title: 'SUBVERSIVE CEREMONIAL SIGILISM',
    subtitle: 'GOTHIC NEEDLEPOINT & CYBER SCRIPT',
    content: 'Our graphics are not disposable pop-culture memes. They are neo-tribal totems, cathedral spires, and biomechanical spines drawn from medieval liturgical manuscripts and cybernetic lore. Inscribed in high-density raised inks that endure.',
    metric: '100% INK',
    metricLabel: 'CRACK-RESISTANT SCREEN PRINT',
  },
  {
    number: '04',
    code: 'SEC-04-MONOLITH',
    title: 'THE BRUTALIST MONOLITH',
    subtitle: 'RADICAL DROPPED BOX GEOMETRY',
    content: 'A brutalist garment must hold its own shape even when hung on a nail. Cut with an exaggerated drop-shoulder and wide box torso, our patterns eliminate torso twisting and cling, creating an uncompromising monolithic posture.',
    metric: '1.25 IN',
    metricLabel: 'HEAVY RIB REINFORCED COLLAR',
  },
];

export const BrandLore: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LoreTab>('manifesto');

  const handleTabChange = (tab: LoreTab) => {
    playTactileClick();
    setActiveTab(tab);
  };

  return (
    <section
      id="brand-lore"
      className="relative w-full bg-[#0a0a0a] text-[#f4f4f0] py-20 sm:py-28 px-4 sm:px-8 lg:px-12 border-b border-[#262626] overflow-hidden"
      aria-label="SKAUNS Syndicate Brand Lore and Manifesto"
    >
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      {/* Ghost Architectural Watermarks */}
      <div
        className="absolute -top-16 -left-12 font-bebas text-[20vw] leading-none text-white/[0.015] uppercase pointer-events-none select-none tracking-widest hidden md:block"
        aria-hidden="true"
      >
        DOCTRINE
      </div>
      <div
        className="absolute -bottom-16 -right-12 font-bebas text-[20vw] leading-none text-white/[0.015] uppercase pointer-events-none select-none tracking-widest hidden md:block"
        aria-hidden="true"
      >
        SYNDICATE
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">

        {/* Tactical Header Coordinates HUD */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#262626] font-mono text-[10px] sm:text-xs text-[#f4f4f0]/60 tracking-widest uppercase">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#f4f4f0] inline-block animate-ping" />
            <span>COORD: 34.0522° N, 118.2437° W // SECTOR-09</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[#f4f4f0]/40">
            <span>SYS_BUILD: 2026.04.V3</span>
            <span>CIPHER: SHA-256 ENCRYPTED</span>
            <span className="text-[#f4f4f0] font-bold">STATUS: MONOLITH OPERATIONAL</span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[#262626]">
          <div>
            <div className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#f4f4f0]/70 mb-3">
              <span className="w-2 h-2 bg-[#f4f4f0] inline-block" />
              <span>THE ARCHITECTURAL GARMENT DOCTRINE</span>
            </div>
            <h2 className="font-syne font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tighter text-[#f4f4f0] !mb-2">
              SYNDICATE LORE<span className="text-[#f4f4f0]/40">.</span>
            </h2>
            <p className="font-mono text-xs sm:text-sm text-[#f4f4f0]/60 max-w-xl uppercase tracking-wider">
              An underground manifesto forged in opposition to fast-fashion obsolescence. Discover the doctrine behind the SKAUNS brutalist identity.
            </p>
          </div>

          {/* Interactive Doctrine Tab Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'manifesto', label: 'MANIFESTO' },
              { id: 'tenets', label: 'FOUR TENETS' },
              { id: 'protocol', label: 'OPERATIONAL PROTOCOL' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as LoreTab)}
                  className={`font-mono text-xs uppercase tracking-[0.2em] px-4 py-2.5 border transition-all duration-300 tactile-press ${
                    isActive
                      ? 'bg-[#f4f4f0] text-[#0a0a0a] border-[#f4f4f0] font-bold shadow-[0_0_15px_rgba(244,244,240,0.18)]'
                      : 'bg-black text-[#f4f4f0]/70 border-[#262626] hover:border-[#f4f4f0]/60 hover:text-[#f4f4f0]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Tab Content 1: MANIFESTO ───────────────────────────── */}
        {activeTab === 'manifesto' && (
          <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            {/* Left Big Lead Quote */}
            <div className="lg:col-span-5 bg-[#0d0d0d] border border-[#262626] p-6 sm:p-10 corner-tick">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f4f4f0]/50 block mb-3">
                DOCTRINE PROCLAMATION // 01
              </span>
              <h3 className="font-syne font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#f4f4f0] leading-[0.95] mb-6">
                WE BUILD ARMOR, NOT DISPOSABLE TRENDS.
              </h3>
              <p className="font-mono text-xs sm:text-sm text-[#f4f4f0]/80 leading-relaxed mb-6">
                The global garment industry is designed to decay. Lightweight synthetics, fragile seams, and seasonal cycles that exploit human labor to fill landfills. SKAUNS exists as an intentional counter-system.
              </p>
              <div className="p-4 bg-black/60 border border-[#202020] font-mono text-xs text-[#f4f4f0]/90">
                <span className="text-[#f4f4f0]/40 block text-[9px] uppercase tracking-widest mb-1">
                  CORE DIRECTIVE
                </span>
                "When everything in the modern world is designed to dissolve, heavyweight density is the purest form of protest."
              </div>
            </div>

            {/* Right Detailed Narrative Columns */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-[#0d0d0d] border border-[#262626] p-6 sm:p-8 corner-tick">
                <h4 className="font-syne font-bold text-xl uppercase tracking-tight text-[#f4f4f0] mb-3 flex items-center justify-between">
                  <span>THE ORIGIN OF SKAUNS</span>
                  <span className="font-mono text-xs text-[#f4f4f0]/40">[ARCHIVE 001]</span>
                </h4>
                <p className="font-mono text-xs sm:text-sm text-[#f4f4f0]/80 leading-relaxed mb-4">
                  Born in the concrete alleys and subterranean sub-levels, SKAUNS was conceived by an anonymous collective of textile engineers, industrial designers, and underground musicians. We observed streetwear devolve into branded plastic merchandise and decided to construct an unyielding architectural alternative.
                </p>
                <p className="font-mono text-xs sm:text-sm text-[#f4f4f0]/80 leading-relaxed">
                  Every silhouette begins with the raw yarn: high-twist combed cotton, custom 240 GSM cotton blend waffle knits, and 360 GSM pure cotton fleece spun to maximum compact density. The result is clothing with undeniable physical gravitas.
                </p>
              </div>

              {/* 3 Numerical Axioms */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-[#0d0d0d] border border-[#262626] font-mono">
                  <div className="font-bebas text-4xl text-[#f4f4f0] mb-1">01 / DENSITY</div>
                  <p className="text-[11px] text-[#f4f4f0]/70 leading-relaxed">
                    240 GSM tees & waffles to 360 GSM pure cotton fleece. Massive tactile weight that refuses to distort.
                  </p>
                </div>
                <div className="p-5 bg-[#0d0d0d] border border-[#262626] font-mono">
                  <div className="font-bebas text-4xl text-[#f4f4f0] mb-1">02 / HONEST</div>
                  <p className="text-[11px] text-[#f4f4f0]/70 leading-relaxed">
                    Transparent pricing from ₹1,099 to ₹1,499 across all drops. Zero artificial hype markups.
                  </p>
                </div>
                <div className="p-5 bg-[#0d0d0d] border border-[#262626] font-mono">
                  <div className="font-bebas text-4xl text-[#f4f4f0] mb-1">03 / CODE</div>
                  <p className="text-[11px] text-[#f4f4f0]/70 leading-relaxed">
                    Pitch-black and raw bone ecru. Built to survive seasons, fads, and decades.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Tab Content 2: FOUR TENETS ─────────────────────────── */}
        {activeTab === 'tenets' && (
          <div className="py-12 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {SYNDICATE_TENETS.map((tenet) => (
                <div
                  key={tenet.number}
                  className="bg-[#0d0d0d] border border-[#262626] p-6 sm:p-8 corner-tick flex flex-col justify-between group hover:border-[#f4f4f0] transition-colors duration-500"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="font-bebas text-5xl sm:text-6xl text-[#f4f4f0]/30 group-hover:text-[#f4f4f0] transition-colors leading-none">
                        TENET {tenet.number}
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#f4f4f0]/40 px-2 py-1 bg-black border border-[#202020]">
                        {tenet.code}
                      </span>
                    </div>

                    <h3 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-[#f4f4f0] mb-1">
                      {tenet.title}
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#f4f4f0]/50 mb-4">
                      {tenet.subtitle}
                    </p>

                    <p className="font-mono text-xs sm:text-sm text-[#f4f4f0]/80 leading-relaxed mb-6">
                      {tenet.content}
                    </p>
                  </div>

                  {/* Footer Metric Badge */}
                  <div className="pt-4 border-t border-[#202020] flex items-center justify-between font-mono">
                    <span className="text-[10px] text-[#f4f4f0]/50 uppercase tracking-wider">
                      {tenet.metricLabel}
                    </span>
                    <span className="text-sm sm:text-base text-[#f4f4f0] font-bold">
                      {tenet.metric}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Tab Content 3: OPERATIONAL PROTOCOL ─────────────────── */}
        {activeTab === 'protocol' && (
          <div className="py-12 space-y-8 animate-fade-in">
            <div className="bg-[#0d0d0d] border border-[#262626] p-6 sm:p-10 corner-tick">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f4f4f0]/50 block mb-2">
                STANDARD OPERATING PROCEDURE
              </span>
              <h3 className="font-syne font-black text-2xl sm:text-4xl uppercase tracking-tight text-[#f4f4f0] mb-6">
                THE 5-POINT GARMENT CARE DIRECTIVE
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
                
                <div className="p-4 bg-black/60 border border-[#202020]">
                  <div className="text-sm font-bold text-[#f4f4f0] mb-1">01 // COLD WASH ONLY</div>
                  <p className="text-[#f4f4f0]/70 leading-relaxed">
                    Always wash garments inside-out in cold water (max 30°C). Preserves screenprint lacquer and prevents fiber stress.
                  </p>
                </div>

                <div className="p-4 bg-black/60 border border-[#202020]">
                  <div className="text-sm font-bold text-[#f4f4f0] mb-1">02 // NO MACHINE DRYER</div>
                  <p className="text-[#f4f4f0]/70 leading-relaxed">
                    Hang dry in ambient shade. High-heat tumblers shrink natural cotton and warp drop-shoulder seams.
                  </p>
                </div>

                <div className="p-4 bg-black/60 border border-[#202020]">
                  <div className="text-sm font-bold text-[#f4f4f0] mb-1">03 // EMBRACE NATURAL WEAR</div>
                  <p className="text-[#f4f4f0]/70 leading-relaxed">
                    Do not obsess over crisp ironing. Let heavy cotton settle into your body geometry with natural organic drape.
                  </p>
                </div>

                <div className="p-4 bg-black/60 border border-[#202020]">
                  <div className="text-sm font-bold text-[#f4f4f0] mb-1">04 // ZERO BLEACH AGENTS</div>
                  <p className="text-[#f4f4f0]/70 leading-relaxed">
                    Unbleached ecru bone contains natural cotton seed flecks. Chlorine bleaches compromise fiber strength.
                  </p>
                </div>

                <div className="p-4 bg-black/60 border border-[#202020]">
                  <div className="text-sm font-bold text-[#f4f4f0] mb-1">05 // WEAR UNTIL EXTINCTION</div>
                  <p className="text-[#f4f4f0]/70 leading-relaxed">
                    SKAUNS garments look superior with age, distressed edges, and faded ink patina. Built for multi-year durability.
                  </p>
                </div>

                <div className="p-4 bg-black/60 border border-[#202020] flex flex-col justify-between">
                  <div>
                    <div className="text-sm font-bold text-emerald-400 mb-1">SYNDICATE PACT</div>
                    <p className="text-[#f4f4f0]/70 leading-relaxed">
                      Every piece is numbered in limited batch allocations to prevent speculative deadstock.
                    </p>
                  </div>
                  <span className="text-[10px] text-[#f4f4f0]/40 mt-2 block uppercase">
                    SEAL OF VERIFICATION // ACTIVE
                  </span>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Section Footer Banner */}
        <div className="pt-8 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] sm:text-xs text-[#f4f4f0]/50 uppercase tracking-widest">
          <div>SKAUNS HIGH-FASHION BRUTALISM // ZERO COMPROMISE</div>
          <div>REGISTERED TRADEMARK // MONOLITH DIVISION</div>
        </div>

      </div>
    </section>
  );
};

export default BrandLore;
