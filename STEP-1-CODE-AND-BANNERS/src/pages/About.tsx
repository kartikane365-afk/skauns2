import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-white text-dark min-h-screen pt-28 sm:pt-36 pb-24 relative overflow-hidden">
      {/* Ghost background watermark */}
      <div className="absolute top-20 right-0 pointer-events-none select-none overflow-hidden">
        <span className="font-bebas text-[28vw] text-black/[0.02] leading-none whitespace-nowrap block">
          SYNDICATE
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-dark/40 mb-8">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <span className="text-black font-bold">Manifesto & Origin</span>
        </div>

        {/* Hero Section */}
        <section className="mb-20 sm:mb-28">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-[1.5px] bg-black" />
            <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.35em] text-dark/40">
              Syndicate Doctrine // 01
            </p>
          </div>

          <h1 className="font-syne font-black text-4xl sm:text-7xl lg:text-8xl uppercase tracking-tighter text-dark leading-[0.95] mb-8">
            Armor for the <br />
            <span className="text-black/30">Unconquered.</span>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-black/[0.08] pt-8">
            <div className="lg:col-span-7">
              <p className="font-mono text-sm sm:text-lg text-dark/80 leading-relaxed font-medium">
                SKAUNS is an independent architectural streetwear syndicate. We reject the ephemeral noise of fast-fashion trend cycles. Every garment we build is engineered as tactile armor — heavy, boxy, unapologetic, and cut for those who navigate the world on their own frequencies.
              </p>
            </div>
            <div className="lg:col-span-5 bg-[#fafafa] border border-black/10 p-6 sm:p-7 font-mono text-xs text-dark/70 space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-dark/40 font-bold">// SPECIFICATION STANDARDS</p>
              <div className="flex justify-between border-b border-black/5 pb-1">
                <span>Weight Class:</span>
                <span className="font-bold text-dark">240 – 360 GSM</span>
              </div>
              <div className="flex justify-between border-b border-black/5 pb-1">
                <span>Cotton Grade:</span>
                <span className="font-bold text-dark">100% Combed Compact</span>
              </div>
              <div className="flex justify-between border-b border-black/5 pb-1">
                <span>Silhouette Drape:</span>
                <span className="font-bold text-dark">Boxy Drop-Shoulder</span>
              </div>
              <div className="flex justify-between">
                <span>Run Policy:</span>
                <span className="font-bold text-dark">Zero Reprints. Strictly Limited.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars / Core Tenets */}
        <section className="mb-24 sm:mb-32">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-black/20" />
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-dark/40">
              The Three Pillars
            </p>
          </div>
          <h2 className="font-syne font-black text-3xl sm:text-5xl uppercase tracking-tight text-dark mb-12">
            Engineering Code
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                idx: '01',
                title: 'Tactile Density',
                desc: 'We construct garments using custom high-density knit combed cotton ranging from 240 GSM for boxy tees and cotton blend knit waffles to 360 GSM for pure cotton heavyweight hoodies. You feel the physical weight the moment it rests on your shoulders.',
                tag: '240-360 GSM',
              },
              {
                idx: '02',
                title: 'Brutalist Architecture',
                desc: 'Patterned with exaggerated dropped shoulders, wide sleeves that drape naturally over the elbow, and cropped-yet-boxy hems designed to fall cleanly without collapsing into your waist.',
                tag: 'Boxy Silhouette',
              },
              {
                idx: '03',
                title: 'Permanent Archive',
                desc: 'We operate strictly on finite capsule drops. Each print is executed with high-pigment water-based discharge inks that age with the fabric rather than cracking or peeling. Once archived, the vault stays sealed.',
                tag: 'Finite Drops',
              },
            ].map((pillar) => (
              <div
                key={pillar.idx}
                className="bg-[#fafafa] border border-black/10 p-8 sm:p-10 hover:border-black/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-mono text-xs font-bold text-black border border-black px-2 py-0.5">
                      {pillar.tag}
                    </span>
                    <span className="font-bebas text-4xl text-black/15 group-hover:text-black/40 transition-colors">
                      {pillar.idx}
                    </span>
                  </div>
                  <h3 className="font-syne font-black text-xl uppercase tracking-tight text-dark mb-3">
                    {pillar.title}
                  </h3>
                  <p className="font-mono text-xs sm:text-[13px] text-dark/60 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-black/5 flex items-center gap-2 font-mono text-[10px] text-dark/30 tracking-widest uppercase">
                  <span>✦ SKAUNS STANDARD</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-24 sm:mb-32 border-t border-black/[0.08] pt-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-black/20" />
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-dark/40">
              Syndicate Chronology
            </p>
          </div>
          <h2 className="font-syne font-black text-3xl sm:text-5xl uppercase tracking-tight text-dark mb-12">
            Archive History
          </h2>

          <div className="space-y-8 max-w-4xl">
            {[
              {
                year: '2024',
                label: 'PHASE 0 // GENESIS',
                title: 'Underground Atelier Formation',
                desc: 'Launched in silence. 3 silhouette mockups, 50 units each, distributed hand-to-hand among underground creatives and dark aesthetics collectors.',
              },
              {
                year: '2025',
                label: 'PHASE 1 // EXPANSION',
                title: 'Cyber-Gothic Codex Release',
                desc: 'Unveiled the Neo-Tribal and Cybersigil collections. Drops sold out within minutes of transmission. Built our proprietary 240 GSM boxy pattern block.',
              },
              {
                year: '2026',
                label: 'PHASE 2 // SS26 SYNDICATE',
                title: 'The Cathedral & Reaper Drop',
                desc: 'Our latest and most uncompromising drop: 31 architectural silhouettes (12 Boxy Tees, 15 Cotton Blend Knit Waffles, 4 Pure Cotton Hoodies) featuring gothic archangels, twin tiger yinyang, bio-spines, and sacred thorn typography.',
              },
            ].map((event) => (
              <div
                key={event.year}
                className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4 sm:gap-8 items-start p-6 bg-[#fafafa] border border-black/10 hover:border-black/30 transition-colors"
              >
                <div>
                  <span className="font-anton text-4xl sm:text-5xl text-dark tracking-tight block">
                    {event.year}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-dark/40 block mt-1">
                    {event.label}
                  </span>
                </div>
                <div className="border-t sm:border-t-0 sm:border-l border-black/10 pt-4 sm:pt-0 sm:pl-6">
                  <h3 className="font-syne font-bold text-base sm:text-lg uppercase text-dark mb-2">
                    {event.title}
                  </h3>
                  <p className="font-mono text-xs sm:text-[13px] text-dark/60 leading-relaxed">
                    {event.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Care & Maintenance Doctrine */}
        <section className="mb-24 sm:mb-32 bg-[#fafafa] border border-black/15 p-8 sm:p-14">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-dark/40 mb-2">
              // Garment Longevity
            </p>
            <h2 className="font-syne font-black text-2xl sm:text-4xl uppercase tracking-tight text-dark mb-6">
              Care & Longevity Protocol
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs text-dark/70">
              <div className="border-l-2 border-black pl-4 py-1">
                <p className="font-bold text-dark uppercase mb-1">Cold Wash Only (30°C)</p>
                <p>Always turn garment inside-out before machine washing to protect graphics and texture.</p>
              </div>
              <div className="border-l-2 border-black pl-4 py-1">
                <p className="font-bold text-dark uppercase mb-1">Hang Dry in Shade</p>
                <p>Never tumble dry high. Ambient shade air drying preserves the heavy cotton structure and silhouette drape.</p>
              </div>
              <div className="border-l-2 border-black pl-4 py-1">
                <p className="font-bold text-dark uppercase mb-1">Zero Bleach & Harsh Agents</p>
                <p>Use mild neutral detergents to maintain the pitch-black and raw-bone fiber depth.</p>
              </div>
              <div className="border-l-2 border-black pl-4 py-1">
                <p className="font-bold text-dark uppercase mb-1">Reverse Ironing</p>
                <p>If pressing, always iron on reverse side on low-to-medium heat. Never directly touch printed areas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="text-center py-16 border-t border-black/10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-dark/40 mb-3">
            SS26 Syndicate Archive Open
          </p>
          <h2 className="font-syne font-black text-3xl sm:text-5xl uppercase tracking-tight text-dark mb-8">
            Claim Your Armor Today
          </h2>
          <Link
            to="/collection"
            className="inline-block bg-black text-white px-10 py-4 font-mono text-xs uppercase tracking-[0.25em] font-bold hover:bg-black/85 transition-colors shadow-lg"
          >
            Explore The 31 Silhouettes →
          </Link>
        </section>
      </div>
    </div>
  );
}
