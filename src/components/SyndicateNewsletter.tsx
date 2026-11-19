import { useState, useId, type FormEvent } from 'react';
import { playTactileClick, playCipherBeep } from '../utils/audio';
import { dispatchMemberJoinedToAdmin } from '../services/adminDispatcher';

export interface SyndicateNewsletterProps {
  onApplyPromo?: (code: string) => void;
}

export default function SyndicateNewsletter({ onApplyPromo }: SyndicateNewsletterProps) {
  const emailInputId = useId();
  const [email, setEmail] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cipherText, setCipherText] = useState('0x7F...A4');
  const [errorMessage, setErrorMessage] = useState('');

  const PROMO_CODE = 'VOID10';

  const handleTransmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('TRANSMISSION REJECTED: ENTER A VALID OPERATOR EMAIL SIGNAL.');
      playTactileClick();
      return;
    }

    setIsDecrypting(true);
    playTactileClick();

    // Silently notify admin of new subscriber (hidden from customer)
    void dispatchMemberJoinedToAdmin(email.trim(), 'email', 'SS26 Syndicate Newsletter 10% Decrypt');

    // Simulated multi-stage terminal decryption sequence
    let count = 0;
    const chars = '0123456789ABCDEF!@#$%&*';
    const interval = setInterval(() => {
      count++;
      let scrambled = '';
      for (let i = 0; i < 8; i++) {
        scrambled += chars[Math.floor(Math.random() * chars.length)];
      }
      setCipherText(scrambled);

      if (count > 7) {
        clearInterval(interval);
        setIsDecrypting(false);
        setIsUnlocked(true);
        setCipherText(PROMO_CODE);
        playCipherBeep();
        if (onApplyPromo) {
          onApplyPromo(PROMO_CODE);
        }
      }
    }, 90);
  };

  const handleCopyCode = async () => {
    playTactileClick();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(PROMO_CODE);
      }
      setCopied(true);
      playCipherBeep();
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      setCopied(true);
    }
  };

  return (
    <section
      id="newsletter"
      className="relative bg-[#0a0a0a] text-[#f4f4f0] border-t border-[#f4f4f0]/10 py-20 sm:py-28 overflow-hidden"
    >
      {/* Cyber Grid Texture */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />

      {/* Decorative scanline accent */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#f4f4f0]/30 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 relative z-10">
        
        {/* Terminal Shell Container */}
        <div className="max-w-4xl mx-auto border border-[#f4f4f0]/25 bg-[#0a0a0a] corner-tick-all relative shadow-2xl">
          
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#f4f4f0]/15 bg-[#f4f4f0]/[0.03]">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[#f4f4f0] animate-pulse inline-block" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#f4f4f0] font-bold">
                SYNDICATE TERMINAL // SECURE CIPHER PROTOCOL
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-[#f4f4f0]/40">
              <span className="hidden sm:inline">PORT: 443 // SSL_RSA</span>
              <span className="text-[#f4f4f0]/70 font-semibold">[ACTIVE]</span>
            </div>
          </div>

          {/* Terminal Main Content */}
          <div className="p-6 sm:p-12 flex flex-col gap-8">
            
            {/* Header Telemetry */}
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#f4f4f0]/50 mb-2">
                <span>ESTABLISH UPLINK</span>
                <span>//</span>
                <span>PRIVILEGE CODE DISPATCH</span>
              </div>
              <h2 className="font-syne font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tighter text-[#f4f4f0] leading-none m-0">
                JOIN THE SYNDICATE
              </h2>
              <p className="font-mono text-xs sm:text-sm text-[#f4f4f0]/70 leading-relaxed max-w-2xl mt-4">
                Transmit your coordinates to the inner registry. Instantly decrypt authorization token <span className="text-white font-bold underline underline-offset-4 decoration-[#f4f4f0]/40">VOID10</span> for 10% privilege reduction across all archived silhouettes.
              </p>
            </div>

            {/* Unlocked State vs Input Form */}
            {isUnlocked ? (
              <div className="border border-[#f4f4f0] bg-[#f4f4f0]/[0.05] p-6 sm:p-8 corner-tick relative flex flex-col gap-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#f4f4f0]/15 gap-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#f4f4f0]/60 block font-bold">
                      TRANSMISSION DECRYPTED // AUTHORIZED
                    </span>
                    <h3 className="font-syne font-black text-2xl uppercase tracking-tight text-white mt-1">
                      PRIVILEGE ACCESS GRANTED
                    </h3>
                  </div>
                  <div className="px-3 py-1 bg-[#f4f4f0] text-[#0a0a0a] font-mono text-xs font-bold tracking-widest uppercase self-start sm:self-auto">
                    10% PRIVILEGE DISCOUNT
                  </div>
                </div>

                {/* Unlocked Code Display & 1-Click Copy */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0a0a0a] border border-[#f4f4f0]/30 p-4 sm:p-6">
                  <div className="flex-1 font-mono text-center sm:text-left">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#f4f4f0]/40 block mb-1">
                      AUTHORIZATION CIPHER
                    </span>
                    <span className="font-bebas text-4xl sm:text-5xl tracking-[0.2em] text-[#f4f4f0] font-bold">
                      {PROMO_CODE}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="w-full sm:w-auto bg-[#f4f4f0] text-[#0a0a0a] hover:bg-white active:scale-[0.98] font-syne font-black text-xs uppercase tracking-[0.2em] py-3.5 px-6 transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap shadow-md"
                  >
                    {copied ? (
                      <>
                        <span className="text-sm font-bold">✓</span>
                        <span>COPIED TO CLIPBOARD</span>
                      </>
                    ) : (
                      <>
                        <span>COPY PRIVILEGE CODE</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Status Telemetry */}
                <div className="font-mono text-[11px] text-[#f4f4f0]/60 flex flex-col sm:flex-row justify-between gap-2 border-t border-[#f4f4f0]/10 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-white">STATUS:</span>
                    <span>APPLIED TO CHECKOUT SYSTEM (10% OFF CART VALUE)</span>
                  </div>
                  <div>
                    <span>DISPATCH SENT TO: <span className="text-[#f4f4f0] font-semibold">{email}</span></span>
                  </div>
                </div>

              </div>
            ) : (
              <form onSubmit={handleTransmit} className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <label htmlFor={emailInputId} className="sr-only">
                      Email Address
                    </label>
                    <input
                      id={emailInputId}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ENTER OPERATOR EMAIL..."
                      disabled={isDecrypting}
                      className="w-full bg-[#f4f4f0]/[0.04] border border-[#f4f4f0]/25 focus:border-[#f4f4f0] px-5 py-4 font-mono text-xs sm:text-sm text-[#f4f4f0] placeholder:text-[#f4f4f0]/25 outline-none transition-colors disabled:opacity-50"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#f4f4f0]/30 hidden md:block uppercase tracking-widest pointer-events-none">
                      CIPHER_INPUT
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isDecrypting}
                    className="bg-[#f4f4f0] text-[#0a0a0a] hover:bg-white active:scale-[0.99] font-syne font-black text-xs sm:text-sm uppercase tracking-[0.2em] py-4 px-8 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 whitespace-nowrap shadow-md"
                  >
                    {isDecrypting ? (
                      <span className="font-mono tracking-widest flex items-center gap-2">
                        <span>DECRYPTING</span>
                        <span className="font-bold font-mono text-xs">[{cipherText}]</span>
                      </span>
                    ) : (
                      <>
                        <span>TRANSMIT SIGNAL</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-200 font-mono text-[11px]">
                    {errorMessage}
                  </div>
                )}

                {/* Micro guarantees */}
                <div className="flex flex-wrap items-center justify-between font-mono text-[10px] text-[#f4f4f0]/40 uppercase tracking-widest pt-2">
                  <span>★ ZERO MARKETING DRIVEL</span>
                  <span>✦ DROP ALERTS ONLY</span>
                  <span>🔒 END-TO-END CIPHER TRANSMISSION</span>
                </div>
              </form>
            )}

            {/* Terminal Live Output Log Lines */}
            <div className="border border-[#f4f4f0]/10 bg-[#0a0a0a] p-4 font-mono text-[10px] sm:text-[11px] text-[#f4f4f0]/50 flex flex-col gap-1 select-none">
              <div className="flex items-center gap-2">
                <span className="text-[#f4f4f0]/30">&gt;</span>
                <span className="text-[#f4f4f0]/70">SKAUNS_KERNEL_v4.2.1 READY</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#f4f4f0]/30">&gt;</span>
                <span>SUBSCRIBER REGISTRY: 8,419 VERIFIED TRANSMISSION NODES</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#f4f4f0]/30">&gt;</span>
                <span>SECURITY LEVEL: ZERO-KNOWLEDGE ENCRYPTION ACTIVE</span>
                <span className="animate-pulse text-[#f4f4f0]">_</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
