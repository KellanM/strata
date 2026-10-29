// A sketch of the sound: silence until the first touch (browsers wait for
// one anyway), then a soft knock, a warm swell as the light rises, and a
// high, quiet bell for stars as they arrive - quick at first, thinning out as
// they settle, on a pentatonic scale so any of them can sound together.
const SCALE = [0, 2, 4, 7, 9];   // major pentatonic
const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);

export class Sound {
  constructor() { this.ctx = null; this.last = 0; this.count = 0; }
  unlock() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    const c = this.ctx;
    this.out = c.createGain(); this.out.gain.value = 0.7; this.out.connect(c.destination);
    // a small echo: the night is big
    const d = c.createDelay(1.5); d.delayTime.value = 0.42;
    const fb = c.createGain(); fb.gain.value = 0.38;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
    this.wet = c.createGain(); this.wet.gain.value = 0.5;
    this.wet.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(this.out);
  }
  tone(freq, at, dur, gain, type = 'sine', wet = true) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(gain, at + Math.min(0.02, dur * 0.2));
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g); g.connect(this.out); if (wet) g.connect(this.wet);
    o.start(at); o.stop(at + dur + 0.05);
  }
  open(speed = 1, knock = true) {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    if (knock) {
      // the knock of stone giving way: a low thud with a little grit
      this.tone(92, t, 0.5, 0.35, 'sine', false);
      const n = c.createBufferSource(), buf = c.createBuffer(1, c.sampleRate * 0.25, c.sampleRate), ch = buf.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / ch.length, 4);
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.8;
      const g = c.createGain(); g.gain.value = 0.25;
      n.buffer = buf; n.connect(bp); bp.connect(g); g.connect(this.out); n.start(t);
    }
    // the swell: a warm open fifth that rises with the light and lets go
    for (const [m, gain] of [[50, 0.09], [57, 0.07], [62, 0.05], [69, 0.025]]) {
      const o = c.createOscillator(), og = c.createGain();
      o.type = 'sine'; o.frequency.value = midi(m);
      const at = (x) => t + x / speed;   // the swell keeps pace with the light
      og.gain.setValueAtTime(0, t + 0.2);
      og.gain.linearRampToValueAtTime(gain, at(3.5));
      og.gain.linearRampToValueAtTime(gain * 0.6, at(9));
      og.gain.linearRampToValueAtTime(0, at(16));
      o.connect(og); og.connect(this.out); og.connect(this.wet);
      o.start(t + 0.2); o.stop(at(16) + 0.2);
    }
  }
  // The stone breaking (Kellan, 2026-10-29): just the impact, dry - no echo (the
  // night's delay made each hit sound three times) and no notes. At the touch a
  // deep soft thoom as it gives way (no crack, Kellan 2026-10-29); then each of the 26 stones
  // a short knock, panned where it is.
  release() {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    // the thoom: a low sine falling in pitch, felt more than heard
    const o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(96, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.45);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.42, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    o.connect(g); g.connect(this.out); o.start(t); o.stop(t + 0.65);
  }
  // one stone of the 26 going: k its place in the run (0..1), pan -1..1
  stone(k, pan = 0) {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    const p = c.createStereoPanner ? c.createStereoPanner() : null;
    if (p) { p.pan.value = Math.max(-0.8, Math.min(0.8, pan)); p.connect(this.out); }
    const dest = p ?? this.out;
    // the knock: a tight resonant click and a falling low body
    this.burst(t, 0.02, 0.18 * (1 - 0.3 * k), 1500 + 900 * Math.random(), 6, 'bandpass', dest);
    const o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(200 + 40 * Math.random(), t); o.frequency.exponentialRampToValueAtTime(100, t + 0.07);
    g.gain.setValueAtTime(0.13 * (1 - 0.3 * k), t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + 0.12);
  }
  noiseSrc(dur) {
    const c = this.ctx, buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate), ch = buf.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    const n = c.createBufferSource(); n.buffer = buf; return n;
  }
  burst(at, dur, gain, freq, q, type = 'bandpass', dest = this.out) {
    const c = this.ctx, n = this.noiseSrc(dur + 0.02), f = c.createBiquadFilter(), g = c.createGain();
    f.type = type; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(gain, at); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    n.connect(f); f.connect(g); g.connect(dest); n.start(at); n.stop(at + dur + 0.02);
  }
  // The stars coming in, as the name is written (Kellan, 2026-10-29: the vibe, but "too repetitive
  // and drag on for too long"): quick and bright as the first rush in, thinning as fewer arrive -
  // the gap between them growing from a tenth of a second to more than one - and quiet by about
  // nine seconds. Not each a random note: a little melody wandering the pentatonic by a step or two,
  // high at first and drifting down as the stars settle; softer and longer-ringing as it slows,
  // spread a little left and right, and now and then, early, a twinkle - a quick neighbour note.
  star() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.t0 ??= t;
    const age = t - this.t0;
    if (age > 9) return;
    const gap = 0.1 * Math.exp(age / 2.4);   // 0.1 s, 0.3 at 2.6 s, 1.2 at 6 s
    if (t - this.last < gap * (0.75 + 0.5 * Math.random())) return;
    this.last = t;
    this.count++;
    const step = [-2, -1, -1, 1, 1, 2][(Math.random() * 6) | 0] - (Math.random() < age / 10 ? 1 : 0);
    this.deg = Math.max(0, Math.min(10, (this.deg ?? 8) + step));
    const m = 74 + 12 * Math.floor(this.deg / 5) + SCALE[this.deg % 5];
    const soft = 1 - 0.55 * Math.min(1, age / 9), ring = 1.6 + 0.3 * age, pan = Math.random() * 1.2 - 0.6;
    this.bell(midi(m), t, ring, 0.035 * soft, pan);
    if (age < 5 && Math.random() < 0.2) {   // a twinkle: the next note up, just after
      const d = this.deg + 1, m2 = 74 + 12 * Math.floor(d / 5) + SCALE[d % 5];
      this.bell(midi(m2), t + 0.08, ring * 0.6, 0.02 * soft, -pan);
    }
  }
  bell(freq, at, dur, gain, pan) {
    const c = this.ctx, o = c.createOscillator(), h = c.createOscillator(), g = c.createGain(), hg = c.createGain();
    const p = c.createStereoPanner ? c.createStereoPanner() : null;
    o.frequency.value = freq; h.frequency.value = freq * 2.01;   // the bell's ring and a faint overtone
    g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(gain, at + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    hg.gain.setValueAtTime(0, at); hg.gain.linearRampToValueAtTime(gain * 0.23, at + 0.01); hg.gain.exponentialRampToValueAtTime(0.0001, at + dur * 0.35);
    o.connect(g); h.connect(hg); hg.connect(g);
    const out = p ? (p.pan.value = pan, g.connect(p), p) : g;
    out.connect(this.out); out.connect(this.wet);
    o.start(at); h.start(at); o.stop(at + dur + 0.05); h.stop(at + dur + 0.05);
  }
}
