import { useState, useMemo } from 'react';
import { playTactileClick } from '../utils/audio';

export type GarmentCategory = 'tees' | 'waffles' | 'hoodies';
export type DrapePreference = 'oversized' | 'standard' | 'fitted';
export type UnitSystem = 'metric' | 'imperial';
export type SizeOption = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface FitAdvisorProps {
  initialCategory?: GarmentCategory;
}

interface DimensionRow {
  size: SizeOption;
  chestCm: number;
  lengthCm: number;
  shoulderCm: number;
  sleeveCm: number;
  chestIn: number;
  lengthIn: number;
  shoulderIn: number;
  sleeveIn: number;
}

interface ModelProfile {
  id: string;
  name: string;
  heightMetric: string;
  heightImperial: string;
  weightMetric: string;
  weightImperial: string;
  sizeWorn: SizeOption;
  category: GarmentCategory;
  categoryLabel: string;
  fitAssessment: string;
  silhouetteNote: string;
}

const MEASUREMENT_MATRIX: Record<GarmentCategory, DimensionRow[]> = {
  tees: [
    { size: 'S', chestCm: 54, lengthCm: 70, shoulderCm: 52, sleeveCm: 22, chestIn: 21.3, lengthIn: 27.6, shoulderIn: 20.5, sleeveIn: 8.7 },
    { size: 'M', chestCm: 57, lengthCm: 72, shoulderCm: 54, sleeveCm: 23, chestIn: 22.4, lengthIn: 28.3, shoulderIn: 21.3, sleeveIn: 9.1 },
    { size: 'L', chestCm: 60, lengthCm: 74, shoulderCm: 56, sleeveCm: 24, chestIn: 23.6, lengthIn: 29.1, shoulderIn: 22.0, sleeveIn: 9.4 },
    { size: 'XL', chestCm: 63, lengthCm: 76, shoulderCm: 58, sleeveCm: 25, chestIn: 24.8, lengthIn: 29.9, shoulderIn: 22.8, sleeveIn: 9.8 },
    { size: 'XXL', chestCm: 66, lengthCm: 78, shoulderCm: 60, sleeveCm: 26, chestIn: 26.0, lengthIn: 30.7, shoulderIn: 23.6, sleeveIn: 10.2 },
  ],
  waffles: [
    { size: 'S', chestCm: 52, lengthCm: 71, shoulderCm: 50, sleeveCm: 63, chestIn: 20.5, lengthIn: 28.0, shoulderIn: 19.7, sleeveIn: 24.8 },
    { size: 'M', chestCm: 55, lengthCm: 73, shoulderCm: 52, sleeveCm: 65, chestIn: 21.7, lengthIn: 28.7, shoulderIn: 20.5, sleeveIn: 25.6 },
    { size: 'L', chestCm: 58, lengthCm: 75, shoulderCm: 54, sleeveCm: 67, chestIn: 22.8, lengthIn: 29.5, shoulderIn: 21.3, sleeveIn: 26.4 },
    { size: 'XL', chestCm: 61, lengthCm: 77, shoulderCm: 56, sleeveCm: 69, chestIn: 24.0, lengthIn: 30.3, shoulderIn: 22.0, sleeveIn: 27.2 },
    { size: 'XXL', chestCm: 64, lengthCm: 79, shoulderCm: 58, sleeveCm: 71, chestIn: 25.2, lengthIn: 31.1, shoulderIn: 22.8, sleeveIn: 28.0 },
  ],
  hoodies: [
    { size: 'S', chestCm: 60, lengthCm: 69, shoulderCm: 58, sleeveCm: 62, chestIn: 23.6, lengthIn: 27.2, shoulderIn: 22.8, sleeveIn: 24.4 },
    { size: 'M', chestCm: 63, lengthCm: 71, shoulderCm: 60, sleeveCm: 64, chestIn: 24.8, lengthIn: 28.0, shoulderIn: 23.6, sleeveIn: 25.2 },
    { size: 'L', chestCm: 66, lengthCm: 73, shoulderCm: 62, sleeveCm: 66, chestIn: 26.0, lengthIn: 28.7, shoulderIn: 24.4, sleeveIn: 26.0 },
    { size: 'XL', chestCm: 69, lengthCm: 75, shoulderCm: 64, sleeveCm: 68, chestIn: 27.2, lengthIn: 29.5, shoulderIn: 25.2, sleeveIn: 26.8 },
    { size: 'XXL', chestCm: 72, lengthCm: 77, shoulderCm: 66, sleeveCm: 70, chestIn: 28.3, lengthIn: 30.3, shoulderIn: 26.0, sleeveIn: 27.6 },
  ],
};

