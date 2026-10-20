// A close-up review sheet: a stretch of a render at a high frame rate, tiled
// with timestamps, for checking taps against breaks frame by frame.
//
//   node tools/trailer/v5/sheet.mjs in.mp4 start seconds fps out.png
import { execFileSync } from 'node:child_process';
import { existsSync, copyFileSync, mkdirSync } from 'node:fs';

const [IN, START = '0', LEN = '1', FPS = '15', OUT = 'sheet.png'] = process.argv.slice(2);
const font = 'trailer/v5/work/font.ttf';
mkdirSync('trailer/v5/work', { recursive: true });
if (!existsSync(font)) copyFileSync(process.env.SHEET_FONT ?? 'C:/Windows/Fonts/arial.ttf', font);
const n = Math.ceil(+LEN * +FPS), cols = 5, rows = Math.ceil(n / cols);
execFileSync('ffmpeg', ['-y', '-v', 'error', '-ss', START, '-t', LEN, '-i', IN, '-vf',
  `fps=${FPS},scale=270:480,drawtext=fontfile=${font}:text='%{pts\\:hms}':x=4:y=4:fontsize=16:fontcolor=white:box=1:boxcolor=black@0.5,tile=${cols}x${rows}`,
  '-frames:v', '1', OUT], { stdio: 'inherit' });
