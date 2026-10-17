// Sound: a soft evolving bed of chords in each chapter's key, and play that
// lives inside it. Chisel notes are picked from the chord that is sounding, so
// they always agree with the music; each break brightens the pad a little and
// the pad opens up as the shape emerges. Everything is synthesised (WebAudio),
// no files. After Monument Valley 2's in-key navigation pings, per-phase
// stings and per-chapter sound (Todd Baker), used sparingly.

const KEYS = {
  // root (MIDI, pad register), scale, chord voicings (semitones from root), pluck timbre
  Dawn:   { root: 50, minor: false, timbre: 'glass' },   // D
  Mint:   { root: 53, minor: false, timbre: 'wood' },    // F
  Lagoon: { root: 45, minor: false, timbre: 'water' },   // A
  Dusk:   { root: 52, minor: true, timbre: 'marimba' },  // E
  Night:  { root: 49, minor: true, timbre: 'bell' },     // C#
};
const MAJOR = { scale: [0, 2, 4, 7, 9], chords: [[0, 4, 7, 14], [5, 9, 12, 19], [-3, 4, 7, 12], [7, 11, 14, 21], [0, 7, 11, 16], [-7, 2, 9, 12]] };
const MINOR = { scale: [0, 3, 5, 7, 10], chords: [[0, 3, 7, 14], [-4, 3, 7, 11], [5, 8, 12, 19], [-2, 5, 9, 14], [0, 7, 10, 15], [-5, 2, 7, 10]] };

const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

class Sound {
  constructor() {
    this.ctx = null;
    this.sfxOn = localStorage.getItem('strata.sfx') !== '0';
    this.musicOn = localStorage.getItem('strata.music') !== '0';
    this.key = KEYS.Dawn;
    this.chord = [0, 4, 7, 14];
    this.progress = 0;
    this.lastPluck = 0;
    this.lastNote = -1;
  }

  // Browsers only allow audio after a gesture: call from the first pointerdown.
  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended' && !document.hidden) this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (navigator.audioSession) navigator.audioSession.type = 'ambient';   // respect the iOS silent switch
    const ctx = this.ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.3;
    comp.connect(ctx.destination);
    this.out = ctx.createGain(); this.out.gain.value = 0.9; this.out.connect(comp);

    // a long soft hall, generated
    this.verb = ctx.createConvolver();
    const len = ctx.sampleRate * 4.5, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    this.verb.buffer = ir;
    this.verbIn = ctx.createGain(); this.verbIn.gain.value = 0.55;
    this.verbIn.connect(this.verb); this.verb.connect(this.out);

    this.sfx = ctx.createGain(); this.sfx.gain.value = this.sfxOn ? 1 : 0;
    this.sfx.connect(this.out); this.sfx.connect(this.verbIn);

