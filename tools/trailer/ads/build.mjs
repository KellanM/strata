// Renders and assembles the hook-study ads (ads.mjs). For each ad: capture every
// video track (frame-stepped) and audio track (real time) with the v2 tools,
// then compose the picture (single / hstack / vstack → full-frame), lay the
// overlay track (type and end card, with alpha) on top, blur the panels under
// the end card, and mix the tracks' game sound with the ad SFX. Encoding and
// loudness match v2: H.264 CRF 18 (≤ 6.8 Mb/s), AAC 48 kHz, faststart,
// two-pass loudnorm to −15 LUFS with true peak ≤ −2 dB.
//
//   node tools/trailer/ads/build.mjs [slug ...]          (server on PORT; all ads if none given)
//   SKIP_CAPTURE=1 …                                     rebuild from existing captures
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, statSync, readdirSync, rmSync, existsSync, copyFileSync } from 'node:fs';
import { ADS, TRACKS } from './ads.mjs';
import { renderSfx, writeWav } from '../v2/sfx.mjs';

const W = 'trailer/ads/work', OUT = 'trailer/ads';
mkdirSync(W, { recursive: true });
mkdirSync(`${OUT}/contact`, { recursive: true });
const ff = (args) => execFileSync('ffmpeg', ['-y', '-hide_banner', '-v', 'error', ...args], { stdio: 'inherit' });
const node = (...args) => execFileSync('node', args, { stdio: 'inherit' });
const videoOf = (t) => `${W}/${t}.${TRACKS[t]().mode === 'overlay' ? 'mov' : 'mp4'}`;

for (const slug of process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(ADS)) {
  const ad = ADS[slug], D = ad.duration.toFixed(2);
  console.log(`\n== ${slug}`);

  // 1. captures
  if (!process.env.SKIP_CAPTURE) {
    for (const t of ad.video) node('tools/trailer/v2/capture-video.mjs', t, videoOf(t));
    for (const t of ad.audio) node('tools/trailer/v2/capture-audio.mjs', t, `${W}/${t}-audio.webm`);
  }

  // 2. sound: each track's game audio (MediaRecorder lead 0.16 s, as v2) + the ad SFX, then loudness
  writeWav(`${W}/${slug}-sfx.wav`, renderSfx(TRACKS[ad.sfx]().cues, ad.duration));
  const ins = [];
  for (const t of ad.audio) {
    ff(['-ss', '0.16', '-i', `${W}/${t}-audio.webm`, '-t', D, '-ar', '48000', '-ac', '2', `${W}/${t}-game.wav`]);
    ins.push('-i', `${W}/${t}-game.wav`);
  }
  ins.push('-i', `${W}/${slug}-sfx.wav`);
  const n = ad.audio.length;
  const mixGraph = `[${n}:a]volume=${process.env.SFX_GAIN ?? ad.sfxGain ?? 0.35}[s];` +
    ad.audio.map((_, k) => `[${k}:a]`).join('') + `[s]amix=inputs=${n + 1}:normalize=0:duration=first,` +
    `afade=t=in:st=0:d=0.03,afade=t=out:st=${(ad.duration - 0.7).toFixed(2)}:d=0.7`;
  ff([...ins, '-filter_complex', mixGraph, '-t', D, '-ar', '48000', `${W}/${slug}-mix.wav`]);
  const measured = spawnSync('ffmpeg', ['-hide_banner', '-i', `${W}/${slug}-mix.wav`, '-af', 'loudnorm=I=-15:TP=-2:LRA=11:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const j = JSON.parse(measured.match(/\{[\s\S]*\}/)[0]);
  ff(['-i', `${W}/${slug}-mix.wav`, '-af',
    `loudnorm=I=-15:TP=-2:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true,alimiter=limit=0.79:level=false`,
    '-ar', '48000', `${W}/${slug}-final.wav`]);

  // 3. picture
  const c = ad.compose, vin = [], graph = [];
  const input = (t) => { vin.push('-i', videoOf(t)); return vin.length / 2 - 1; };
  // the panels behind the end card blur and dim, fading in with it
  const endBlur = (from, at) => `[${from}]split[pa][pb];[pb]boxblur=22:2,eq=brightness=-0.1,format=yuva420p,fade=t=in:st=${at}:d=0.5:alpha=1[pbb];[pa][pbb]overlay[bg]`;
  if (c.kind === 'single') {
    const a = input(ad.video[0]);
    graph.push(`[${a}:v]null[out]`);
  } else if (c.kind === 'hstack') {
    const ids = c.panels.map(input), o = input(c.overlay);
    graph.push(ids.map((k) => `[${k}:v]`).join('') + `hstack=inputs=${ids.length}[base]`, endBlur('base', c.blurAt), `[bg][${o}:v]overlay=format=auto[out]`);
  } else if (c.kind === 'vstack-then-full') {
    const top = input(c.top), bot = input(c.bottom), full = input(c.full), o = input(c.overlay);
    const T = 0.45, off = (c.at - T / 2).toFixed(3);
    // the full-frame capture plays the same script, so from the wipe on it continues the bottom panel's solve
    graph.push(`[${top}:v][${bot}:v]vstack[split]`, `[${full}:v]trim=start=${off},setpts=PTS-STARTPTS[f]`,
      `[split][f]xfade=transition=wipeup:duration=${T}:offset=${off}[base]`, endBlur('base', c.blurAt), `[bg][${o}:v]overlay=format=auto[out]`);
  }
  ff([...vin, '-i', `${W}/${slug}-final.wav`, '-filter_complex', graph.join(';'), '-map', '[out]', '-map', `${vin.length / 2}:a`, '-t', D,
    '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '18', '-maxrate', '6800k', '-bufsize', '13600k', '-pix_fmt', 'yuv420p', '-r', '30',
    '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', `${OUT}/${slug}.mp4`]);

  // 4. contact sheets (5 fps, 6×4, timestamped)
  for (const f of readdirSync(`${OUT}/contact`)) if (f.startsWith(slug + '-')) rmSync(`${OUT}/contact/${f}`);
  if (!existsSync(`${W}/font.ttf`)) copyFileSync(process.env.SHEET_FONT ?? 'C:/Windows/Fonts/arial.ttf', `${W}/font.ttf`);
  ff(['-i', `${OUT}/${slug}.mp4`, '-vf',
    `fps=5,scale=216:384,drawtext=fontfile=${W}/font.ttf:text='%{pts\\:hms}':x=4:y=4:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.5,tile=6x4`,
    `${OUT}/contact/${slug}-%d.png`]);

  // 5. what was delivered
  const r = spawnSync('ffmpeg', ['-hide_banner', '-i', `${OUT}/${slug}.mp4`, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const sum = r.slice(r.lastIndexOf('Summary:'));
  console.log(`${OUT}/${slug}.mp4  ${(statSync(`${OUT}/${slug}.mp4`).size / 1048576).toFixed(2)} MB  ${D} s  ` +
    `${sum.match(/I:\s+(-?[\d.]+) LUFS/)?.[1]} LUFS  TP ${sum.match(/Peak:\s+(-?[\d.]+) dBFS/)?.[1]} dBFS`);
}
