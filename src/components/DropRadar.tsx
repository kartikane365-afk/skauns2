import { useState, useEffect, useId, type FormEvent } from 'react';
import { playTactileClick, playCipherBeep } from '../utils/audio';
import { dispatchMemberJoinedToAdmin } from '../services/adminDispatcher';

export interface DropRadarProps {
  targetDate?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export default function DropRadar({ targetDate }: DropRadarProps) {
  const emailInputId = useId();
  const phoneInputId = useId();

  // Resolve target timestamp (default to 6 days, 14 hours, 28 minutes from first mount if none given or expired)
  const [targetTimestamp] = useState<number>(() => {
    if (targetDate) {
      const parsed = new Date(targetDate).getTime();
      if (!isNaN(parsed) && parsed > Date.now()) {
        return parsed;
      }
    }
    // Default: exactly 6 days, 14 hours, 32 minutes, 15 seconds from now
    return Date.now() + (6 * 86400 + 14 * 3600 + 32 * 60 + 15) * 1000;
  });

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const diff = Math.max(0, targetTimestamp - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, totalMs: diff });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  // RSVP Modal State
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [rsvpChannel, setRsvpChannel] = useState<'email' | 'phone'>('email');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpSilhouette, setRsvpSilhouette] = useState<'all' | 'tees' | 'waffles' | 'hoodies'>('all');
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState<{ code: string; queueNum: number } | null>(null);
  const [formError, setFormError] = useState('');

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isRsvpOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isRsvpOpen]);

  const handleOpenRsvp = () => {
    playTactileClick();
    setFormError('');
    setRsvpSuccess(null);
    setIsRsvpOpen(true);
  };

  const handleCloseRsvp = () => {
    playTactileClick();
    setIsRsvpOpen(false);
  };

  const handleSubmitRsvp = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (rsvpChannel === 'email') {
      if (!rsvpEmail.trim() || !rsvpEmail.includes('@') || !rsvpEmail.includes('.')) {
        setFormError('INVALID TELEMETRY: PLEASE SPECIFY A VALID EMAIL ADDRESS.');
        playTactileClick();
        return;
      }
    } else {
      const cleaned = rsvpPhone.replace(/\D/g, '');
      if (cleaned.length < 8) {
        setFormError('INVALID SIGNAL: ENTER AT LEAST 8 DIGITS FOR PHONE/SIGNAL.');
        playTactileClick();
        return;
      }
    }

    setRsvpSubmitting(true);
    playTactileClick();

    const targetContact = rsvpChannel === 'email' ? rsvpEmail.trim() : rsvpPhone.trim();
    void dispatchMemberJoinedToAdmin(targetContact, rsvpChannel, 'Drop Radar Sector VIP Access');

    setTimeout(() => {
      setRsvpSubmitting(false);
      const generatedCode = 'SKN-SS26-' + Math.random().toString(36).substring(2, 7).toUpperCase();
      const queueNumber = Math.floor(Math.random() * 80) + 1;
      setRsvpSuccess({ code: generatedCode, queueNum: queueNumber });
      playCipherBeep();
    }, 650);
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  // Vault allocation metrics
  const totalAllocation = 1000;
  const claimedAllocation = 824;
  const depletionPct = Math.round((claimedAllocation / totalAllocation) * 100);

  return (
    <section
      id="drop-radar"
      className="relative bg-[#0a0a0a] text-[#f4f4f0] border-t border-b border-[#f4f4f0]/10 overflow-hidden py-20 sm:py-28"
    >
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      {/* Ambient scanning line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#f4f4f0]/40 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 relative z-10">
        {/* Section Header with Tactical Telemetry */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#f4f4f0]/10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block w-2 h-2 bg-[#f4f4f0] rounded-none animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#f4f4f0]/60">
                ACTIVE RADAR PROTOCOL // SS26 CAMPAIGN PHASE 02
              </span>
            </div>
            <h2 className="font-syne font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tighter text-[#f4f4f0] leading-none m-0">
              DROP RADAR
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-right">
            <div className="border border-[#f4f4f0]/20 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#f4f4f0]/80 bg-[#f4f4f0]/[0.02]">
              SIGNAL: <span className="text-white font-bold">LOCKED (0.04 MS)</span>
            </div>
            <div className="border border-[#f4f4f0]/20 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#f4f4f0]/80 bg-[#f4f4f0]/[0.02]">
              SECTOR: <span className="text-white font-bold">ALPHA-09</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Countdown Ticker + Vault Allocation Depletion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-12 items-start">
          
          {/* Left Column: Live Real-time Countdown Box (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="border border-[#f4f4f0]/20 bg-[#0a0a0a] p-6 sm:p-10 corner-tick-all relative">
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#f4f4f0]/10">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#f4f4f0]/60 font-semibold">
                  T-MINUS DEPLOYMENT CLOCK
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#f4f4f0]/40">
                  UTC ISO-8601 // LIVE
                </span>
              </div>

              {/* 4-digit Countdown Digits */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
                {/* Days */}
                <div className="border border-[#f4f4f0]/15 bg-[#f4f4f0]/[0.03] p-3 sm:p-6 flex flex-col justify-center items-center">
                  <span className="font-bebas text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#f4f4f0] leading-none">
                    {pad(timeLeft.days)}
                  </span>
                  <span className="font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.3em] text-[#f4f4f0]/50 mt-2">
                    DAYS
                  </span>
                </div>

                {/* Hours */}
                <div className="border border-[#f4f4f0]/15 bg-[#f4f4f0]/[0.03] p-3 sm:p-6 flex flex-col justify-center items-center">
                  <span className="font-bebas text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#f4f4f0] leading-none">
                    {pad(timeLeft.hours)}
                  </span>
                  <span className="font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.3em] text-[#f4f4f0]/50 mt-2">
                    HOURS
                  </span>
                </div>

                {/* Minutes */}
                <div className="border border-[#f4f4f0]/15 bg-[#f4f4f0]/[0.03] p-3 sm:p-6 flex flex-col justify-center items-center">
                  <span className="font-bebas text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#f4f4f0] leading-none">
                    {pad(timeLeft.minutes)}
                  </span>
                  <span className="font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.3em] text-[#f4f4f0]/50 mt-2">
                    MINUTES
                  </span>
                </div>

                {/* Seconds */}
                <div className="border border-[#f4f4f0]/15 bg-[#f4f4f0]/[0.03] p-3 sm:p-6 flex flex-col justify-center items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#f4f4f0] animate-ping" />
                  <span className="font-bebas text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#f4f4f0] leading-none">
                    {pad(timeLeft.seconds)}
                  </span>
                  <span className="font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.3em] text-[#f4f4f0]/50 mt-2">
                    SECONDS
                  </span>
                </div>
              </div>

              {/* Ticker Sub-telemetry */}
              <div className="mt-8 pt-6 border-t border-[#f4f4f0]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] text-[#f4f4f0]/60">
                <div className="flex items-center gap-2">
                  <span className="text-[#f4f4f0] font-bold">RELEASE:</span>
                  <span>SS26 DROP 02 // ARCHITECTURAL FORTRESS CAPSULE</span>
                </div>
                <div>
                  <span>GLOBAL ACCESS: 18:00 UTC</span>
                </div>
              </div>
            </div>

            {/* Micro specs ticker */}
            <div className="grid grid-cols-3 gap-3 font-mono text-[10px] uppercase">
              <div className="border border-[#f4f4f0]/10 p-3 bg-[#f4f4f0]/[0.01]">
                <span className="text-[#f4f4f0]/40 block mb-1">BATCH CAPACITY</span>
                <span className="text-[#f4f4f0] font-bold">1,000 ARCHIVAL PCS</span>
              </div>
              <div className="border border-[#f4f4f0]/10 p-3 bg-[#f4f4f0]/[0.01]">
                <span className="text-[#f4f4f0]/40 block mb-1">ALLOCATION RESTRICTION</span>
                <span className="text-[#f4f4f0] font-bold">MAX 2 PER CIPHER</span>
              </div>
              <div className="border border-[#f4f4f0]/10 p-3 bg-[#f4f4f0]/[0.01]">
                <span className="text-[#f4f4f0]/40 block mb-1">SHIPMENT DISPATCH</span>
                <span className="text-[#f4f4f0] font-bold">48H DEPLOYMENT</span>
              </div>
            </div>
          </div>

          {/* Right Column: Vault Allocation Gauge & Priority RSVP CTA (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="border border-[#f4f4f0]/20 bg-[#0a0a0a] p-6 sm:p-8 corner-tick relative flex flex-col">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#f4f4f0]/10">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f4f4f0]/50 block">
                    VAULT CAPACITY MONITOR
                  </span>
                  <h3 className="font-syne font-bold text-2xl uppercase tracking-tight text-[#f4f4f0] mt-1">
                    ALLOCATION DEPLETION
                  </h3>
                </div>
                <div className="px-2 py-1 bg-[#f4f4f0] text-[#0a0a0a] font-mono text-[10px] font-bold tracking-widest uppercase">
                  CRITICAL
                </div>
              </div>

              {/* Progress Percentage & Stats */}
              <div className="my-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-bebas text-5xl sm:text-6xl text-[#f4f4f0] leading-none tracking-tight">
                    {depletionPct}%
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#f4f4f0]/70">
                    {claimedAllocation} / {totalAllocation} CLAIMED
                  </span>
                </div>

                {/* Progress bar with brutalist segments */}
                <div className="w-full h-4 bg-[#f4f4f0]/10 border border-[#f4f4f0]/25 relative p-[2px]">
                  <div
                    className="h-full bg-[#f4f4f0] transition-all duration-1000 ease-out relative"
                    style={{ width: `${depletionPct}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-[#0a0a0a]" />
                  </div>
                </div>

                <div className="flex justify-between font-mono text-[9px] text-[#f4f4f0]/40 mt-2 uppercase tracking-widest">
                  <span>0% (RESERVED)</span>
                  <span>50% (HALFWAY)</span>
                  <span>100% (DEPLETED)</span>
                </div>
              </div>

              {/* Category-wise Breakdown */}
              <div className="flex flex-col gap-3 font-mono text-xs border-t border-b border-[#f4f4f0]/10 py-5">
                <div className="flex justify-between items-center">
                  <span className="text-[#f4f4f0]/70">240 GSM Boxy Tees</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[#f4f4f0]/10">
                      <div className="h-full bg-[#f4f4f0]" style={{ width: '92%' }} />
                    </div>
                    <span className="font-bold text-[#f4f4f0]">92%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#f4f4f0]/70">240 GSM Cotton Blend Waffles</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[#f4f4f0]/10">
                      <div className="h-full bg-[#f4f4f0]" style={{ width: '78%' }} />
                    </div>
                    <span className="font-bold text-[#f4f4f0]">78%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#f4f4f0]/70">360 GSM Pure Cotton Hoodies</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-[#f4f4f0]/10">
                      <div className="h-full bg-[#f4f4f0]" style={{ width: '86%' }} />
                    </div>
                    <span className="font-bold text-[#f4f4f0]">86%</span>
                  </div>
                </div>
              </div>

              {/* Priority RSVP CTA Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleOpenRsvp}
                  className="w-full bg-[#f4f4f0] text-[#0a0a0a] hover:bg-white active:scale-[0.99] font-syne font-black text-sm uppercase tracking-[0.2em] py-4 px-6 transition-all duration-200 flex items-center justify-center gap-3 group cursor-pointer shadow-lg"
                >
                  <span>REQUEST PRIORITY ALLOCATION // RSVP</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
                <p className="font-mono text-[10px] text-center text-[#f4f4f0]/40 mt-3 uppercase tracking-widest">
                  ★ UNLOCKS 15-MINUTE ADVANCE VAULT WINDOW BEFORE PUBLIC LAUNCH
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ─── Brutalist Priority RSVP Modal ───────────────────────── */}
      {isRsvpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
            onClick={handleCloseRsvp}
          />

          {/* Modal Dialog Card */}
          <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#f4f4f0]/30 shadow-2xl p-6 sm:p-8 z-10 corner-tick-all text-[#f4f4f0]">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#f4f4f0]/15">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#f4f4f0]/50 block">
                  TRANSMISSION CHANNEL // SECTOR-04
                </span>
                <h3 className="font-syne font-black text-2xl sm:text-3xl uppercase tracking-tight text-[#f4f4f0] mt-1">
                  PRIORITY DROP RSVP
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseRsvp}
                className="font-mono text-xs uppercase tracking-widest text-[#f4f4f0]/50 hover:text-[#f4f4f0] border border-[#f4f4f0]/20 hover:border-[#f4f4f0]/50 px-2 py-1 transition-colors cursor-pointer"
                aria-label="Close RSVP modal"
              >
                ESC [✕]
              </button>
            </div>

            {/* Modal Body */}
            {rsvpSuccess ? (
              <div className="py-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 border border-[#f4f4f0] flex items-center justify-center font-mono text-xl mb-4 bg-[#f4f4f0]/5">
                  ✓
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f4f4f0]/60">
                  ALL-CLEAR // PROTOCOL VERIFIED
                </span>
                <h4 className="font-syne font-bold text-2xl uppercase tracking-tight text-white mt-1 mb-4">
                  VAULT SPOT RESERVED
                </h4>
                <div className="border border-dashed border-[#f4f4f0]/40 bg-[#f4f4f0]/[0.03] p-4 w-full mb-6 font-mono text-center">
                  <div className="text-[10px] text-[#f4f4f0]/40 uppercase tracking-widest">CIPHER TOKEN</div>
                  <div className="text-xl font-bold text-[#f4f4f0] tracking-[0.2em] mt-1">
                    {rsvpSuccess.code}
                  </div>
                  <div className="text-[9px] text-[#f4f4f0]/50 mt-2">
                    PRIORITY QUEUE: 00{rsvpSuccess.queueNum} OF 1000 // TIER-1
                  </div>
                </div>
                <p className="font-mono text-xs text-[#f4f4f0]/70 leading-relaxed mb-6 max-w-sm">
                  We have dispatched your encrypted drop token. You will receive an automated trigger 15 minutes prior to SS26 Drop 02 public unveiling.
                </p>
                <button
                  type="button"
                  onClick={handleCloseRsvp}
                  className="w-full bg-[#f4f4f0] text-[#0a0a0a] hover:bg-white font-syne font-black text-xs uppercase tracking-[0.2em] py-3.5 px-6 transition-colors cursor-pointer"
                >
                  DISMISS TERMINAL
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitRsvp} className="mt-6 flex flex-col gap-5">
                <p className="font-mono text-xs text-[#f4f4f0]/70 leading-relaxed">
                  Enter your operational signal coordinates to lock a verified spot in the SS26 Drop 02 queue before public depletion.
                </p>

                {/* Channel Switcher */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#f4f4f0]/50 mb-2">
                    DISPATCH SIGNAL MEDIUM
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        playTactileClick();
                        setRsvpChannel('email');
                      }}
                      className={`font-mono text-xs uppercase tracking-widest py-2.5 px-3 border transition-colors cursor-pointer ${
                        rsvpChannel === 'email'
                          ? 'border-[#f4f4f0] bg-[#f4f4f0] text-[#0a0a0a] font-bold'
                          : 'border-[#f4f4f0]/20 bg-transparent text-[#f4f4f0]/60 hover:border-[#f4f4f0]/40'
                      }`}
                    >
                      DIRECT EMAIL
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playTactileClick();
                        setRsvpChannel('phone');
                      }}
                      className={`font-mono text-xs uppercase tracking-widest py-2.5 px-3 border transition-colors cursor-pointer ${
                        rsvpChannel === 'phone'
                          ? 'border-[#f4f4f0] bg-[#f4f4f0] text-[#0a0a0a] font-bold'
                          : 'border-[#f4f4f0]/20 bg-transparent text-[#f4f4f0]/60 hover:border-[#f4f4f0]/40'
                      }`}
                    >
                      SMS / SIGNAL
                    </button>
                  </div>
                </div>

                {/* Input Field */}
                {rsvpChannel === 'email' ? (
                  <div>
                    <label
                      htmlFor={emailInputId}
                      className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#f4f4f0]/50 mb-1.5"
                    >
                      AUTHORIZED EMAIL ADDRESS
                    </label>
                    <input
                      id={emailInputId}
                      type="email"
                      value={rsvpEmail}
                      onChange={(e) => setRsvpEmail(e.target.value)}
                      placeholder="OPERATOR@SKAUNS.COM"
                      className="w-full bg-[#f4f4f0]/[0.05] border border-[#f4f4f0]/25 focus:border-[#f4f4f0] px-4 py-3 font-mono text-xs text-[#f4f4f0] placeholder:text-[#f4f4f0]/25 outline-none transition-colors"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor={phoneInputId}
                      className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#f4f4f0]/50 mb-1.5"
                    >
                      MOBILE / SIGNAL FREQUENCY
                    </label>
                    <input
                      id={phoneInputId}
                      type="tel"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                      placeholder="+1 (555) 019-2831"
                      className="w-full bg-[#f4f4f0]/[0.05] border border-[#f4f4f0]/25 focus:border-[#f4f4f0] px-4 py-3 font-mono text-xs text-[#f4f4f0] placeholder:text-[#f4f4f0]/25 outline-none transition-colors"
                      autoFocus
                    />
                  </div>
                )}

                {/* Target Silhouette Preference */}
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#f4f4f0]/50 mb-1.5">
                    PRIMARY SILHOUETTE TARGET
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px]">
                    {(['all', 'tees', 'waffles', 'hoodies'] as const).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          playTactileClick();
                          setRsvpSilhouette(cat);
                        }}
                        className={`py-2 px-1 text-center border uppercase transition-colors cursor-pointer ${
                          rsvpSilhouette === cat
                            ? 'border-[#f4f4f0] bg-[#f4f4f0]/20 text-[#f4f4f0] font-bold'
                            : 'border-[#f4f4f0]/15 text-[#f4f4f0]/40 hover:text-[#f4f4f0]/80'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Validation Error Banner */}
                {formError && (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-200 font-mono text-[11px]">
                    {formError}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={rsvpSubmitting}
                  className="w-full bg-[#f4f4f0] text-[#0a0a0a] hover:bg-white active:scale-[0.99] font-syne font-black text-xs uppercase tracking-[0.2em] py-4 px-6 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                >
                  {rsvpSubmitting ? (
                    <span className="font-mono tracking-widest animate-pulse">TRANSMITTING TELEMETRY...</span>
                  ) : (
                    <span>TRANSMIT SIGNAL // LOCK RESERVATION</span>
                  )}
                </button>

                <div className="text-center font-mono text-[9px] text-[#f4f4f0]/30 tracking-widest uppercase">
                  ZERO SPAM TOLERANCE // CIPHER DESTROYED POST-DROP
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </section>
  );
}
