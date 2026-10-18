// Sound: a soft evolving bed of chords in each chapter's key, and play that
// lives inside it. Everything is synthesised with WebAudio; there are no files.
//
// Principles, from docs/game-loop-study.md (sound section):
//  - Taps sound instantly; only decoration (sparkles, arpeggios, stingers)
//    waits for the next 16th of the bed's clock (Rez, Mini Metro).
//  - Pitch always comes from the sounding chord or the chapter scale, so play
//    is a melody instrument over the bed (Peggle 2, MV2/MV3).
//  - Fast chains climb the scale and reward a run of eight (Peggle, Rez).
//  - The core action is the quietest, shortest tonal sound; hero sounds are
//    rare and consistent (Material sound guidelines).
//  - Identity sits between 500 Hz and 5 kHz, where phone speakers live.
//  - Mistakes are a soft consonant thud, never a buzzer.
//  - Rewards duck the bed and land on their animation frame (Apple, WWDC19).

const KEYS = {
  // root (MIDI, pad register) and pluck timbre per chapter palette
  Dawn:   { root: 50, minor: false, timbre: 'glass' },   // D
  Mint:   { root: 53, minor: false, timbre: 'wood' },    // F
  Lagoon: { root: 45, minor: false, timbre: 'water' },   // A
  Dusk:   { root: 52, minor: true, timbre: 'marimba' },  // E
  Night:  { root: 49, minor: true, timbre: 'bell' },     // C#
  Orchard: { root: 55, minor: false, timbre: 'marimba' }, // G
  Festival: { root: 47, minor: true, timbre: 'bell' },   // B
};
const MAJOR = { scale: [0, 2, 4, 7, 9], third: 4, chords: [[0, 4, 7, 14], [5, 9, 12, 19], [-3, 4, 7, 12], [7, 11, 14, 21], [0, 7, 11, 16], [-7, 2, 9, 12]] };
const MINOR = { scale: [0, 3, 5, 7, 10], third: 3, chords: [[0, 3, 7, 14], [-4, 3, 7, 11], [5, 8, 12, 19], [-2, 5, 9, 14], [0, 7, 10, 15], [-5, 2, 7, 10]] };

const BPM = 72;
const SIXTEENTH = 60 / BPM / 4;
const PAD_LEVEL = 0.1;              // about -20 dB under the effects
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const cents = (c) => Math.pow(2, c / 1200);
const rand = (a, b) => a + Math.random() * (b - a);

class Sound {
  constructor() {
    this.ctx = null;
    this.sfxOn = localStorage.getItem('strata.sfx') !== '0';
    this.musicOn = localStorage.getItem('strata.music') !== '0';
    this.key = KEYS.Dawn;
    this.chord = MAJOR.chords[0];
    this.progress = 0;
    this.chain = { step: 0, last: -9 };
    this.lastChisel = 0;
  }

  // Browsers only allow audio after a gesture: called on the first pointerdown.
  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended' && !document.hidden) this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (navigator.audioSession) navigator.audioSession.type = 'ambient';   // respect the iOS silent switch
    const ctx = this.ctx = new AC();

    // master: compressor then a soft limiter
    const limit = ctx.createDynamicsCompressor();
    limit.threshold.value = -3; limit.ratio.value = 20; limit.attack.value = 0.002; limit.release.value = 0.1;
    limit.connect(ctx.destination);
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.15;
    comp.connect(limit);
    this.out = ctx.createGain(); this.out.gain.value = 0.95; this.out.connect(comp);

