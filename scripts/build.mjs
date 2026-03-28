import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import nunjucks from 'nunjucks';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url);
const DIST_DIR = new URL('../dist/', import.meta.url);
const templatesDir = fileURLToPath(new URL('../templates/', import.meta.url));
const pageTemplate = fileURLToPath(new URL('../templates/pages/index.njk', import.meta.url));
const rootIndexPath = fileURLToPath(new URL('../index.html', import.meta.url));
const distIndexPath = fileURLToPath(new URL('./index.html', DIST_DIR));

const env = nunjucks.configure(templatesDir, {
  autoescape: false,
  throwOnUndefined: true,
  trimBlocks: false,
  lstripBlocks: false
});

const renderedIndex = env.render(pageTemplate);

await rm(DIST_DIR, { recursive: true, force: true });
await mkdir(new URL('./assets/js/', DIST_DIR), { recursive: true });

await writeFile(rootIndexPath, renderedIndex, 'utf8');
await writeFile(distIndexPath, renderedIndex, 'utf8');
await cp(new URL('./assets/css/', root), new URL('./assets/css/', DIST_DIR), { recursive: true });

await build({
  entryPoints: [new URL('./assets/js/main.js', root).pathname],
  outfile: new URL('./assets/js/main.js', DIST_DIR).pathname,
  bundle: true,
  minify: true,
  format: 'esm',
  target: ['es2020']
});

console.log('Build completed: index.html generated from templates and dist/assets/js/main.js');