    // the bed: pad voices share a brightness control that play pushes around
    this.music = ctx.createGain(); this.music.gain.value = 0;
    this.music.connect(this.out); this.music.connect(this.verbIn);
    this.bright = ctx.createConstantSource(); this.bright.offset.value = 0; this.bright.start();
    this.voices = [];
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) ctx.suspend(); else ctx.resume();
    });
    this.startBed();
  }

  setKey(paletteName) {
    const k = KEYS[paletteName] ?? KEYS.Dawn;
    const changed = k !== this.key;
    this.key = k;
    this.progress = 0;
    if (changed && this.ctx) this.nextChord(true);
  }

  setSfx(on) { this.sfxOn = on; localStorage.setItem('strata.sfx', on ? '1' : '0'); if (this.sfx) this.sfx.gain.setTargetAtTime(on ? 1 : 0, this.ctx.currentTime, 0.05); }
  setMusic(on) { this.musicOn = on; localStorage.setItem('strata.music', on ? '1' : '0'); if (this.music) this.music.gain.setTargetAtTime(on ? 0.16 : 0, this.ctx.currentTime, 0.6); }

  get mode() { return this.key.minor ? MINOR : MAJOR; }

  // ------------------------------------------------------------ the bed

  startBed() {
    const ctx = this.ctx;
    this.music.gain.setTargetAtTime(this.musicOn ? 0.16 : 0, ctx.currentTime, 2);
    // drone an octave under the root
    const drone = ctx.createOscillator(), dg = ctx.createGain();
    drone.type = 'sine'; dg.gain.value = 0.35;
    drone.connect(dg); dg.connect(this.music);
    drone.start();
    this.drone = drone;
    this.nextChord(true);
    const loop = () => {
      this.nextChord(false);
      this.chordTimer = setTimeout(loop, 11000 + Math.random() * 5000);
    };
    this.chordTimer = setTimeout(loop, 12000);
    const bells = () => {
      if (this.musicOn && !document.hidden) this.bell();
      setTimeout(bells, 7000 + Math.random() * 9000);
    };
    setTimeout(bells, 5000);
  }

  nextChord(home) {
    const ctx = this.ctx, t = ctx.currentTime;
    const chords = this.mode.chords;
    let next = home ? chords[0] : chords[Math.floor(Math.random() * chords.length)];
    if (!home && next === this.chord) next = chords[(chords.indexOf(next) + 1) % chords.length];
    this.chord = next;
    this.drone.frequency.setTargetAtTime(hz(this.key.root - 12 + (next[0] < 0 ? next[0] + 12 : next[0]) % 12), t, 2.5);

    // fade the old voices out slowly, bring the new ones in
    for (const v of this.voices) {
      v.g.gain.cancelScheduledValues(t);
      v.g.gain.setTargetAtTime(0, t, 1.8);
      v.oscs.forEach((o) => o.stop(t + 9));
    }
    this.voices = next.map((semi, k) => this.padVoice(this.key.root + semi, k, t));
    // as the shape emerges an upper voice joins
    if (this.progress > 0.35) this.voices.push(this.padVoice(this.key.root + next[next.length - 1] + 12, 4, t, 0.35 * this.progress));
  }

  padVoice(midi, k, t, level = 1) {
    const ctx = this.ctx;
    const g = ctx.createGain(); g.gain.value = 0;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 0.6;
    f.frequency.value = 520 + 900 * this.progress;
    this.bright.connect(f.frequency);
    const lfo = ctx.createOscillator(), lg = ctx.createGain();
    lfo.frequency.value = 0.05 + 0.04 * k; lg.gain.value = 180;
    lfo.connect(lg); lg.connect(f.frequency);
    const oscs = [lfo];
    for (const [type, det, amp] of [['triangle', -5, 0.6], ['sawtooth', 6, 0.12], ['sine', 0, 0.5]]) {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = type; o.frequency.value = hz(midi); o.detune.value = det + (Math.random() - 0.5) * 4;
      og.gain.value = amp;
      o.connect(og); og.connect(f);
      oscs.push(o);
    }
    f.connect(g); g.connect(this.music);
    const peak = (0.11 - k * 0.012) * level;
    g.gain.setTargetAtTime(peak, t, 2.2);
    oscs.forEach((o) => o.start(t));
    return { g, f, oscs };
  }

  bell() {
    const s = this.mode.scale;
    const m = this.key.root + 24 + s[Math.floor(Math.random() * s.length)];
    this.tone(m, { dest: this.music, type: 'sine', attack: 0.01, decay: 3.2, gain: 0.1, partial: 2.76, partialGain: 0.25 });
  }

  // pushes the pad's filter: up to brighten, down to darken, easing back
  nudge(amount, time = 1.1) {
    if (!this.ctx) return;
    const p = this.bright.offset, t = this.ctx.currentTime;
    p.cancelScheduledValues(t);
    p.setValueAtTime(p.value, t);
    p.linearRampToValueAtTime(amount, t + 0.05);
    p.setTargetAtTime(0, t + 0.08, time / 3);
  }

  setProgress(p) {
    this.progress = p;
    if (!this.ctx) return;
    // the sounding voices open up gradually as the shape emerges
    const t = this.ctx.currentTime;
    for (const v of this.voices) v.f.frequency.setTargetAtTime(520 + 900 * p, t, 1.5);
  }

  // ------------------------------------------------------------ play

  tone(midi, { dest = this.sfx, type = 'sine', attack = 0.004, decay = 0.6, gain = 0.2, partial = 2, partialGain = 0.3, bend = 0, when = 0 } = {}) {
    const ctx = this.ctx, t = ctx.currentTime + when;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0008, t + attack + decay);
    g.connect(dest);
    for (const [mul, amp] of [[1, 1], [partial, partialGain]]) {
      if (!amp) continue;
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(hz(midi) * mul, t);
      if (bend) o.frequency.exponentialRampToValueAtTime(hz(midi) * mul * Math.pow(2, bend / 12), t + decay * 0.5);
      og.gain.value = amp;
      o.connect(og); og.connect(g);
      o.start(t); o.stop(t + attack + decay + 0.05);
    }
  }

  noise({ when = 0, dur = 0.08, gain = 0.08, freq = 2400, q = 1.2, type = 'bandpass', sweepTo = 0 } = {}) {
    const ctx = this.ctx, t = ctx.currentTime + when;
    const len = Math.ceil(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
    const g = ctx.createGain(); g.gain.value = gain;
    src.connect(f); f.connect(g); g.connect(this.sfx);
    src.start(t);
  }

  // a note from the sounding chord (or the scale), in the pluck register
  chordNote(octave = 24, spread = true) {
    const pool = spread && Math.random() < 0.35 ? this.mode.scale : this.chord.map((c) => ((c % 12) + 12) % 12);
    let m;
    for (let tries = 0; tries < 4; tries++) {
      m = this.key.root + octave + pool[Math.floor(Math.random() * pool.length)] + (Math.random() < 0.3 ? 12 : 0);
      if (m !== this.lastNote) break;
    }
    this.lastNote = m;
    return m;
  }

  pluck(m, gain = 0.16) {
    const tb = this.key.timbre;
    if (tb === 'glass') this.tone(m, { type: 'sine', decay: 1.1, gain, partial: 3, partialGain: 0.18 });
    else if (tb === 'wood') this.tone(m, { type: 'triangle', decay: 0.45, gain: gain * 1.1, partial: 4, partialGain: 0.12 });
    else if (tb === 'water') this.tone(m, { type: 'sine', decay: 0.9, gain, partial: 2, partialGain: 0.2, bend: -0.6 });
    else if (tb === 'marimba') this.tone(m, { type: 'sine', decay: 0.55, gain: gain * 1.1, partial: 4, partialGain: 0.35 });
    else this.tone(m, { type: 'sine', decay: 1.6, gain: gain * 0.9, partial: 2.76, partialGain: 0.4 });
  }

  chisel(progress) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.setProgress(progress);
    this.nudge(260 + 500 * progress);
    if (now - this.lastPluck < 0.045) return;     // fast runs stay musical, not a machine gun
    this.lastPluck = now;
    this.noise({ dur: 0.05, gain: 0.05, freq: 3200 + Math.random() * 1500 });   // the chip of stone
    this.pluck(this.chordNote());
  }

  mark(on) {
    if (!this.ctx) return;
    this.pluck(this.key.root + 36 + (this.chord[on ? 2 : 1] % 12), on ? 0.1 : 0.07);
  }

  mistake() {
    if (!this.ctx) return;
    this.nudge(-380, 1.6);
    this.tone(this.key.root - 5, { type: 'sine', decay: 0.4, gain: 0.32, partial: 0, partialGain: 0, bend: -5 });
    this.noise({ dur: 0.16, gain: 0.12, freq: 260, q: 0.8, type: 'lowpass' });
  }

  protectedTap() { if (this.ctx) this.noise({ dur: 0.04, gain: 0.05, freq: 900, q: 2 }); }

  undo() { if (this.ctx) this.tone(this.chordNote(24, false), { type: 'sine', decay: 0.35, gain: 0.08, partial: 0, bend: -2 }); }

  rowDone() {
    if (!this.ctx) return;
    this.nudge(700, 1.6);
    const c = this.chord.map((s) => ((s % 12) + 12) % 12).sort((a, b) => a - b);
    c.slice(0, 3).forEach((s, k) => this.tone(this.key.root + 24 + s + (k === 2 ? 12 : 0), { type: 'sine', decay: 1.2, gain: 0.09, partial: 2, partialGain: 0.15, when: k * 0.07 }));
  }

  peel() { if (this.ctx) this.noise({ dur: 0.3, gain: 0.05, freq: 500, sweepTo: 2400, q: 0.7 }); }

  // the finale: resolve home, swell, and a rising run across two octaves
  win() {
    if (!this.ctx) return;
    this.progress = 1;
    this.nextChord(true);
    this.nudge(1600, 4);
    const s = this.mode.scale;
    const run = [];
    for (let o = 0; o < 2; o++) for (const d of s) run.push(this.key.root + 24 + o * 12 + d);
    run.push(this.key.root + 48);
    run.forEach((m, k) => this.tone(m, { type: 'sine', decay: 1.6, gain: 0.08 + k * 0.004, partial: 2, partialGain: 0.2, when: 0.34 + k * 0.075 }));
    this.noise({ when: 0.3, dur: 1.4, gain: 0.05, freq: 600, sweepTo: 6000, q: 0.5 });
  }

  tick(k) { if (this.ctx) this.tone(this.key.root + 36 + this.mode.scale[k % 5], { type: 'sine', decay: 0.12, gain: 0.03, partial: 0 }); }

  star(k) {
    if (!this.ctx) return;
    // root, third, octave: each star a step up the chord
    const m = this.key.root + 36 + [0, this.mode.scale[2], 12][k];
    this.tone(m, { type: 'sine', decay: 1.8, gain: 0.13, partial: 2.76, partialGain: 0.3 });
    this.tone(m + 7, { type: 'sine', decay: 1.4, gain: 0.05, partial: 0, when: 0.04 });
  }

  best() { if (this.ctx) { this.noise({ dur: 0.06, gain: 0.06, freq: 700, q: 1 }); this.tone(this.key.root + 48, { type: 'sine', decay: 2.2, gain: 0.07, partial: 3, partialGain: 0.2 }); } }
}

export const sound = new Sound();
