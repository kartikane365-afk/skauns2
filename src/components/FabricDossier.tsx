import React, { useState } from 'react';
import { playTactileClick } from '../utils/audio';

export type FabricCategory = 'tees' | 'waffles' | 'hoodies';

export interface FabricDossierProps {
  onCategoryJump?: (category: FabricCategory) => void;
}

interface DensityProfile {
  category: FabricCategory;
  gsm: number;
  label: string;
  categoryName: string;
  silhouettesCount: number;
  drapeProfile: string;
  structuralResilience: number; // score out of 10
  tensileStrength: string;
  shrinkageTolerance: string;
  yarnCount: string;
  washTreatment: string;
  weaveStructure: string;
  abrasionCycles: string;
  thermalRetention: string;
  breathabilityIndex: string;
  tacticalDescription: string;
  macroWeavePoints: string[];
}

const FABRIC_PROFILES: Record<FabricCategory, DensityProfile> = {
  tees: {
    category: 'tees',
    gsm: 240,
    label: '240 GSM // BOXY TEES',
    categoryName: 'Boxy Tees',
    silhouettesCount: 12,
    drapeProfile: 'Crisp Architectural Drape — Rigid boxy cut holding zero torso cling and zero side-seam torque.',
    structuralResilience: 9.4,
    tensileStrength: '820 N Warp / 690 N Weft',
    shrinkageTolerance: '< 0.8% (Bio-Preshrunk)',
    yarnCount: '16s/1 combed',
    washTreatment: 'Carbonized bio-enzyme stone wash for ultra-soft handfeel without fiber degradation',
    weaveStructure: 'High-density 100% combed ring-spun single jersey with compacted knit pitch',
    abrasionCycles: '42,000 Martindale Cycles',
    thermalRetention: '0.18 clo (Optimized for 18°C–34°C climate mobility)',
    breathabilityIndex: '185 mm/s air permeability',
    tacticalDescription: 'Engineered for relentless daily wear. The 240 GSM weight eliminates the flimsy silhouette of conventional t-shirts, creating an architectural box cut that hangs perpendicular from the shoulder line.',
    macroWeavePoints: [
      '16s/1 heavy-gauge combed single cotton strand',
      'Compact loop density preventing fabric transparency',
      'Reinforced double-needle 1.25" rib collar prevents bacon neckline',
      'Dual-pass carbonizing wash removes micro-pilling',
    ],
  },
  waffles: {
    category: 'waffles',
    gsm: 240,
    label: '240 GSM // COTTON BLEND KNIT WAFFLES',
    categoryName: 'Cotton Blend Waffles',
    silhouettesCount: 12,
    drapeProfile: 'Adaptive Cotton Blend Knit Contour — 240 GSM tactile waffle knit structure providing breathability, thermal cushion, and anatomical drape.',
    structuralResilience: 9.6,
    tensileStrength: '940 N Warp / 810 N Weft',
    shrinkageTolerance: '< 0.6% (Thermal Fixed)',
    yarnCount: '24s/1 cotton blend knit yarn',
    washTreatment: 'Pigment cold-cure dye with distressed mineral wash for tactile micro-relief',
    weaveStructure: 'Three-dimensional micro-honeycomb cotton blend knit matrix with breathable air pockets',
    abrasionCycles: '48,000 Martindale Cycles',
    thermalRetention: '0.32 clo (Engineered for climate versatility and layering defense)',
    breathabilityIndex: '160 mm/s air permeability',
    tacticalDescription: 'Constructed from 240 GSM cotton blend knit type fabric. The geometric waffle knit texture provides tactile depth and body heat regulation while maintaining breathable air flow and effortless slouch layering.',
    macroWeavePoints: [
      '240 GSM cotton blend knit yarn engineered for structural bounce',
      'Geometric 2.5mm square honeycomb cell matrix',
      'Extended wrist cuffs with architectural thumb articulation',
      'Overlocked 4-thread flatlock seams prevent skin chafing',
    ],
  },
  hoodies: {
    category: 'hoodies',
    gsm: 360,
    label: '360 GSM // PURE COTTON HOODIES',
    categoryName: 'Pure Cotton Hoodies',
    silhouettesCount: 4,
    drapeProfile: 'Armor-Grade Pure Cotton Shell — 360 GSM dense pure cotton fleece with self-supporting hood contour and zero slouch sag.',
    structuralResilience: 9.9,
    tensileStrength: '1,120 N Warp / 940 N Weft',
    shrinkageTolerance: '< 0.4% (Steam Stabilized)',
    yarnCount: '100% Pure Combed Cotton (3-end fleece)',
    washTreatment: 'Heavy enzyme stone blast with silicone-softened water bath for impenetrable tactile handfeel',
    weaveStructure: 'Diagonal looped 3-end 100% pure cotton fleece with dense exterior face and soft interior loops',
    abrasionCycles: '60,000+ Martindale Cycles',
    thermalRetention: '0.68 clo (Windbreak fortress and thermal containment)',
    breathabilityIndex: '88 mm/s air permeability',
    tacticalDescription: 'The pinnacle of heavyweight street construction. At 360 GSM pure cotton, this fleece delivers an uncompromising architectural silhouette with an upright double-layer hood.',
    macroWeavePoints: [
      '100% pure combed cotton heavyweight yarn resists friction and snagging',
      'Coiled reverse diagonal pure cotton fleece loops for breathable warmth',
      'Double-ply constructed hood maintaining 360° architectural posture',
      'Military-grade bar-tack reinforcement at all stress anchors',
    ],
  },
};

