import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.resolve(__dirname, '../fixtures');

const GLOBAL_KEYS = [
  'window',
  'document',
  'navigator',
  'localStorage',
  'HTMLElement',
  'Event',
  'CustomEvent',
  'Node',
  'getComputedStyle',
  'IntersectionObserver'
];

export function setupDomFromFixture(fixtureName, { url = 'https://example.test/' } = {}) {
  const html = readFileSync(path.join(fixturesDir, fixtureName), 'utf8');
  const dom = new JSDOM(html, { url, pretendToBeVisual: true });
  const previous = new Map();

  for (const key of GLOBAL_KEYS) {
    previous.set(key, globalThis[key]);
  }

  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.navigator = dom.window.navigator;
  globalThis.localStorage = dom.window.localStorage;
  globalThis.HTMLElement = dom.window.HTMLElement;
  globalThis.Event = dom.window.Event;
  globalThis.CustomEvent = dom.window.CustomEvent;
  globalThis.Node = dom.window.Node;
  globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);

  if (!globalThis.window.requestAnimationFrame) {
    globalThis.window.requestAnimationFrame = (cb) => globalThis.window.setTimeout(cb, 16);
  }

  if (!globalThis.window.cancelAnimationFrame) {
    globalThis.window.cancelAnimationFrame = (id) => globalThis.window.clearTimeout(id);
  }

  return {
    window: dom.window,
    document: dom.window.document,
    cleanup() {
      dom.window.close();
      for (const key of GLOBAL_KEYS) {
        if (previous.get(key) === undefined) {
          delete globalThis[key];
        } else {
          globalThis[key] = previous.get(key);
        }
      }
    }
  };
}
