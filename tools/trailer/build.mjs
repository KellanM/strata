// Assembles the trailer: the frame-stepped picture + the real-time sound, with
// gentle fades and loudness for phones (≈ −16 LUFS). Also writes a silent
// autoplay cut, a poster frame and a 1 fps contact sheet for review.
//
//   node tools/trailer/build.mjs
import { execFileSync } from 'node:child_process';
import { DURATION } from './timeline.mjs';

const run = (args) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...args], { stdio: 'inherit' });
const D = DURATION.toFixed(2);
const fadeOut = (DURATION - 1.8).toFixed(2);
// MediaRecorder starts capturing ~0.16 s after it reports 'start' (measured from chisel
// onsets against their frames), so the sound is advanced by that much
const AUDIO_LEAD = '0.16';

// sound: decode, trim to length, fade, normalise
run(['-ss', AUDIO_LEAD, '-i', 'trailer/audio.webm', '-t', D, '-af',
  `afade=t=in:st=0:d=0.25,afade=t=out:st=${fadeOut}:d=1.8,loudnorm=I=-16:TP=-1.5:LRA=11`,
  '-ar', '48000', '-ac', '2', 'trailer/audio-final.wav']);

// picture + sound
run(['-i', 'trailer/video.mp4', '-i', 'trailer/audio-final.wav', '-t', D,
  '-vf', `fade=t=out:st=${(DURATION - 0.6).toFixed(2)}:d=0.6`,
  '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '21', '-pix_fmt', 'yuv420p', '-r', '30',
  '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', '-shortest', 'trailer/strata-trailer.mp4']);

// silent autoplay cut
run(['-i', 'trailer/strata-trailer.mp4', '-an', '-c:v', 'copy', '-movflags', '+faststart', 'trailer/strata-trailer-silent.mp4']);

// poster: the reveal with title and gems
run(['-ss', '16.8', '-i', 'trailer/video.mp4', '-frames:v', '1', 'trailer/poster.png']);

// review sheet: one frame a second
run(['-i', 'trailer/strata-trailer.mp4', '-vf', 'fps=1,scale=216:384,tile=9x3', '-frames:v', '1', 'trailer/contact-sheet.png']);
console.log('built trailer/strata-trailer.mp4');