export const FabricDossier: React.FC<FabricDossierProps> = ({ onCategoryJump }) => {
  const [activeCategory, setActiveCategory] = useState<FabricCategory>('tees');
  const profile = FABRIC_PROFILES[activeCategory];

  const handleCategorySelect = (cat: FabricCategory) => {
    playTactileClick();
    setActiveCategory(cat);
  };

  const handleJump = () => {
    playTactileClick();
    if (onCategoryJump) {
      onCategoryJump(activeCategory);
    } else {
      // Default smooth scroll to category anchor on Home page
      const el = document.getElementById(activeCategory);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section
      id="fabric-dossier"
      className="relative w-full bg-[#0a0a0a] text-[#f4f4f0] py-20 sm:py-28 px-4 sm:px-8 lg:px-12 border-b border-[#262626] overflow-hidden"
      aria-label="Fabric & GSM Engineering Dossier"
    >
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

      {/* Ghost Architectural Watermark */}
      <div
        className="absolute top-1/2 -left-20 -translate-y-1/2 font-bebas text-[22vw] leading-none text-white/[0.015] uppercase pointer-events-none select-none tracking-widest hidden lg:block"
        aria-hidden="true"
      >
        METROLOGY
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#262626]">
          <div>
            <div className="inline-flex items-center gap-3 font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#f4f4f0]/70 mb-3">
              <span className="w-2 h-2 bg-white inline-block" />
              <span>TEXTILE METROLOGY & ENGINEERING DOSSIER</span>
            </div>
            <h2 className="font-syne font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tighter text-[#f4f4f0] !mb-2">
              FABRIC LAB<span className="text-[#f4f4f0]/40">.</span>
            </h2>
            <p className="font-mono text-xs sm:text-sm text-[#f4f4f0]/60 max-w-xl uppercase tracking-wider">
              We reject paper-thin fast fashion. Every SKAUNS garment is weighted with uncompromising GSM density, calibrated for multi-year structural permanence.
            </p>
          </div>

          {/* Standards & Certifications */}
          <div className="flex flex-col sm:items-end font-mono text-[10px] sm:text-xs text-[#f4f4f0]/60 tracking-widest uppercase space-y-1">
            <div>LAB STANDARD: ISO 3801 // ASTM D3776</div>
            <div>SHRINK TOLERANCE: &lt; 1% BIO-LOCKED</div>
            <div className="text-[#f4f4f0] font-bold">CALIBRATION: 240 — 360 GSM</div>
          </div>
        </div>

        {/* ─── Density Gauge & Interactive Switcher ───────────────── */}
        <div className="py-8 sm:py-10">
          <div className="p-6 sm:p-8 bg-[#0d0d0d] border border-[#262626] corner-tick">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#202020]">
              <div>
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#f4f4f0]/50 block mb-1">
                  INTERACTIVE GSM GAUGE
                </span>
                <h3 className="font-syne font-bold text-xl sm:text-2xl text-[#f4f4f0] uppercase tracking-tight">
                  SELECT DENSITY SPECTRUM
                </h3>
              </div>

              {/* Density Tab Switcher */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {(['tees', 'waffles', 'hoodies'] as FabricCategory[]).map((cat) => {
                  const p = FABRIC_PROFILES[cat];
                  const isCurrent = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`px-4 sm:px-6 py-3 border transition-all duration-300 font-mono text-center tactile-press ${
                        isCurrent
                          ? 'bg-[#f4f4f0] text-[#0a0a0a] border-[#f4f4f0] font-bold shadow-[0_0_20px_rgba(244,244,240,0.18)]'
                          : 'bg-black text-[#f4f4f0]/70 border-[#262626] hover:border-[#f4f4f0]/60 hover:text-[#f4f4f0]'
                      }`}
                    >
                      <div className="text-lg sm:text-2xl font-bebas tracking-wider leading-none">
                        {p.gsm} GSM
                      </div>
                      <div className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-80 mt-1">
                        {p.categoryName}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Gauge Scale Bar */}
            <div className="pt-6">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#f4f4f0]/50 uppercase tracking-widest mb-2">
                <span>LIGHTWEIGHT (STANDARD: 160-180 GSM - REJECTED)</span>
                <span className="text-[#f4f4f0] font-bold">SKAUNS SPEC (240 - 360 GSM)</span>
              </div>

              {/* Metrology Bar */}
              <div className="relative h-4 w-full bg-black border border-[#262626] overflow-hidden flex">
                {/* 160-200 GSM rejected zone */}
                <div className="w-[20%] h-full bg-red-950/20 border-r border-red-900/30 relative flex items-center justify-center">
                  <span className="font-mono text-[8px] text-red-500/40 uppercase tracking-tighter">BELOW SPEC</span>
                </div>
                {/* 240 GSM Tees */}
                <div
                  onClick={() => handleCategorySelect('tees')}
                  className={`w-[26%] h-full border-r border-[#262626] cursor-pointer transition-colors ${
                    activeCategory === 'tees' ? 'bg-[#f4f4f0]' : 'bg-[#181818] hover:bg-[#222]'
                  }`}
                />
                {/* 240 GSM Waffles (Cotton Blend Knit) */}
                <div
                  onClick={() => handleCategorySelect('waffles')}
                  className={`w-[27%] h-full border-r border-[#262626] cursor-pointer transition-colors ${
                    activeCategory === 'waffles' ? 'bg-[#f4f4f0]' : 'bg-[#181818] hover:bg-[#222]'
                  }`}
                />
                {/* 360 GSM Hoodies (Pure Cotton) */}
                <div
                  onClick={() => handleCategorySelect('hoodies')}
                  className={`w-[27%] h-full cursor-pointer transition-colors ${
                    activeCategory === 'hoodies' ? 'bg-[#f4f4f0]' : 'bg-[#181818] hover:bg-[#222]'
                  }`}
                />
              </div>

              {/* Gauge markers */}
              <div className="grid grid-cols-4 text-center font-mono text-[9px] text-[#f4f4f0]/50 uppercase tracking-widest mt-2">
                <span className="text-left text-red-500/50">180 GSM // DISCARD</span>
                <span>240 GSM // TEES (COTTON)</span>
                <span>240 GSM // WAFFLES (KNIT)</span>
                <span className="text-right font-bold text-white">360 GSM // PURE COTTON HOODIES</span>
              </div>
            </div>

          </div>
        </div>

        {/* ─── Detailed Engineering Breakdown of Active Tier ───────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Big GSM Stat Card & Drape Description */}
          <div className="lg:col-span-5 bg-[#0d0d0d] border border-[#262626] p-6 sm:p-8 corner-tick">
            <div className="flex items-start justify-between mb-4">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#f4f4f0]/60">
                ACTIVE METRIC PROFILE
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest bg-white/10 px-2 py-0.5 text-white">
                {profile.silhouettesCount} CATALOG ARCHIVES
              </span>
            </div>

            <div className="font-bebas text-7xl sm:text-9xl text-[#f4f4f0] leading-none mb-2">
              {profile.gsm}
              <span className="text-3xl sm:text-4xl text-[#f4f4f0]/40 ml-2 font-mono">GSM</span>
            </div>

            <h3 className="font-syne font-bold text-2xl text-[#f4f4f0] uppercase tracking-tight mb-4">
              {profile.categoryName}
            </h3>

            <p className="font-mono text-xs sm:text-sm text-[#f4f4f0]/80 leading-relaxed mb-6 p-4 bg-black/60 border border-[#202020]">
              {profile.tacticalDescription}
            </p>

            {/* Drape Profile Quote */}
            <div className="mb-6 p-4 border-l-2 border-[#f4f4f0] bg-white/[0.02]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#f4f4f0]/50 block mb-1">
                KINETIC DRAPE SIGNATURE:
              </span>
              <p className="font-mono text-xs text-[#f4f4f0] leading-relaxed">
                "{profile.drapeProfile}"
              </p>
            </div>

            {/* Structural Resilience Rating Meter */}
            <div className="p-4 bg-black/50 border border-[#202020] mb-6">
              <div className="flex justify-between items-center font-mono text-xs uppercase tracking-widest mb-2">
                <span className="text-[#f4f4f0]/60">STRUCTURAL RESILIENCE INDEX</span>
                <span className="text-[#f4f4f0] font-bold">{profile.structuralResilience} / 10</span>
              </div>
              <div className="w-full h-2 bg-black border border-[#333] overflow-hidden">
                <div
                  className="h-full bg-[#f4f4f0] transition-all duration-700 ease-out"
                  style={{ width: `${(profile.structuralResilience / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Actionable Category Jump Button */}
            <button
              onClick={handleJump}
              className="w-full py-4 bg-[#f4f4f0] hover:bg-white text-[#0a0a0a] font-mono text-xs sm:text-sm uppercase tracking-[0.25em] font-bold border border-[#f4f4f0] transition-all duration-300 flex items-center justify-center gap-3 tactile-press shadow-[0_0_20px_rgba(244,244,240,0.1)]"
            >
              <span>INSPECT {profile.categoryName.toUpperCase()} ARCHIVE ({profile.silhouettesCount} UNITS)</span>
              <span className="text-base font-bold">→</span>
            </button>
          </div>

          {/* Right Column: Lab Specs & Macro Weave Architecture */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Lab Specs Grid */}
            <div className="bg-[#0d0d0d] border border-[#262626] p-6 sm:p-8 corner-tick">
              <div className="flex items-center justify-between pb-4 border-b border-[#202020] mb-6">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#f4f4f0]/70 font-bold">
                  OFFICIAL LABORATORY CERTIFICATION
                </span>
                <span className="font-mono text-[10px] text-[#f4f4f0]/40 uppercase tracking-widest">
                  DOC ID: SKN-FAB-2026
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                
                <div className="p-4 bg-black/60 border border-[#202020]">
                  <span className="text-[10px] text-[#f4f4f0]/50 uppercase tracking-widest block mb-1">
                    TENSILE STRENGTH INDEX
                  </span>
                  <span className="text-sm text-[#f4f4f0] font-bold">
                    {profile.tensileStrength}
                  </span>
                </div>

                <div className="p-4 bg-black/60 border border-[#202020]">
                  <span className="text-[10px] text-[#f4f4f0]/50 uppercase tracking-widest block mb-1">
                    SHRINKAGE TOLERANCE
                  </span>
                  <span className="text-sm text-emerald-400 font-bold">
                    {profile.shrinkageTolerance}
                  </span>
                </div>

                <div className="p-4 bg-black/60 border border-[#202020]">
                  <span className="text-[10px] text-[#f4f4f0]/50 uppercase tracking-widest block mb-1">
                    YARN COUNT & PLY
                  </span>
                  <span className="text-sm text-[#f4f4f0] font-bold">
                    {profile.yarnCount}
                  </span>
                </div>

                <div className="p-4 bg-black/60 border border-[#202020]">
                  <span className="text-[10px] text-[#f4f4f0]/50 uppercase tracking-widest block mb-1">
                    MARTINDALE ABRASION
                  </span>
                  <span className="text-sm text-[#f4f4f0] font-bold">
                    {profile.abrasionCycles}
                  </span>
                </div>

                <div className="p-4 bg-black/60 border border-[#202020]">
                  <span className="text-[10px] text-[#f4f4f0]/50 uppercase tracking-widest block mb-1">
                    THERMAL RESISTANCE (CLO)
                  </span>
                  <span className="text-sm text-[#f4f4f0] font-bold">
                    {profile.thermalRetention}
                  </span>
                </div>

                <div className="p-4 bg-black/60 border border-[#202020]">
                  <span className="text-[10px] text-[#f4f4f0]/50 uppercase tracking-widest block mb-1">
                    AIR PERMEABILITY
                  </span>
                  <span className="text-sm text-[#f4f4f0] font-bold">
                    {profile.breathabilityIndex}
                  </span>
                </div>

              </div>

              {/* Wash Treatment Specification */}
              <div className="mt-4 p-4 bg-black/60 border border-[#202020] font-mono text-xs">
                <span className="text-[10px] text-[#f4f4f0]/50 uppercase tracking-widest block mb-1">
                  TACTILE WASH TREATMENT
                </span>
                <p className="text-[#f4f4f0]/90 leading-relaxed">
                  {profile.washTreatment}
                </p>
              </div>
            </div>

            {/* Macro Weave Architecture */}
            <div className="bg-[#0d0d0d] border border-[#262626] p-6 sm:p-8 corner-tick">
              <div className="flex items-center justify-between pb-4 border-b border-[#202020] mb-4">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#f4f4f0]/70 font-bold">
                  MACRO WEAVE TOPOLOGY
                </span>
                <span className="font-mono text-[10px] text-[#f4f4f0]/40 uppercase tracking-widest">
                  COMPACTION ANALYSIS
                </span>
              </div>

              <p className="font-mono text-xs text-[#f4f4f0]/70 leading-relaxed mb-4">
                STRUCTURE: <span className="text-[#f4f4f0] font-bold">{profile.weaveStructure}</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.macroWeavePoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-black/40 border border-[#1f1f1f] flex items-start gap-3 font-mono text-xs text-[#f4f4f0]/80"
                  >
                    <span className="text-[#f4f4f0] font-bold">[{idx + 1}]</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default FabricDossier;
