// Cheap WebAudio for the cave: a low drone, a chime per star, the Gloam's
// breath, a rumble and thuds for the meteors, a click per closing stone layer,
// one warm bell for the lantern at the end. All through a generated cave reverb.
// Starts only from a tap (iOS).

const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const PENTA = [0, 3, 5, 7, 10, 12, 15, 17, 19, 22];

export class CaveSound {
  constructor() { this.ctx = null; this.nodes = []; }

  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      const c = this.ctx;
      this.master = c.createGain(); this.master.gain.value = 0.9;
      const comp = c.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3;
      this.master.connect(comp).connect(c.destination);
      // cave reverb: a long, dark, decaying noise impulse
      this.verb = c.createConvolver();
      const len = Math.floor(c.sampleRate * 3.2), ir = c.createBuffer(2, len, c.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch);
        let lp = 0;
        for (let i = 0; i < len; i++) { lp += ((Math.random() * 2 - 1) - lp) * 0.35; d[i] = lp * Math.pow(1 - i / len, 2.6); }
      }
      this.verb.buffer = ir;
      this.wet = c.createGain(); this.wet.gain.value = 0.55;
      this.verb.connect(this.wet).connect(this.master);
      this.dry = c.createGain(); this.dry.connect(this.master); this.dry.connect(this.verb);
      this.noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
      const nd = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return true;
  }

  // play the cues from story time `from`; returns nothing, stop() silences
  start(cues, from) {
    if (!this.ctx) return;
    this.stop(0.05);
    const c = this.ctx, now = c.currentTime + 0.05;
    this.bus = c.createGain(); this.bus.connect(this.dry);
    this.bus.gain.setValueAtTime(0, now);
    this.bus.gain.linearRampToValueAtTime(1, now + 0.6);
    const at = (t) => now + Math.max(0, t - from);
    this.drone(at(0), from);
    for (const q of cues) {
      if (q.t < from - 0.05) continue;
      const T = at(q.t);
      if (q.kind === 'chime') this.bell(62 + PENTA[(q.k * 3) % PENTA.length], T, 0.09, 3.2);
      else if (q.kind === 'gloam') this.breath(T, 7, 0.16);
      else if (q.kind === 'grip') this.breath(T, q.moon ? 2.5 : 1.2, q.moon ? 0.12 : 0.05, 240);
      else if (q.kind === 'crack') { this.grind(T, 0.8); this.rumble(T + 0.6, 2.4); this.wrong(T + 0.8); }
      else if (q.kind === 'jolt') { this.thud(T, q.near ? 0.2 : 0.08); this.click(T, q.near ? 0.12 : 0.05); this.click(T + 0.04, 0.06); }
      else if (q.kind === 'hush') this.hush(T, 0.85);
      else if (q.kind === 'strike') { this.stab(T); this.thud(T, 0.3); }
      else if (q.kind === 'heart') { this.thud(T, 0.22); this.thud(T + 0.24, 0.13); }
      else if (q.kind === 'tear') this.bend(66 + [0, 3, 5, 7, 10, 12, 15, 17, 19, 22][q.k % 10], T, 0.08);
      else if (q.kind === 'yank') { this.thud(T, q.moon ? 0.32 : 0.16); this.breath(T, 0.35, q.moon ? 0.16 : 0.08, 900); }
      else if (q.kind === 'fall') this.whoosh(T, q.dur, q.moon ? 0.22 : 0.1);
      else if (q.kind === 'rumble') this.rumble(T, 6.5);
      else if (q.kind === 'impact') this.thud(T, q.moon ? 0.5 : 0.28);
      else if (q.kind === 'stone') this.click(T, 0.05 + 0.02 * q.r);
      else if (q.kind === 'lantern') { this.bell(74, T, 0.12, 5); this.bell(81, T + 0.35, 0.07, 5); }
    }
    // everything ebbs away with the fade
    this.bus.gain.setValueAtTime(1, at(33.6));
    this.bus.gain.linearRampToValueAtTime(0, at(36.6));
  }

  stop(fade = 0.4) {
    if (!this.ctx || !this.bus) return;
    const c = this.ctx, b = this.bus;
    b.gain.cancelScheduledValues(c.currentTime);
    b.gain.setValueAtTime(b.gain.value, c.currentTime);
    b.gain.linearRampToValueAtTime(0, c.currentTime + fade);
    const nodes = this.nodes; this.nodes = [];
    setTimeout(() => { for (const n of nodes) try { n.stop(); } catch { /* already stopped */ } b.disconnect(); }, fade * 1000 + 100);
    this.bus = null;
  }

  src(node, t0, t1) { node.start(t0); if (t1) node.stop(t1); this.nodes.push(node); return node; }
  noise() { const n = this.ctx.createBufferSource(); n.buffer = this.noiseBuf; n.loop = true; return n; }

  // two detuned low voices under a slowly breathing filter; darker once the Gloam rises
  drone(T, from) {
    const c = this.ctx, g = c.createGain(), f = c.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 260; f.Q.value = 0.7;
    g.gain.setValueAtTime(0, T); g.gain.linearRampToValueAtTime(0.11, T + 2.5);
    f.connect(g).connect(this.bus);
    for (const [m, det, type] of [[38, -6, 'sawtooth'], [45, 5, 'sawtooth'], [26, 0, 'sine']]) {
      const o = c.createOscillator(); o.type = type; o.frequency.value = hz(m); o.detune.value = det;
      const og = c.createGain(); og.gain.value = type === 'sine' ? 0.9 : 0.35;
      o.connect(og).connect(f); this.src(o, T);
    }
    const lfo = c.createOscillator(), lg = c.createGain();
    lfo.frequency.value = 0.07; lg.gain.value = 90; lfo.connect(lg).connect(f.frequency); this.src(lfo, T);
    // the Gloam: a semitone rubs against the drone, then leaves with the night
    const at = (t) => T + Math.max(0, t - from);
    const o2 = c.createOscillator(), g2 = c.createGain();
    o2.type = 'sawtooth'; o2.frequency.value = hz(39); g2.gain.value = 0;
    g2.gain.setValueAtTime(0, at(9.2)); g2.gain.linearRampToValueAtTime(0.3, at(13)); g2.gain.setValueAtTime(0.3, at(22)); g2.gain.linearRampToValueAtTime(0, at(27));
    o2.connect(g2).connect(f); this.src(o2, T);
    f.frequency.setValueAtTime(260, at(15)); f.frequency.linearRampToValueAtTime(440, at(21)); f.frequency.linearRampToValueAtTime(200, at(27));
  }

  // a moment of near silence before the strike
  hush(T, dur) {
    const g = this.bus.gain;
    g.setValueAtTime(1, T); g.linearRampToValueAtTime(0.25, T + 0.3); g.setValueAtTime(0.25, T + dur - 0.02); g.linearRampToValueAtTime(1, T + dur);
  }
  // a dissonant stab: a cluster a semitone apart, with a scrape of noise
  stab(T) {
    for (const m of [49, 50, 56, 61]) this.bell(m, T, 0.07, 2.4);
    this.breath(T, 0.5, 0.25, 1400);
  }
  // stone grinding apart as the fissure opens
  grind(T, dur) {
    const c = this.ctx, n = this.noise(), f = c.createBiquadFilter(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
    f.type = 'bandpass'; f.frequency.value = 520; f.Q.value = 3;
    lfo.frequency.value = 23; lg.gain.value = 0.12; lfo.connect(lg).connect(g.gain);
    g.gain.setValueAtTime(0.0, T); g.gain.linearRampToValueAtTime(0.14, T + 0.2); g.gain.linearRampToValueAtTime(0, T + dur);
    n.connect(f).connect(g).connect(this.bus); this.src(n, T, T + dur + 0.1); this.src(lfo, T, T + dur + 0.1);
  }
  // the wrong note from somewhere else: two high tones beating, that never leave
  wrong(T) {
    const c = this.ctx, g = c.createGain();
    g.gain.setValueAtTime(0, T); g.gain.linearRampToValueAtTime(0.025, T + 3);
    for (const [f0, pan] of [[1661, -0.4], [1668.5, 0.4]]) {
      const o = c.createOscillator(), p = c.createStereoPanner ? c.createStereoPanner() : c.createGain();
      o.type = 'sine'; o.frequency.value = f0; if (p.pan) p.pan.value = pan;
      o.connect(p).connect(g); this.src(o, T);
    }
    g.connect(this.bus);
  }
  // a star's chime, bending down out of tune as it is torn loose
  bend(m, T, gain) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(hz(m), T); o.frequency.exponentialRampToValueAtTime(hz(m) * 0.72, T + 1.4);
    o.detune.setValueAtTime(0, T); o.detune.linearRampToValueAtTime(-40, T + 1.4);
    g.gain.setValueAtTime(0, T); g.gain.linearRampToValueAtTime(gain, T + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, T + 1.8);
    o.connect(g).connect(this.bus); this.src(o, T, T + 1.9);
  }
  bell(m, T, gain, decay) {
    const c = this.ctx, car = c.createOscillator(), mod = c.createOscillator(), mg = c.createGain(), g = c.createGain();
    car.frequency.value = hz(m); mod.frequency.value = hz(m) * 3.5;
    mg.gain.setValueAtTime(hz(m) * 2.2, T); mg.gain.exponentialRampToValueAtTime(hz(m) * 0.2, T + 0.6);
    mod.connect(mg).connect(car.frequency);
    g.gain.setValueAtTime(0, T); g.gain.linearRampToValueAtTime(gain, T + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, T + decay);
    car.connect(g).connect(this.bus);
    this.src(car, T, T + decay + 0.1); this.src(mod, T, T + decay + 0.1);
  }
  breath(T, dur, gain, freq = 380) {
    const c = this.ctx, n = this.noise(), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'bandpass'; f.frequency.setValueAtTime(freq, T); f.frequency.linearRampToValueAtTime(freq * 0.55, T + dur); f.Q.value = 1.2;
    g.gain.setValueAtTime(0, T); g.gain.linearRampToValueAtTime(gain, T + dur * 0.45); g.gain.linearRampToValueAtTime(0, T + dur);
    n.connect(f).connect(g).connect(this.bus); this.src(n, T, T + dur + 0.1);
  }
  whoosh(T, dur, gain) {
    const c = this.ctx, n = this.noise(), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'bandpass'; f.Q.value = 2; f.frequency.setValueAtTime(2400, T); f.frequency.exponentialRampToValueAtTime(260, T + dur);
    g.gain.setValueAtTime(0, T); g.gain.linearRampToValueAtTime(gain, T + dur * 0.8); g.gain.linearRampToValueAtTime(0, T + dur + 0.05);
    n.connect(f).connect(g).connect(this.bus); this.src(n, T, T + dur + 0.2);
  }
  rumble(T, dur) {
    const c = this.ctx, n = this.noise(), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'lowpass'; f.frequency.value = 110;
    g.gain.setValueAtTime(0, T); g.gain.linearRampToValueAtTime(0.5, T + dur * 0.5); g.gain.linearRampToValueAtTime(0, T + dur);
    n.connect(f).connect(g).connect(this.bus); this.src(n, T, T + dur + 0.1);
  }
  thud(T, gain) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(90, T); o.frequency.exponentialRampToValueAtTime(30, T + 0.5);
    g.gain.setValueAtTime(0, T); g.gain.linearRampToValueAtTime(gain * 2, T + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, T + 1.2);
    o.connect(g).connect(this.bus); this.src(o, T, T + 1.3);
    const n = this.noise(), f = c.createBiquadFilter(), ng = c.createGain();
    f.type = 'lowpass'; f.frequency.setValueAtTime(1800, T); f.frequency.exponentialRampToValueAtTime(120, T + 0.6);
    ng.gain.setValueAtTime(gain, T); ng.gain.exponentialRampToValueAtTime(0.0001, T + 0.8);
    n.connect(f).connect(ng).connect(this.bus); this.src(n, T, T + 0.9);
  }
  click(T, gain) {
    const c = this.ctx, n = this.noise(), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'bandpass'; f.frequency.value = 900 + Math.random() * 500; f.Q.value = 4;
    g.gain.setValueAtTime(gain, T); g.gain.exponentialRampToValueAtTime(0.0001, T + 0.09);
    n.connect(f).connect(g).connect(this.bus); this.src(n, T, T + 0.12);
  }
}