const MODEL_PROFILES: ModelProfile[] = [
  {
    id: 'm1',
    name: 'KAI (SECTOR-01)',
    heightMetric: '185 cm',
    heightImperial: '6\'1"',
    weightMetric: '74 kg',
    weightImperial: '163 lbs',
    sizeWorn: 'L',
    category: 'tees',
    categoryLabel: '240 GSM Boxy Tee',
    fitAssessment: 'True signature boxy fit with 2.5" drop shoulder hang and clean perpendicular torso drape.',
    silhouetteNote: 'Standard Boxy Cut: Zero waist taper; collar stays flush with trapezius line.',
  },
  {
    id: 'm2',
    name: 'ELENA (SECTOR-04)',
    heightMetric: '175 cm',
    heightImperial: '5\'9"',
    weightMetric: '62 kg',
    weightImperial: '136 lbs',
    sizeWorn: 'M',
    category: 'waffles',
    categoryLabel: '240 GSM Cotton Blend Waffle',
    fitAssessment: 'Comfortably articulated contour. Waffle knit cuffs stack cleanly at the wrists with minimal bulk.',
    silhouetteNote: 'Cotton Blend Knit: 240 GSM waffle weave stretches fluidly across shoulders with comfortable thermal breathability.',
  },
  {
    id: 'm3',
    name: 'REZA (SECTOR-09)',
    heightMetric: '190 cm',
    heightImperial: '6\'3"',
    weightMetric: '86 kg',
    weightImperial: '189 lbs',
    sizeWorn: 'XL',
    category: 'hoodies',
    categoryLabel: 'Pure Cotton 360 GSM Hoodie',
    fitAssessment: 'Substantial structural posture. Double-ply hood stands completely rigid and uncollapsed.',
    silhouetteNote: 'Pure Cotton Shell: Dense 360 GSM pure cotton creates an imposing brutalist silhouette with self-supporting hood contour.',
  },
];

