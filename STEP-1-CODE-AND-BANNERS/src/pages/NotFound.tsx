import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  const [anomalyId] = useState(() => Math.floor(Math.random() * 90000 + 10000));

  return (
    <div className="bg-white text-dark min-h-screen flex items-center justify-center px-6 py-32 relative overflow-hidden">
      {/* Ghost Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-bebas text-[35vw] text-black/[0.03] leading-none">
          404
        </span>
      </div>

      <div className="max-w-xl w-full text-center relative z-10">
        <div className="inline-flex items-center gap-2 border border-black/15 bg-[#fafafa] px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-dark/50 mb-6">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          Sector Breach // Frequency 404
        </div>

        <h1 className="font-anton text-6xl sm:text-8xl md:text-9xl uppercase tracking-tight text-dark leading-none mb-6">
          Void Not<br />
          <span className="text-black/30">Found.</span>
        </h1>

        <p className="font-mono text-xs sm:text-sm text-dark/60 leading-relaxed max-w-md mx-auto mb-10">
          The requested coordinate has been redacted from the SKAUNS syndicate archive. Return to authorized sectors or inspect the current drop.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center font-mono text-xs uppercase tracking-[0.2em]">
          <Link
            to="/"
            className="w-full sm:w-auto bg-black text-white px-8 py-4 font-bold hover:bg-black/85 transition-colors shadow-md"
          >
            ← Return to Base
          </Link>
          <Link
            to="/collection"
            className="w-full sm:w-auto border border-black text-dark px-8 py-4 font-bold hover:bg-black/5 transition-colors"
          >
            Inspect Collection
          </Link>
        </div>

        <div className="mt-16 pt-8 border-t border-black/10 font-mono text-[10px] text-dark/30 tracking-widest uppercase">
          SKAUNS PROTOCOL // ANOMALY LOGGED // ID #{anomalyId}
        </div>
      </div>
    </div>
  );
}
