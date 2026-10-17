// Builds dist/: the static site for hosting (GitHub Pages). Copies public/,
// vendors the three.js files the game imports, and stamps the service worker
// with a version and the full precache list.
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const three = join(root, 'node_modules/three');

rmSync(dist, { recursive: true, force: true });
cpSync(join(root, 'public'), dist, { recursive: true });
for (const f of ['build/three.module.min.js', 'build/three.core.min.js', 'examples/jsm/controls/OrbitControls.js']) {
  const out = join(dist, 'vendor/three', f);
  mkdirSync(join(out, '..'), { recursive: true });
  cpSync(join(three, f), out);
}

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
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
