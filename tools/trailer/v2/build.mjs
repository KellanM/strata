// Assembles a v2 cut: the frame-stepped picture + the game's real-time sound +
// the offline ad SFX, mixed and loudness-normalised for phones (two-pass
// loudnorm to −15 LUFS, true peak ≤ −1.5 dB), H.264 CRF 18 + AAC 48 kHz,
// faststart. Also writes review contact sheets at 5 fps (6×4 frames a sheet,
// timestamped) and, for the trailer, the poster frame.
//
//   node tools/trailer/v2/build.mjs trailer|ad
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, statSync, readdirSync, rmSync, existsSync, copyFileSync } from 'node:fs';
import { CUTS } from './timeline.mjs';
import { renderSfx, writeWav } from './sfx.mjs';

const CUT = process.argv[2] ?? 'trailer';
const { cues, duration } = CUTS[CUT]();
const W = 'trailer/v2/work', OUT = 'trailer/v2';
const name = CUT === 'ad' ? 'strata-ad-15s' : 'strata-trailer-25s';
const D = duration.toFixed(2);
const ff = (args) => execFileSync('ffmpeg', ['-y', '-hide_banner', '-v', 'error', ...args], { stdio: 'inherit' });

// 1. ad SFX
writeWav(`${W}/${CUT}-sfx.wav`, renderSfx(cues, duration));

// 2. the game's sound: MediaRecorder starts ~0.16 s after 'start' (v1, measured), so advance it
const AUDIO_LEAD = '0.16';
ff(['-ss', AUDIO_LEAD, '-i', `${W}/${CUT}-audio.webm`, '-t', D, '-ar', '48000', '-ac', '2', `${W}/${CUT}-game.wav`]);

// 3. mix, then two-pass loudness
const mix = `[0:a]volume=1.0[g];[1:a]volume=${process.env.SFX_GAIN ?? 0.35}[s];[g][s]amix=inputs=2:normalize=0:duration=first,` +
  `afade=t=in:st=0:d=0.03,afade=t=out:st=${(duration - 0.7).toFixed(2)}:d=0.7`;
ff(['-i', `${W}/${CUT}-game.wav`, '-i', `${W}/${CUT}-sfx.wav`, '-filter_complex', mix, '-t', D, '-ar', '48000', `${W}/${CUT}-mix.wav`]);
// (loudnorm prints its measurement as JSON on stderr)
const measured = spawnSync('ffmpeg', ['-hide_banner', '-i', `${W}/${CUT}-mix.wav`, '-af', 'loudnorm=I=-15:TP=-2:LRA=11:print_format=json', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
const json = JSON.parse(measured.match(/\{[\s\S]*\}/)[0]);
ff(['-i', `${W}/${CUT}-mix.wav`, '-af',
  `loudnorm=I=-15:TP=-2:LRA=11:measured_I=${json.input_i}:measured_TP=${json.input_tp}:measured_LRA=${json.input_lra}:measured_thresh=${json.input_thresh}:offset=${json.target_offset}:linear=true,alimiter=limit=0.79:level=false`,
  '-ar', '48000', `${W}/${CUT}-final.wav`]);

// 4. picture + sound
ff(['-i', `${W}/${CUT}-video.mp4`, '-i', `${W}/${CUT}-final.wav`, '-t', D,
  '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '18', '-maxrate', '6800k', '-bufsize', '13600k', '-pix_fmt', 'yuv420p', '-r', '30',
  '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', `${OUT}/${name}.mp4`]);

// 5. poster (trailer: the end card) and contact sheets
if (CUT === 'trailer') ff(['-ss', '24.2', '-i', `${OUT}/${name}.mp4`, '-frames:v', '1', `${OUT}/poster.png`]);
const sheets = `${OUT}/contact`;
mkdirSync(sheets, { recursive: true });
for (const f of readdirSync(sheets)) if (f.startsWith(CUT + '-')) rmSync(`${sheets}/${f}`);
if (!existsSync(`${W}/font.ttf`)) copyFileSync(process.env.SHEET_FONT ?? 'C:/Windows/Fonts/arial.ttf', `${W}/font.ttf`);
ff(['-i', `${OUT}/${name}.mp4`, '-vf',
  "fps=5,scale=216:384,drawtext=fontfile=trailer/v2/work/font.ttf:text='%{pts\\:hms}':x=4:y=4:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.5,tile=6x4",
  `${sheets}/${CUT}-%d.png`]);

// 6. measure what was delivered
const r128 = spawnSync('ffmpeg', ['-hide_banner', '-i', `${OUT}/${name}.mp4`, '-vn', '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
const sum = r128.slice(r128.lastIndexOf('Summary:'));
const I = sum.match(/I:\s+(-?[\d.]+) LUFS/)?.[1], TP = sum.match(/Peak:\s+(-?[\d.]+) dBFS/)?.[1];
console.log(`${OUT}/${name}.mp4  ${(statSync(`${OUT}/${name}.mp4`).size / 1048576).toFixed(2)} MB  ${D} s  ${I} LUFS  TP ${TP} dBFS`);
