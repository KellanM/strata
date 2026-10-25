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
