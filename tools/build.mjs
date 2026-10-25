// Builds dist/: the static site for hosting (GitHub Pages). Copies public/,
// vendors the three.js files the game imports, and stamps the service worker
// with a version and the full precache list.
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const three = join(root, 'node_modules/three');

rmSync(dist, { recursive: true, force: true });
cpSync(join(root, 'public'), dist, { recursive: true });
// the store app (--app): the developer pages (object gallery, prototypes) stay on the web
if (process.argv.includes('--app')) for (const dir of ['gallery', 'proto']) rmSync(join(dist, dir), { recursive: true, force: true });
for (const f of ['build/three.module.min.js', 'build/three.core.min.js', 'examples/jsm/controls/OrbitControls.js']) {
  const out = join(dist, 'vendor/three', f);
  mkdirSync(join(out, '..'), { recursive: true });
  cpSync(join(three, f), out);
}

// stamp the version into How to play: package version and the commit it was built from
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
let sha = (process.env.GITHUB_SHA || '').slice(0, 7);
if (!sha) { try { sha = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim(); } catch { sha = ''; } }
// the patch number counts commits, so every deploy shows a new version
let count = '';
try { count = execSync('git rev-list --count HEAD', { cwd: root }).toString().trim(); } catch { count = ''; }
const [major, minor] = pkg.version.split('.');
const stamp = `v${major}.${minor}.${count || '0'}${sha ? ' · ' + sha : ''}`;
const htmlPath = join(dist, 'index.html');
writeFileSync(htmlPath, readFileSync(htmlPath, 'utf8').replace('<p id="version" class="version">dev</p>', `<p id="version" class="version">${stamp}</p>`));
console.log(`stamped ${stamp}`);

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    // the gallery and study prototypes (proto/) are deployed but never cached offline
    if (statSync(p).isDirectory()) { if (!['gallery', 'proto'].includes(relative(dist, p))) walk(p); }
    else if (name !== 'sw.js' && name !== 'icon.svg') files.push(relative(dist, p).split(sep).join('/'));
  }
};
walk(dist);
files.sort();

const hash = createHash('sha256');
for (const f of files) hash.update(f).update(readFileSync(join(dist, f)));
const version = hash.digest('hex').slice(0, 12);

const swPath = join(dist, 'sw.js');
const sw = readFileSync(swPath, 'utf8')
  .replace("const VERSION = 'dev';", `const VERSION = '${version}';`)
  .replace('const FILES = [];', `const FILES = ${JSON.stringify(['./', ...files], null, 2)};`);
writeFileSync(swPath, sw);

console.log(`dist/ built: ${files.length} files, version ${version}`);
