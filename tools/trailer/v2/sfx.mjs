// Offline ad SFX for the v2 cuts, synthesised in plain JS and written as a
// 48 kHz stereo WAV that build.mjs mixes under the game's own sound:
//   whoosh  filtered noise swept up and down, peaking on the cut, panned with the whip
//   impact  a sub drop + soft noise thump on a reveal
//   boom    a bigger, longer impact for the end card
//   riser   noise + a sine climbing into the next beat
//   count   quick rising ticks under the 100+ counter
//   pop     a bright blip as PLAY NOW lands
import { writeFileSync } from 'node:fs';

const SR = 48000;

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1; }

// Chamberlin state-variable band-pass, cutoff/q may change per sample
function svf() {
  let low = 0, band = 0;
  return (x, fc, q) => {
    const f = 2 * Math.sin(Math.PI * Math.min(fc, SR / 6) / SR);
    low += f * band;
    const high = x - low - band / q;
    band += f * high;
    return { low, band, high };
  };
}

export function renderSfx(cues, duration) {
  const n = Math.ceil((duration + 2) * SR);
  const L = new Float32Array(n), R = new Float32Array(n);
  const put = (i, v, pan = 0) => {
    if (i < 0 || i >= n) return;
    L[i] += v * Math.cos((pan + 1) * Math.PI / 4) * Math.SQRT2;
    R[i] += v * Math.sin((pan + 1) * Math.PI / 4) * Math.SQRT2;
  };
  let seed = 7;
  for (const c of cues) {
    const at = Math.round(c.t * SR);
    const noise = rng(seed++);
    if (c.kind === 'whoosh') {
      // w: pitch (scales the sweep), len (scales the length), gain, q (narrower = more whistle)
      const [dir = 1, dur = 0.3, w = {}] = c.args;
      const { pitch = 1, len: lk = 1, gain = 1, q = 1.4 } = w;
      const len = (dur + 0.22) * lk, pre = len * 0.62;     // most of it before the cut
      const lo = 500 * pitch, span = 4800 * pitch;
      const f = svf();
      for (let k = 0, m = Math.round(len * SR); k < m; k++) {
        const t = k / SR, x = (t - pre) / pre;               // -1 → 0 at the cut → +
        const env = t < pre ? Math.pow(t / pre, 2.2) : Math.exp(-(t - pre) / (0.07 * lk));
        const fc = lo + span * Math.max(0, 1 - Math.abs(x) * 0.9);
        const y = f(noise(), fc, q).band;
        put(at - Math.round(pre * SR) + k, y * env * 0.5 * gain * Math.sqrt(q / 1.4), Math.max(-0.8, Math.min(0.8, dir * x * 0.8)));
      }
    } else if (c.kind === 'impact' || c.kind === 'boom') {
      const big = c.kind === 'boom', g = c.args[0] ?? 1;
      const len = big ? 2.2 : 0.9, f = svf();
      let ph = 0;
      for (let k = 0, m = Math.round(len * SR); k < m; k++) {
        const t = k / SR;
        const hz = (big ? 38 : 50) + (big ? 70 : 60) * Math.exp(-t / 0.05);
        ph += 2 * Math.PI * hz / SR;
        const sub = Math.sin(ph) * Math.exp(-t / (big ? 0.7 : 0.28)) * Math.min(1, t / 0.003);
        const thump = f(noise(), big ? 900 : 1400, 0.7).low * Math.exp(-t / (big ? 0.12 : 0.06));
        const v = (sub * 0.75 + thump * 0.9) * g * (big ? 0.8 : 0.65);
        put(at + k, v, 0);
      }
    } else if (c.kind === 'riser') {
      const [len = 1, gain = 1] = c.args;
      const f = svf();
      let ph = 0;
      for (let k = 0, m = Math.round(len * SR); k < m; k++) {
        const t = k / SR, u = t / len;
        const env = Math.pow(u, 2.4);
        const y = f(noise(), 300 + 7000 * u * u, 2.5).band;
        ph += 2 * Math.PI * (180 * Math.pow(5, u)) / SR;
        const tone = (Math.sin(ph) + 0.35 * Math.sin(ph * 2.01)) * 0.12;
        put(at + k, (y * 0.45 + tone) * env * gain, Math.sin(t * 9) * 0.3 * u);
      }
    } else if (c.kind === 'count') {
      const [len = 1] = c.args;
      let t = 0, i = 0;
      while (t < len) {
        const hz = 900 + 900 * (t / len);
        for (let k = 0, m = Math.round(0.03 * SR); k < m; k++) {
          const s = k / SR;
          put(at + Math.round(t * SR) + k, Math.sin(2 * Math.PI * hz * s) * Math.exp(-s / 0.008) * 0.16, (i % 2 ? 0.25 : -0.25));
        }
        t += 0.06 - 0.03 * (t / len); i++;
      }
    } else if (c.kind === 'pop') {
      let ph = 0;
      for (let k = 0, m = Math.round(0.25 * SR); k < m; k++) {
        const t = k / SR;
        ph += 2 * Math.PI * (880 + 600 * Math.min(1, t / 0.04)) / SR;
        put(at + k, (Math.sin(ph) + 0.3 * Math.sin(ph * 3)) * Math.exp(-t / 0.06) * 0.18 * Math.min(1, t / 0.002), 0);
      }
    }
  }
  return { L, R };
}

export function writeWav(path, { L, R }) {
  const n = L.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
  }
  writeFileSync(path, buf);
}
