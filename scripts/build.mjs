import { cp, mkdir, rm } from 'node:fs/promises';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url);
const DIST_DIR = new URL('../dist/', import.meta.url);

await rm(DIST_DIR, { recursive: true, force: true });
await mkdir(new URL('./assets/js/', DIST_DIR), { recursive: true });

await cp(new URL('./index.html', root), new URL('./index.html', DIST_DIR));
await cp(new URL('./assets/css/', root), new URL('./assets/css/', DIST_DIR), { recursive: true });

await build({
  entryPoints: [new URL('./assets/js/main.js', root).pathname],
  outfile: new URL('./assets/js/main.js', DIST_DIR).pathname,
  bundle: true,
  minify: true,
  format: 'esm',
  target: ['es2020']
});

console.log('Build completed: dist/index.html and dist/assets/js/main.js');
