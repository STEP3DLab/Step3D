import { cp, mkdir, rm } from 'node:fs/promises';

const DIST_DIR = new URL('../dist/', import.meta.url);
const SOURCE_FILE = new URL('../index.html', import.meta.url);

await rm(DIST_DIR, { recursive: true, force: true });
await mkdir(DIST_DIR, { recursive: true });
await cp(SOURCE_FILE, new URL('./index.html', DIST_DIR));

console.log('Build completed: dist/index.html');
