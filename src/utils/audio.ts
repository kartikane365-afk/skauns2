/**
 * SKAUNS Brutalist Procedural Web Audio Engine
 * Zero-asset acoustic feedback for tactical UI interactions.
 * Fully procedural synthesis using Web Audio API with zero external media files.
 */

const STORAGE_KEY = 'skauns_sound_enabled';

// Internal cached state
let audioCtx: AudioContext | null = null;
let soundEnabled: boolean | null = null;

/**
 * Determine if audio feedback is currently enabled.
 * Defaults to true unless explicitly muted in localStorage.
 */
export function isSoundEnabled(): boolean {
  if (soundEnabled !== null) {
    return soundEnabled;
  }
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    soundEnabled = stored === null ? true : stored !== 'false';
  } catch {
    soundEnabled = true;
  }
  return soundEnabled;
}

/**
 * Toggle sound enabled/disabled state and persist to localStorage.
 * Returns the new enabled state.
 */
export function toggleSound(): boolean {
  const next = !isSoundEnabled();
  soundEnabled = next;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Ignore localStorage write failures (e.g. private mode quota)
    }
  }
  if (next) {
    playTactileClick();
  }
  return next;
}

/**
 * Safely acquire or resume the shared AudioContext instance.
 * Handles browser autoplay policies and user gesture gating.
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) {
      return null;
    }
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {
        // Autoplay policy may reject until next user gesture
      });
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Short crisp micro-click with a 15ms frequency shift.
 * Ideal for buttons, toggles, and brutalist card interactions.
 */
export function playTactileClick(): void {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Highpass filter for crisp haptic acoustic click
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, t);

    // Rapid 15ms exponential pitch drop (2200Hz -> 380Hz)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2200, t);
    osc.frequency.exponentialRampToValueAtTime(380, t + 0.015);

    // Crisp exponential decay
    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.016);
  } catch {
    // Graceful degradation on unsupported audio hardware
  }
}

/**
 * Metallic mechanical shutter click for lookbook image switches and viewport shifts.
 * Simulates high-speed titanium focal plane shutter blades.
 */
export function playShutterClick(): void {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Component 1: Filtered metallic noise burst (shutter blade travel)
    const bufferSize = Math.floor(ctx.sampleRate * 0.035); // 35ms burst
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(3400, t);
    noiseFilter.Q.setValueAtTime(3.5, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.22, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // Component 2: Metallic mechanical body strike / latch snap
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.05);

    oscGain.gain.setValueAtTime(0.2, t);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    whiteNoise.start(t);
    osc.start(t);
    osc.stop(t + 0.055);
  } catch {
    // Gracefully ignore audio errors
  }
}

/**
 * Cyber authorization tone for promo codes, terminal validation, and unlocks.
 * High-tech ascending cyber confirmation sequence.
 */
export function playCipherBeep(): void {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Tone 1: Initial terminal query pulse (980 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(980, t);

    gain1.gain.setValueAtTime(0.14, t);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(t);
    osc1.stop(t + 0.05);

    // Tone 2: Ascending authorization confirm chirp (1760 Hz -> 2093 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    const t2 = t + 0.045;
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1760, t2);
    osc2.frequency.exponentialRampToValueAtTime(2093, t2 + 0.07);

    gain2.gain.setValueAtTime(0.0001, t);
    gain2.gain.setValueAtTime(0.16, t2);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t2 + 0.08);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(t2);
    osc2.stop(t2 + 0.085);
  } catch {
    // Gracefully ignore audio errors
  }
}

/**
 * Subtle low-frequency atmospheric swell.
 * Sub-bass cybernetic presence with gentle phasing.
 */
export function playDroneHum(): void {
  if (!isSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const duration = 0.85; // 850ms swell

    // Fundamental sub-bass oscillator (55 Hz - A1)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(55, t);

    // Detuned second oscillator (56.5 Hz) for acoustic phasing / beating
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(56.5, t);

    // Warm low-pass filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(130, t);

    // Swell envelope: smooth attack -> brief peak -> gentle decay
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, t);
    masterGain.gain.linearRampToValueAtTime(0.12, t + 0.18);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + duration + 0.01);
    osc2.stop(t + duration + 0.01);
  } catch {
    // Gracefully ignore audio errors
  }
}