    // a soft hall: decaying noise, darkened by a running average
    this.verb = ctx.createConvolver();
    const len = Math.floor(ctx.sampleRate * 2.4), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      let lp = 0;
      for (let i = 0; i < len; i++) {
        lp += ((Math.random() * 2 - 1) - lp) * 0.35;
        d[i] = lp * Math.exp(-i / (ctx.sampleRate * 0.55));
      }
    }
    this.verb.buffer = ir;
    this.verb.connect(this.out);

    // buses: dry clicks, tonal effects with a reverb send, and the bed
    this.dry = ctx.createGain(); this.dry.connect(this.out);
    this.tonal = ctx.createGain(); this.tonal.connect(this.out);
    const send = ctx.createGain(); send.gain.value = 0.22; this.tonal.connect(send); send.connect(this.verb);
    this.sfx = ctx.createGain(); this.sfx.gain.value = this.sfxOn ? 0.5 : 0;
    this.sfx.connect(this.dry);
    this.sfxTonal = ctx.createGain(); this.sfxTonal.gain.value = this.sfxOn ? 0.5 : 0;
    this.sfxTonal.connect(this.tonal);
    // the heavenly layer of long runs: mostly hall, a little dry
    this.heaven = ctx.createGain(); this.heaven.gain.value = this.sfxOn ? 0.5 : 0;
    const heavenWet = ctx.createGain(); heavenWet.gain.value = 0.9;
    this.heaven.connect(heavenWet); heavenWet.connect(this.verb);
    const heavenDry = ctx.createGain(); heavenDry.gain.value = 0.35;
    this.heaven.connect(heavenDry); heavenDry.connect(this.out);

    this.music = ctx.createGain(); this.music.gain.value = 0;
    this.duckGain = ctx.createGain(); this.duckGain.gain.value = 1;
    this.music.connect(this.duckGain);
    this.duckGain.connect(this.out);
    const msend = ctx.createGain(); msend.gain.value = 0.5; this.duckGain.connect(msend); msend.connect(this.verb);
    this.bright = ctx.createConstantSource(); this.bright.offset.value = 0; this.bright.start();
    this.voices = [];
    this.clock0 = ctx.currentTime;

    document.addEventListener('visibilitychange', () => { if (document.hidden) ctx.suspend(); else ctx.resume(); });
    this.startBed();
  }

  setKey(paletteName) {
    const k = KEYS[paletteName] ?? KEYS.Dawn;
    const changed = k !== this.key;
    this.key = k;
    this.progress = 0;
    this.chain.step = 0;
    if (changed && this.ctx) this.nextChord(true);
  }

  setSfx(on) {
    this.sfxOn = on; localStorage.setItem('strata.sfx', on ? '1' : '0');
    if (!this.ctx) return;
    for (const b of [this.sfx, this.sfxTonal, this.heaven]) b.gain.setTargetAtTime(on ? 0.5 : 0, this.ctx.currentTime, 0.05);
  }

  setMusic(on) {
    this.musicOn = on; localStorage.setItem('strata.music', on ? '1' : '0');
    if (this.music) this.music.gain.setTargetAtTime(on ? PAD_LEVEL : 0, this.ctx.currentTime, 0.6);
  }

  get mode() { return this.key.minor ? MINOR : MAJOR; }
  get now() { return this.ctx.currentTime; }

  nextSixteenth() {
    const n = Math.ceil((this.now - this.clock0) / SIXTEENTH + 0.02);
    return this.clock0 + n * SIXTEENTH;
  }

  // a scale degree (any integer, wraps into octaves) in the given register
  degree(d, base) {
    const s = this.mode.scale, o = Math.floor(d / s.length);
    return base + o * 12 + s[((d % s.length) + s.length) % s.length];
  }

  chordTones() { return this.chord.map((c) => ((c % 12) + 12) % 12).sort((a, b) => a - b); }

  // reward cues press the bed down for a moment
  duck(db = -4, release = 0.4) {
    if (!this.ctx) return;
    const g = this.duckGain.gain, t = this.now;
    g.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(Math.pow(10, db / 20), t + 0.03);
    g.setTargetAtTime(1, t + 0.05, release / 3);
  }

  // ------------------------------------------------------------ the bed

  startBed() {
    const ctx = this.ctx;
    this.music.gain.setTargetAtTime(this.musicOn ? PAD_LEVEL : 0, ctx.currentTime, 2);
    const drone = ctx.createOscillator(), dg = ctx.createGain();
    drone.type = 'sine'; dg.gain.value = 0.35;
    drone.connect(dg); dg.connect(this.music);
    drone.start();
    this.drone = drone;
    this.nextChord(true);
    const loop = () => { this.nextChord(false); setTimeout(loop, 11000 + Math.random() * 5000); };
    setTimeout(loop, 12000);
    const bells = () => {
      if (this.musicOn && !document.hidden) this.fmBell(this.degree(Math.floor(rand(0, 5)), this.key.root + 24), { dest: this.music, gain: 0.12, decay: 3.2, index: 1.2 });
      setTimeout(bells, 7000 + Math.random() * 9000);
    };
    setTimeout(bells, 5000);
  }

  nextChord(home) {
    const t = this.now, chords = this.mode.chords;
    let next = home ? chords[0] : chords[Math.floor(Math.random() * chords.length)];
    if (!home && next === this.chord) next = chords[(chords.indexOf(next) + 1) % chords.length];
    this.chord = next;
    this.drone.frequency.setTargetAtTime(hz(this.key.root - 12 + ((next[0] % 12) + 12) % 12), t, 2.5);
    for (const v of this.voices) {
      v.g.gain.cancelScheduledValues(t);
      v.g.gain.setTargetAtTime(0, t, 1.8);
      v.oscs.forEach((o) => o.stop(t + 9));
    }
    this.voices = next.map((semi, k) => this.padVoice(this.key.root + semi, k, t));
    if (this.progress > 0.35) this.voices.push(this.padVoice(this.key.root + next[next.length - 1] + 12, 4, t, 0.35 * this.progress));
  }

  padVoice(midi, k, t, level = 1) {
    const ctx = this.ctx;
    const g = ctx.createGain(); g.gain.value = 0;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 0.6;
    f.frequency.value = 600 + 900 * this.progress;
    this.bright.connect(f.frequency);
    const lfo = ctx.createOscillator(), lg = ctx.createGain();
    lfo.frequency.value = 0.05 + 0.04 * k; lg.gain.value = 180;
    lfo.connect(lg); lg.connect(f.frequency);
    const oscs = [lfo];
    for (const [type, det, amp] of [['sawtooth', -7, 0.22], ['sawtooth', 7, 0.22], ['sine', 0, 0.55]]) {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = type; o.frequency.value = hz(midi); o.detune.value = det + rand(-2, 2);
      og.gain.value = amp;
      o.connect(og); og.connect(f);
      oscs.push(o);
    }
    f.connect(g); g.connect(this.music);
    g.gain.setTargetAtTime((0.11 - k * 0.012) * level, t, 2.2);
    oscs.forEach((o) => o.start(t));
    return { g, f, oscs };
  }

  nudge(amount, time = 1.1) {
    if (!this.ctx) return;
    const p = this.bright.offset, t = this.now;
    p.cancelScheduledValues(t);
    p.setValueAtTime(p.value, t);
    p.linearRampToValueAtTime(amount, t + 0.05);
    p.setTargetAtTime(0, t + 0.08, time / 3);
  }

  setProgress(p) {
    this.progress = p;
    if (!this.ctx) return;
    for (const v of this.voices) v.f.frequency.setTargetAtTime(600 + 900 * p, this.now, 1.5);
  }

  // ------------------------------------------------------------ voices

  // simple tone: sine/triangle body with an optional glide in, and a partial
  tone(midi, { dest = this.sfxTonal, type = 'sine', at = 0, attack = 0.002, decay = 0.16, gain = 0.2, glideFrom = 0, glideTime = 0.012, glideTo = 0, partial = 0, partialGain = 0, detune = 0 } = {}) {
    const ctx = this.ctx, t = Math.max(at, this.now);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0005, t + attack + decay);
    g.connect(dest);
    const f0 = hz(midi) * cents(detune);
    for (const [mul, amp] of [[1, 1], [partial, partialGain]]) {
      if (!mul || !amp) continue;
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f0 * mul * cents(glideFrom), t);
      if (glideFrom) o.frequency.exponentialRampToValueAtTime(f0 * mul, t + glideTime);
      if (glideTo) o.frequency.exponentialRampToValueAtTime(f0 * mul * cents(glideTo), t + attack + glideTime);
      og.gain.value = amp;
      o.connect(og); og.connect(g);
      o.start(t); o.stop(t + attack + decay + 0.05);
    }
  }

  // FM bell: carrier with a modulator at an inharmonic ratio; the index decays,
  // so the strike is bright and the tail mellow
  fmBell(midi, { dest = this.sfxTonal, at = 0, ratio = 3.5, index = 3, indexEnd = 0.3, indexTime = 0.4, decay = 1.4, gain = 0.15, detune = 0 } = {}) {
    const ctx = this.ctx, t = Math.max(at, this.now);
    const f = hz(midi) * cents(detune);
    const car = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
    car.frequency.value = f; mod.frequency.value = f * ratio;
    mg.gain.setValueAtTime(f * index, t);
    mg.gain.exponentialRampToValueAtTime(Math.max(1, f * indexEnd), t + indexTime);
    mod.connect(mg); mg.connect(car.frequency);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0005, t + decay);
    car.connect(g); g.connect(dest);
    car.start(t); mod.start(t); car.stop(t + decay + 0.05); mod.stop(t + decay + 0.05);
  }

  noise({ dest = this.sfx, at = 0, dur = 0.01, gain = 0.1, freq = 3500, q = 1.5, type = 'bandpass', sweepTo = 0, attack = 0.001, pan = null } = {}) {
    const ctx = this.ctx, t = Math.max(at, this.now);
    const len = Math.max(1, Math.ceil(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
    src.connect(f); f.connect(g);
    if (pan && ctx.createStereoPanner) {
      const p = ctx.createStereoPanner();
      p.pan.setValueAtTime(pan[0], t); p.pan.linearRampToValueAtTime(pan[1], t + dur);
      g.connect(p); p.connect(dest);
    } else g.connect(dest);
    src.start(t);
  }

  // Karplus-Strong: a short burst of noise circulating through a damped delay
  pluckString(midi, { gain = 0.25, decay = 0.6 } = {}) {
    const ctx = this.ctx, sr = ctx.sampleRate;
    const n = Math.floor(sr * decay), period = Math.max(2, Math.round(sr / hz(midi)));
    const buf = ctx.createBuffer(1, n, sr), d = buf.getChannelData(0);
    for (let i = 0; i < period; i++) d[i] = Math.random() * 2 - 1;
    for (let i = period; i < n; i++) d[i] = 0.985 * 0.5 * (d[i - period] + d[i - period + 1 < i ? i - period + 1 : i - period]);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 3000;
    const g = ctx.createGain(); g.gain.value = gain;
    src.connect(f); f.connect(g); g.connect(this.sfxTonal);
    src.start();
  }

  // ------------------------------------------------------------ play

  // The core action: an instant layered tap. A dry stone chip, a tonal body
  // from the sounding chord, a faint FM sparkle. Quick runs climb the scale.
  chisel(progress) {
    if (!this.ctx) return;
    const t = this.now;
    this.setProgress(progress);
    this.nudge(220 + 480 * progress);
    if (t - this.lastChisel < 0.04) return;
    this.lastChisel = t;

    const c = this.chain;
    c.step = t - c.last < 0.7 ? c.step + 1 : 0;
    c.last = t;
    let midi;
    if (c.step === 0) {
      const tones = this.chordTones();
      midi = this.key.root + 24 + tones[Math.floor(Math.random() * tones.length)];
    } else {
      midi = this.degree(this.startDegree() + Math.min(c.step, 9), this.key.root + 24);
    }
    // once a run reaches the top it grows heavenly: h climbs 0 -> 1 over ~18 more chisels
    const h = Math.min(1, Math.max(0, (c.step - 9) / 18));
    this.noise({ dur: 0.01, gain: 0.32 * (1 - 0.35 * h), freq: 3500 * rand(0.85, 1.15), q: 1.5 });
    this.body(midi, 0.16 * (1 - 0.4 * h));
    this.fmBell(midi + 12, { gain: 0.016, index: 2, indexEnd: 0.05, indexTime: 0.05, decay: 0.22 });
    if (h > 0) this.heavenly(midi, h, c.step);
    if (c.step === 7) {
      this.fmBell(midi + 12, { at: this.nextSixteenth(), gain: 0.07, decay: 1.2 });
      this.nudge(900, 1.6);
    }
  }

  // The heavenly layer over a long run at the top: a detuned pair of sines an
  // octave up that drift between the sounding chord's tones (a choir-like
  // shimmer), slow attacks and long tails into the hall, and every eighth
  // chisel a soft wide chord swell. Grows with h (0..1).
  heavenly(midi, h, step) {
    const tones = this.chordTones();
    const halo = this.key.root + 36 + tones[step % tones.length] + (step % 3 === 0 ? 12 : 0);
    const attack = 0.02 + 0.05 * h, decay = 0.6 + 1.4 * h;
    for (const det of [-6, 6]) {
      this.tone(halo, { dest: this.heaven, type: 'sine', attack, decay, gain: 0.018 + 0.03 * h, detune: det });
    }
    this.tone(midi + 12, { dest: this.heaven, type: 'sine', attack: attack * 1.5, decay: decay * 0.8, gain: 0.012 * h, partial: 2, partialGain: 0.3 });
    this.nudge(300 + 700 * h, 2.2);
    if (step % 8 === 0) {
      const at = this.nextSixteenth();
      tones.forEach((t, k) => {
        this.tone(this.key.root + 36 + t, { dest: this.heaven, at: at + k * 0.04, type: 'sine', attack: 0.25, decay: 2.6, gain: 0.02 + 0.02 * h, detune: k % 2 ? 5 : -5 });
      });
    }
  }

  startDegree() {
    const s = this.mode.scale, root = ((this.chord[0] % 12) + 12) % 12;
    const i = s.indexOf(root);
    return i >= 0 ? i : 0;
  }

  // the tonal body, coloured per chapter but always short
  body(midi, gain) {
    const d = rand(-8, 8);
    const tb = this.key.timbre;
    if (tb === 'wood') this.tone(midi, { type: 'triangle', gain: gain * 1.1, decay: 0.12, glideFrom: 80, detune: d, partial: 4, partialGain: 0.1 });
    else if (tb === 'water') this.tone(midi, { type: 'sine', gain, decay: 0.2, glideFrom: 120, glideTime: 0.03, detune: d, partial: 2, partialGain: 0.25 });
    else if (tb === 'marimba') this.tone(midi, { type: 'sine', gain: gain * 1.1, decay: 0.18, glideFrom: 80, detune: d, partial: 4, partialGain: 0.3 });
    else if (tb === 'bell') this.fmBell(midi, { gain: gain * 0.8, index: 1.6, indexEnd: 0.2, indexTime: 0.15, decay: 0.35, detune: d });
    else this.tone(midi, { type: 'sine', gain, decay: 0.16, glideFrom: 80, detune: d, partial: 3, partialGain: 0.15 });
    this.tone(midi, { type: 'triangle', gain: gain * 0.35, decay: 0.1, detune: d });
  }

  mark(on) {
    if (!this.ctx) return;
    const midi = this.key.root + 24 + this.chordTones()[0] + 12;     // around 600-700 Hz
    this.noise({ dur: 0.003, gain: 0.18, freq: 2500, type: 'lowpass', q: 0.7 });
    if (on) this.tone(midi, { type: 'sine', gain: 0.07, decay: 0.06, partial: 2, partialGain: 0.2 });
    else this.tone(midi, { type: 'sine', gain: 0.05, decay: 0.07, glideTo: -500, glideTime: 0.04 });
  }

  protectedTap() {
    if (!this.ctx) return;
    this.noise({ dur: 0.006, gain: 0.12, freq: 1800, q: 2 });
    this.noise({ at: this.now + 0.055, dur: 0.006, gain: 0.1, freq: 1800, q: 2 });
  }

  mistake() {
    if (!this.ctx) return;
    this.chain.step = 0;
    this.chain.last = -9;
    this.duck(-4, 0.4);
    this.nudge(-380, 1.6);
    const midi = this.key.root + this.chordTones()[0] + 12;          // the root, an octave down from the taps
    const ctx = this.ctx, t = this.now, f = hz(midi);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.32, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.26);
    lp.connect(g); g.connect(this.sfxTonal);
    for (const [type, mul, amp] of [['triangle', 1, 1], ['sine', 2, 0.35]]) {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f * mul, t); o.frequency.exponentialRampToValueAtTime(f * mul * 0.8, t + 0.12);
      og.gain.value = amp; o.connect(og); og.connect(lp);
      o.start(t); o.stop(t + 0.3);
    }
    this.noise({ dur: 0.05, gain: 0.08, freq: 700, type: 'lowpass', q: 0.7 });
  }

  undo() {
    if (!this.ctx) return;
    const midi = this.key.root + 24 + this.chordTones()[1];
    this.tone(midi, { type: 'sine', attack: 0.03, decay: 0.12, gain: 0.09, glideTo: -300, glideTime: 0.08 });
  }

  peel() {
    if (!this.ctx) return;
    this.noise({ dest: this.sfxTonal, dur: 0.35, gain: 0.07, freq: 400, sweepTo: 3000, q: 2, attack: 0.12, pan: [-0.4, 0.4] });
  }

  // UI: a tiny dry tick
  ui() {
    if (!this.ctx) return;
    this.noise({ dur: 0.006, gain: 0.1, freq: 4000, q: 1.2 });
    this.tone(84 + rand(-0.3, 0.3), { type: 'sine', gain: 0.025, decay: 0.025 });
  }

  // a map stone: a plucked string, its note set by where it is on the path
  stone(index) {
    if (!this.ctx) return;
    this.pluckString(this.degree(index % 10, this.key.root + 24), { gain: 0.3, decay: 0.7 });
  }

  // the finale: resolve home, a bell run in 16ths, then an open add9 chord
  win() {
    if (!this.ctx) return;
    this.progress = 1;
    this.nextChord(true);
    this.nudge(1600, 4);
    this.duck(-6, 2.5);
    const t0 = this.now + 0.34, base = this.key.root + 24;
    [0, 1, 2, 3, 4, 5].forEach((d, k) => this.fmBell(this.degree(d, base), { at: t0 + k * SIXTEENTH, gain: 0.09, decay: 1.4, index: 2.5 }));
    const chordAt = t0 + 6 * SIXTEENTH;
    for (const semi of [0, 7, 14, 12 + this.mode.third]) {
      for (const det of [-4, 4]) this.tone(base + semi, { at: chordAt, type: 'sine', attack: 0.04, decay: 2.5, gain: 0.035, detune: det });
    }
    this.noise({ dest: this.sfxTonal, at: t0 - 0.04, dur: 1.2, gain: 0.04, freq: 600, sweepTo: 6000, q: 0.5, attack: 0.3 });
  }

  // score ticks climb the scale; the last lands on the tonic with a bell
  tick(k) {
    if (!this.ctx) return;
    this.tone(this.degree(Math.min(k, 14), this.key.root + 36), { type: 'sine', gain: 0.02, decay: 0.018, detune: k % 2 ? 5 : -5 });
  }

  tickDone() { if (this.ctx) this.fmBell(this.key.root + 48, { gain: 0.06, decay: 1.2, index: 2 }); }

  // stars: root, third, fifth, each with an octave shimmer; the third is the biggest
  star(k) {
    if (!this.ctx) return;
    this.duck(-4, 0.5);
    const base = this.key.root + 36;
    const midi = base + [0, this.mode.third, 7][k];
    const g = k === 2 ? 0.16 : 0.12;
    this.fmBell(midi, { gain: g, decay: 1.5 });
    this.tone(midi + 12, { type: 'sine', gain: g * 0.25, decay: 1.0, attack: 0.01, partial: 1.5, partialGain: 0.5 });
    if (k === 2) this.fmBell(midi + 12, { gain: 0.06, decay: 1.6, at: this.now + 0.05 });
  }

  best() {
    if (!this.ctx) return;
    this.duck(-6, 0.6);
    const ctx = this.ctx, t = this.now;
    const o = ctx.createOscillator(), g = ctx.createGain(), sh = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) { const x = i / 128 - 1; curve[i] = Math.tanh(2.5 * x); }
    sh.curve = curve;
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(70, t + 0.08);
    g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.0005, t + 0.18);
    o.connect(sh); sh.connect(g); g.connect(this.sfx);
    o.start(t); o.stop(t + 0.2);
    this.noise({ dur: 0.025, gain: 0.1, freq: 1500, type: 'lowpass', q: 0.7 });
    const base = this.key.root + 36;
    for (const s of [0, 7, 12]) this.fmBell(base + s, { at: t + 0.06, gain: 0.05, decay: 1.6 });
  }
}

export const sound = new Sound();
