// A sketch of the sound: silence until the first touch (browsers wait for
// one anyway), then a soft knock, a warm swell as the light rises, and a
// high, quiet bell for stars as they arrive - never more than a few a second,
// on a pentatonic scale so any of them can sound together.
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
  // The stone breaking (Kellan, 2026-10-29: "incredibly satisfying"). At the touch:
  // a deep soft thoom as it gives way, a glassy crack (a geode splitting: a few
  // inharmonic partials over a bright snap), and an airy whoosh rising as the light
  // leaves. Then each of the 26 stones a crisp woody tok, panned where it is,
  // climbing a pentatonic run as they go (a marimba glissando), and as the last
  // goes a soft chord, the light reaching the sky.
  release() {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    // the thoom: a low sine falling in pitch, felt more than heard
    const o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(96, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.45);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.42, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    o.connect(g); g.connect(this.out); o.start(t); o.stop(t + 0.75);
    // the crack: a bright snap, and glassy partials ringing a moment
    this.burst(t, 0.035, 0.5, 5200, 0.9, 'highpass');
    this.burst(t, 0.12, 0.22, 1800, 3);
    for (const [f, gn, d] of [[1630, 0.05, 0.5], [2471, 0.035, 0.38], [3517, 0.025, 0.3], [4890, 0.015, 0.22]]) this.tone(f * (0.98 + 0.04 * Math.random()), t + 0.004, d, gn, 'sine');
    // the whoosh: breath of air rising after the light
    const n = this.noiseSrc(1.6), bp = c.createBiquadFilter(), ng = c.createGain();
    bp.type = 'bandpass'; bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(400, t + 0.05); bp.frequency.exponentialRampToValueAtTime(5200, t + 1.5);
    ng.gain.setValueAtTime(0, t + 0.05); ng.gain.linearRampToValueAtTime(0.09, t + 0.5); ng.gain.linearRampToValueAtTime(0, t + 1.6);
    n.connect(bp); bp.connect(ng); ng.connect(this.out); ng.connect(this.wet); n.start(t + 0.05); n.stop(t + 1.7);
    this.run = 0;
  }
  // one stone of the 26 going: k its place in the run (0..1), pan -1..1
  stone(k, pan = 0) {
    if (!this.ctx) return;
    const c = this.ctx, t = c.currentTime;
    const p = c.createStereoPanner ? c.createStereoPanner() : null;
    if (p) { p.pan.value = Math.max(-0.8, Math.min(0.8, pan)); p.connect(this.out); }
    const dest = p ?? this.out;
    // the tok: a tight knock of stone - a short resonant click and a falling low body
    this.burst(t, 0.018, 0.16 * (1 - 0.3 * k), 1700 + 900 * Math.random(), 7, 'bandpass', dest);
    const o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(110, t + 0.06);
    g.gain.setValueAtTime(0.11, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + 0.1);
    // its note, climbing the scale through the run: woody, a marimba bar (fundamental and its 4th partial)
    const step = this.run++, m = 62 + SCALE[step % 5] + 12 * Math.floor(step / 5);
    const f = midi(Math.min(m, 98));
    this.bar(f, t, 0.075 * (1 - 0.25 * k), dest);
    if (k >= 1) {   // the last: a soft chord as the light reaches the sky
      for (const [mm, gn] of [[74, 0.05], [79, 0.04], [83, 0.035], [86, 0.03]]) this.tone(midi(mm), t + 0.12, 2.6, gn, 'sine');
    }
  }
  bar(f, at, gain, dest = this.out) {
    const c = this.ctx;
    for (const [mul, gn, d] of [[1, gain, 0.42], [3.93, gain * 0.32, 0.12]]) {
      const o = c.createOscillator(), g = c.createGain();
      o.frequency.value = f * mul;
      g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(gn, at + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, at + d);
      o.connect(g); g.connect(dest); g.connect(this.wet); o.start(at); o.stop(at + d + 0.05);
    }
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
  star() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    if (t - this.last < 0.11) return;
    this.last = t;
    this.count++;
    const m = 74 + SCALE[(Math.random() * 5) | 0] + 12 * (Math.random() < 0.35);
    this.tone(midi(m), t, 1.8, 0.035, 'sine');
    this.tone(midi(m) * 2.01, t, 0.6, 0.008, 'sine');
  }
}
