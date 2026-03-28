import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { setupDomFromFixture } from './helpers/dom.mjs';

test('main bootstrap prevents duplicate listeners on repeated initialization', async () => {
  const { document, cleanup } = setupDomFromFixture('main-bootstrap.html');

  class FakeIntersectionObserver {
    observe() {}
  }

  const previousIO = globalThis.IntersectionObserver;
  globalThis.IntersectionObserver = FakeIntersectionObserver;

  const counts = new Map();
  const originalAdd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function patchedAdd(type, listener, options) {
    const id = this.id || this.className || this.tagName || 'unknown';
    const key = `${id}:${type}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
    return originalAdd.call(this, type, listener, options);
  };

  try {
    const moduleUrl = pathToFileURL(path.resolve('assets/js/main.js')).href;
    await import(`${moduleUrl}?v=first`);
    const firstTotal = [...counts.values()].reduce((acc, value) => acc + value, 0);

    await import(`${moduleUrl}?v=second`);
    const secondTotal = [...counts.values()].reduce((acc, value) => acc + value, 0);

    assert.equal(secondTotal, firstTotal);

    document.querySelector('.service-tab[data-service="reverse"]').click();
    assert.equal(document.getElementById('projectType').value, 'reverse');
  } finally {
    EventTarget.prototype.addEventListener = originalAdd;
    globalThis.IntersectionObserver = previousIO;
    cleanup();
  }
});