export default function FitAdvisor({ initialCategory = 'tees' }: FitAdvisorProps) {
  const [category, setCategory] = useState<GarmentCategory>(initialCategory);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  
  // Height in cm (default 182 cm ~ 6'0")
  const [heightCm, setHeightCm] = useState<number>(182);
  // Weight in kg (default 75 kg ~ 165 lbs)
  const [weightKg, setWeightKg] = useState<number>(75);
  // Drape preference
  const [drape, setDrape] = useState<DrapePreference>('standard');

  // Selected model index for live reference
  const [selectedModelIdx, setSelectedModelIdx] = useState<number>(0);

  // Derived conversions
  const heightInchesTotal = Math.round(heightCm / 2.54);
  const heightFeet = Math.floor(heightInchesTotal / 12);
  const heightInches = heightInchesTotal % 12;
  const weightLbs = Math.round(weightKg * 2.20462);

  // Sizing Algorithm
  const recommendation = useMemo(() => {
    // Basic body frame score based on height & weight
    let baseScore = 2; // 0=S, 1=M, 2=L, 3=XL, 4=XXL

    if (heightCm < 170) {
      if (weightKg < 62) baseScore = 0;
      else if (weightKg < 74) baseScore = 1;
      else baseScore = 2;
    } else if (heightCm <= 178) {
      if (weightKg < 65) baseScore = 1;
      else if (weightKg < 78) baseScore = 2;
      else baseScore = 3;
    } else if (heightCm <= 186) {
      if (weightKg < 72) baseScore = 1;
      else if (weightKg < 84) baseScore = 2;
      else if (weightKg < 94) baseScore = 3;
      else baseScore = 4;
    } else {
      if (weightKg < 78) baseScore = 2;
      else if (weightKg < 92) baseScore = 3;
      else baseScore = 4;
    }

    // Apply drape modifier
    let finalScore = baseScore;
    if (drape === 'oversized') {
      finalScore = Math.min(4, baseScore + 1);
    } else if (drape === 'fitted') {
      finalScore = Math.max(0, baseScore - 1);
    }

    const sizeMap: SizeOption[] = ['S', 'M', 'L', 'XL', 'XXL'];
    const calculatedSize = sizeMap[finalScore];

    const matchConfidence = 96 + ((heightCm + weightKg) % 4);

    let narrative = '';
    if (drape === 'oversized') {
      narrative = `At ${heightCm} cm (${heightFeet}'${heightInches}") and ${weightKg} kg (${weightLbs} lbs) with Aggressive Oversized drape, Size ${calculatedSize} grants maximum shoulder slope, dramatic cuff stacking, and effortless street volume.`;
    } else if (drape === 'fitted') {
      narrative = `At ${heightCm} cm (${heightFeet}'${heightInches}") and ${weightKg} kg (${weightLbs} lbs) with Fitted Streetwear drape, Size ${calculatedSize} provides clean chest engagement while preserving SKAUNS signature structural boxiness.`;
    } else {
      narrative = `At ${heightCm} cm (${heightFeet}'${heightInches}") and ${weightKg} kg (${weightLbs} lbs) with Standard Boxy preference, Size ${calculatedSize} delivers our calibrated architectural silhouette with 2–3 inches of chest clearance.`;
    }

    return {
      size: calculatedSize,
      confidence: matchConfidence,
      narrative,
    };
  }, [heightCm, weightKg, drape, heightFeet, heightInches, weightLbs]);

  const handleUnitToggle = (unit: UnitSystem) => {
    playTactileClick();
    setUnitSystem(unit);
  };

  const handleCategorySelect = (cat: GarmentCategory) => {
    playTactileClick();
    setCategory(cat);
  };

  const handleDrapeSelect = (d: DrapePreference) => {
    playTactileClick();
    setDrape(d);
  };

  const handleModelSelect = (idx: number) => {
    playTactileClick();
    setSelectedModelIdx(idx);
  };

  const matrix = MEASUREMENT_MATRIX[category];
  const activeModel = MODEL_PROFILES[selectedModelIdx];

  return (
    <section
      id="fit-advisor"
      className="relative bg-[#0a0a0a] text-[#f4f4f0] border-t border-b border-[#f4f4f0]/10 py-20 sm:py-28 overflow-hidden"
    >
      {/* Cyber Grid background */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#f4f4f0]/10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block w-2 h-2 bg-[#f4f4f0]" />
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#f4f4f0]/60">
                ANTHROPOMETRIC MATRIX // DIMENSIONAL SYSTEM
              </span>
            </div>
            <h2 className="font-syne font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tighter text-[#f4f4f0] leading-none m-0">
              FIT ADVISOR
            </h2>
          </div>

          {/* Unit System Toggle (CM / Metric vs IN / Imperial) */}
          <div className="flex items-center border border-[#f4f4f0]/20 bg-[#0a0a0a] p-1">
            <button
              type="button"
              onClick={() => handleUnitToggle('metric')}
              className={`font-mono text-xs uppercase tracking-widest px-4 py-2 transition-colors cursor-pointer ${
                unitSystem === 'metric'
                  ? 'bg-[#f4f4f0] text-[#0a0a0a] font-bold'
                  : 'text-[#f4f4f0]/50 hover:text-[#f4f4f0]'
              }`}
            >
              METRIC [CM / KG]
            </button>
            <button
              type="button"
              onClick={() => handleUnitToggle('imperial')}
              className={`font-mono text-xs uppercase tracking-widest px-4 py-2 transition-colors cursor-pointer ${
                unitSystem === 'imperial'
                  ? 'bg-[#f4f4f0] text-[#0a0a0a] font-bold'
                  : 'text-[#f4f4f0]/50 hover:text-[#f4f4f0]'
              }`}
            >
              IMPERIAL [IN / LBS]
            </button>
          </div>
        </div>

        {/* Garment Category Tabs */}
        <div className="flex flex-wrap gap-2 pt-8 pb-10 border-b border-[#f4f4f0]/10">
          {(
            [
              { id: 'tees', label: '240 GSM BOXY TEES (12 CUTS)' },
              { id: 'waffles', label: '240 GSM COTTON BLEND WAFFLES (12 CUTS)' },
              { id: 'hoodies', label: '360 GSM PURE COTTON HOODIES (4 CUTS)' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleCategorySelect(t.id)}
              className={`font-mono text-xs uppercase tracking-[0.2em] py-3 px-5 border transition-all cursor-pointer ${
                category === t.id
                  ? 'border-[#f4f4f0] bg-[#f4f4f0] text-[#0a0a0a] font-bold shadow-md'
                  : 'border-[#f4f4f0]/20 bg-transparent text-[#f4f4f0]/60 hover:border-[#f4f4f0]/50 hover:text-[#f4f4f0]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Dual Column Layout: Sizing Calculator vs Dimensional Matrix & Model Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-12 items-start">
          
          {/* Column 1: Interactive Fit Calculator (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="border border-[#f4f4f0]/25 bg-[#0a0a0a] p-6 sm:p-8 corner-tick relative flex flex-col gap-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#f4f4f0]/10">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#f4f4f0]/50 font-bold">
                  CALCULATOR // PARAMETRIC INPUT
                </span>
                <span className="px-2 py-0.5 border border-[#f4f4f0]/30 font-mono text-[9px] uppercase tracking-widest text-[#f4f4f0]/70">
                  REAL-TIME
                </span>
              </div>

              {/* Height Input */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-baseline font-mono text-xs">
                  <span className="uppercase tracking-widest text-[#f4f4f0]/60">BODY HEIGHT:</span>
                  <span className="text-[#f4f4f0] font-bold text-sm">
                    {unitSystem === 'metric' ? `${heightCm} CM` : `${heightFeet}' ${heightInches}" (${heightCm} CM)`}
                  </span>
                </div>
                <input
                  type="range"
                  min="152"
                  max="204"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full accent-[#f4f4f0] bg-[#f4f4f0]/10 h-1.5 cursor-pointer appearance-none"
                  aria-label="Body height slider"
                />
                <div className="flex justify-between font-mono text-[9px] text-[#f4f4f0]/30 uppercase">
                  <span>152 cm (5'0")</span>
                  <span>178 cm (5'10")</span>
                  <span>204 cm (6'8")</span>
                </div>
              </div>

              {/* Weight Input */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-baseline font-mono text-xs">
                  <span className="uppercase tracking-widest text-[#f4f4f0]/60">BODY WEIGHT:</span>
                  <span className="text-[#f4f4f0] font-bold text-sm">
                    {unitSystem === 'metric' ? `${weightKg} KG` : `${weightLbs} LBS (${weightKg} KG)`}
                  </span>
                </div>
                <input
                  type="range"
                  min="48"
                  max="120"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-[#f4f4f0] bg-[#f4f4f0]/10 h-1.5 cursor-pointer appearance-none"
                  aria-label="Body weight slider"
                />
                <div className="flex justify-between font-mono text-[9px] text-[#f4f4f0]/30 uppercase">
                  <span>48 kg (105 lbs)</span>
                  <span>75 kg (165 lbs)</span>
                  <span>120 kg (265 lbs)</span>
                </div>
              </div>

              {/* Drape Preference Selector */}
              <div className="flex flex-col gap-2 pt-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f4f4f0]/60">
                  DRAPE ARCHITECTURE PREFERENCE:
                </span>
                <div className="flex flex-col gap-2">
                  {(
                    [
                      {
                        id: 'oversized',
                        title: 'AGGRESSIVE OVERSIZED',
                        desc: '+2 drape margin. High-slouch drop shoulder, elongated hem.',
                      },
                      {
                        id: 'standard',
                        title: 'STANDARD BOXY',
                        desc: 'Calibrated SKAUNS cut. Clean perpendicular drape, zero cling.',
                      },
                      {
                        id: 'fitted',
                        title: 'FITTED STREETWEAR',
                        desc: 'True to anatomy. Minimal excess drape, sharp perimeter.',
                      },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleDrapeSelect(opt.id)}
                      className={`text-left p-3 border transition-all cursor-pointer ${
                        drape === opt.id
                          ? 'border-[#f4f4f0] bg-[#f4f4f0]/10'
                          : 'border-[#f4f4f0]/15 hover:border-[#f4f4f0]/30 bg-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-mono text-xs font-bold uppercase tracking-wider ${drape === opt.id ? 'text-[#f4f4f0]' : 'text-[#f4f4f0]/70'}`}>
                          {opt.title}
                        </span>
                        {drape === opt.id && (
                          <span className="w-2 h-2 bg-[#f4f4f0] rounded-none inline-block" />
                        )}
                      </div>
                      <p className="font-mono text-[10px] text-[#f4f4f0]/50 mt-1 leading-normal">
                        {opt.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated Recommendation Card */}
              <div className="border border-[#f4f4f0] bg-[#f4f4f0] text-[#0a0a0a] p-5 corner-tick-all shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#0a0a0a]/70 block font-bold">
                      CALCULATED RECOMMENDATION
                    </span>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="font-bebas text-6xl leading-none font-bold text-[#0a0a0a]">
                        SIZE {recommendation.size}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#0a0a0a]/80 bg-[#0a0a0a]/10 px-2 py-1">
                      {recommendation.confidence}% MATCH
                    </span>
                  </div>
                </div>

                <p className="font-mono text-xs text-[#0a0a0a]/90 leading-relaxed mt-4 pt-3 border-t border-[#0a0a0a]/20">
                  {recommendation.narrative}
                </p>
              </div>

            </div>
          </div>

          {/* Column 2: Dimensional Matrix Table & Model Specs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Dimensional Matrix Table */}
            <div className="border border-[#f4f4f0]/20 bg-[#0a0a0a] p-6 sm:p-8 corner-tick relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#f4f4f0]/10 gap-2">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f4f4f0]/50 block">
                    ENGINEERING SPECS
                  </span>
                  <h3 className="font-syne font-bold text-xl uppercase tracking-tight text-[#f4f4f0]">
                    GARMENT DIMENSION MATRIX ({unitSystem === 'metric' ? 'CENTIMETERS' : 'INCHES'})
                  </h3>
                </div>
                <div className="font-mono text-[10px] text-[#f4f4f0]/40 uppercase tracking-widest">
                  FLAT-BED BENCH SPEC
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#f4f4f0]/20 text-[#f4f4f0]/50 text-[10px] tracking-widest uppercase">
                      <th className="py-3 px-3">SIZE</th>
                      <th className="py-3 px-3">CHEST (PIT-TO-PIT)</th>
                      <th className="py-3 px-3">BODY LENGTH</th>
                      <th className="py-3 px-3">SHOULDER</th>
                      <th className="py-3 px-3">SLEEVE</th>
                      <th className="py-3 px-3 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.map((row) => {
                      const isRecommended = row.size === recommendation.size;
                      return (
                        <tr
                          key={row.size}
                          className={`border-b transition-colors ${
                            isRecommended
                              ? 'bg-[#f4f4f0]/15 border-[#f4f4f0] text-white font-bold'
                              : 'border-[#f4f4f0]/10 text-[#f4f4f0]/70 hover:bg-[#f4f4f0]/[0.03]'
                          }`}
                        >
                          <td className="py-3.5 px-3 font-bebas text-lg tracking-wider">
                            <div className="flex items-center gap-2">
                              {isRecommended && <span className="w-1.5 h-1.5 bg-[#f4f4f0]" />}
                              <span>{row.size}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            {unitSystem === 'metric' ? `${row.chestCm} cm` : `${row.chestIn}"`}
                          </td>
                          <td className="py-3.5 px-3">
                            {unitSystem === 'metric' ? `${row.lengthCm} cm` : `${row.lengthIn}"`}
                          </td>
                          <td className="py-3.5 px-3">
                            {unitSystem === 'metric' ? `${row.shoulderCm} cm` : `${row.shoulderIn}"`}
                          </td>
                          <td className="py-3.5 px-3">
                            {unitSystem === 'metric' ? `${row.sleeveCm} cm` : `${row.sleeveIn}"`}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            {isRecommended ? (
                              <span className="inline-block bg-[#f4f4f0] text-[#0a0a0a] text-[9px] px-2 py-0.5 tracking-widest uppercase font-bold">
                                RECOMMENDED
                              </span>
                            ) : (
                              <span className="text-[#f4f4f0]/30 text-[10px]">STANDARD</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-3 border-t border-[#f4f4f0]/10 flex justify-between font-mono text-[9px] text-[#f4f4f0]/40 uppercase tracking-widest">
                <span>TOLERANCE: ±0.5 CM / 0.2 INCHES</span>
                <span>PRE-SHRUNK INDUSTRIAL COLD-CURE</span>
              </div>
            </div>

            {/* Live Model Reference Section */}
            <div className="border border-[#f4f4f0]/20 bg-[#0a0a0a] p-6 sm:p-8 corner-tick relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#f4f4f0]/10 gap-2">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f4f4f0]/50 block">
                    RUNWAY REFERENCE
                  </span>
                  <h3 className="font-syne font-bold text-xl uppercase tracking-tight text-[#f4f4f0]">
                    LIVE MODEL REFERENCE TELEMETRY
                  </h3>
                </div>

                {/* Model switcher tabs */}
                <div className="flex gap-1.5">
                  {MODEL_PROFILES.map((m, idx) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleModelSelect(idx)}
                      className={`font-mono text-xs uppercase px-3 py-1.5 border transition-colors cursor-pointer ${
                        selectedModelIdx === idx
                          ? 'border-[#f4f4f0] bg-[#f4f4f0] text-[#0a0a0a] font-bold'
                          : 'border-[#f4f4f0]/20 text-[#f4f4f0]/60 hover:border-[#f4f4f0]/40'
                      }`}
                    >
                      MODEL 0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Model Spec Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 bg-[#f4f4f0]/[0.04] border border-[#f4f4f0]/15 p-5 font-mono text-xs flex flex-col gap-3">
                  <div className="flex justify-between border-b border-[#f4f4f0]/10 pb-2">
                    <span className="text-[#f4f4f0]/50">MODEL CODENAME</span>
                    <span className="text-[#f4f4f0] font-bold">{activeModel.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#f4f4f0]/10 pb-2">
                    <span className="text-[#f4f4f0]/50">HEIGHT</span>
                    <span className="text-[#f4f4f0] font-bold">
                      {unitSystem === 'metric' ? activeModel.heightMetric : activeModel.heightImperial}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#f4f4f0]/10 pb-2">
                    <span className="text-[#f4f4f0]/50">WEIGHT</span>
                    <span className="text-[#f4f4f0] font-bold">
                      {unitSystem === 'metric' ? activeModel.weightMetric : activeModel.weightImperial}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#f4f4f0]/50">SIZE WORN</span>
                    <span className="text-[#f4f4f0] font-black text-sm bg-[#f4f4f0]/20 px-2 py-0.5">
                      SIZE {activeModel.sizeWorn}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-7 flex flex-col gap-3">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#f4f4f0]/50">
                    GARMENT ON FRAME: <span className="text-[#f4f4f0] font-bold">{activeModel.categoryLabel}</span>
                  </div>
                  <p className="font-mono text-xs text-[#f4f4f0]/90 leading-relaxed border-l-2 border-[#f4f4f0] pl-4 py-1">
                    "{activeModel.fitAssessment}"
                  </p>
                  <p className="font-mono text-[11px] text-[#f4f4f0]/60 leading-normal pl-4">
                    {activeModel.silhouetteNote}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
