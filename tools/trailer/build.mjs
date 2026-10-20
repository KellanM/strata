// Assembles the trailer: the frame-stepped picture + the real-time sound, with
// gentle fades and loudness for phones (≈ −16 LUFS; a timeline may set LUFS), with a
// limiter after it, as loudnorm can let a peak through (v3's trailer hit −0.3 dB). Also writes a silent
// autoplay cut, a poster frame and a 1 fps contact sheet for review.
//
//   TRAILER=v2 node tools/trailer/build.mjs      (TRAILER unset: v1's file names)
import { execFileSync } from 'node:child_process';
import { T, OUT } from './lib.mjs';

const { DURATION, POSTER = 16.8, AUDIO_LEAD: LEAD = 0.16, LUFS = -16, SHEET_FPS = 1, FADE_OUT = 0.6 } = T;
const run = (args) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...args], { stdio: 'inherit' });
const D = DURATION.toFixed(2);
const fadeOut = (DURATION - 1.8).toFixed(2);
// MediaRecorder starts capturing ~0.16 s after it reports 'start' (measured from chisel
// onsets against their frames), so the sound is advanced by that much
const AUDIO_LEAD = String(process.env.AUDIO_LEAD ?? LEAD);
const f = {
  video: OUT('video') + '.mp4', audio: OUT('audio') + '.webm', wav: OUT('audio-final') + '.wav',
  mp4: OUT('strata-trailer') + '.mp4', silent: OUT('strata-trailer') + '-silent.mp4',
  poster: OUT('poster') + '.png', sheet: OUT('contact-sheet') + '.png',
};

// sound: decode, trim to length, fade, normalise
run(['-ss', AUDIO_LEAD, '-i', f.audio, '-t', D, '-af',
  `afade=t=in:st=0:d=0.25,afade=t=out:st=${fadeOut}:d=1.8,loudnorm=I=${LUFS}:TP=-1.5:LRA=11,alimiter=limit=0.84:level=false`,
  '-ar', '48000', '-ac', '2', f.wav]);

// picture + sound
run(['-i', f.video, '-i', f.wav, '-t', D,
  '-vf', FADE_OUT ? `fade=t=out:st=${(DURATION - FADE_OUT).toFixed(2)}:d=${FADE_OUT}` : 'null',   // a timeline may hold its last frame (FADE_OUT = 0)
  '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '21', '-pix_fmt', 'yuv420p', '-r', '30',
  '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', '-shortest', f.mp4]);

// silent autoplay cut
run(['-i', f.mp4, '-an', '-c:v', 'copy', '-movflags', '+faststart', f.silent]);

// poster: the payoff frame
run(['-ss', String(POSTER), '-i', f.video, '-frames:v', '1', f.poster]);

// review sheet: one frame a second (a timeline may ask for more)
const rows = 3 * SHEET_FPS, cols = Math.ceil(DURATION * SHEET_FPS / rows);
run(['-i', f.mp4, '-vf', `fps=${SHEET_FPS},scale=216:384,tile=${cols}x${rows}`, '-frames:v', '1', f.sheet]);
console.log('built', f.mp4);
