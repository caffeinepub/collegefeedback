const MUTE_KEY = 'sounds_muted';

export function getMuted(): boolean {
  try {
    return sessionStorage.getItem(MUTE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setMuted(muted: boolean): void {
  try {
    sessionStorage.setItem(MUTE_KEY, muted ? 'true' : 'false');
  } catch {
    // ignore
  }
}

function getAudioContext(): AudioContext | null {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    return new AudioCtx();
  } catch {
    return null;
  }
}

/**
 * Plays a short, pleasant bubble-pop tone burst.
 * Used for: upvote, connect, form submit, category tab clicks.
 */
export function playBubblePop(): void {
  if (getMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(520, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(820, ctx.currentTime + 0.06);
    oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.14);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);

    oscillator.onended = () => {
      try { ctx.close(); } catch { /* ignore */ }
    };
  } catch {
    try { ctx.close(); } catch { /* ignore */ }
  }
}

/**
 * Plays a gentle typing tick sound.
 * Used for: keydown events in the Share Experience textarea.
 */
export function playTypingTick(): void {
  if (getMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const bufferSize = ctx.sampleRate * 0.04; // 40ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Short noise burst shaped like a tick
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 8);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    // High-pass filter to make it sound crisp
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1800;

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(ctx.currentTime);

    source.onended = () => {
      try { ctx.close(); } catch { /* ignore */ }
    };
  } catch {
    try { ctx.close(); } catch { /* ignore */ }
  }
}
