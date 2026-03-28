import test from 'node:test';
import assert from 'node:assert/strict';
import { initNav } from '../assets/js/modules/nav.js';
import { setupDomFromFixture } from './helpers/dom.mjs';

test('initNav updates active link, progress and menu behavior', () => {
  const { document, window, cleanup } = setupDomFromFixture('nav.html');

  class FakeIntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }

    observe(target) {
      this.callback([{ isIntersecting: true, target }]);
    }
  }

  const previousIO = globalThis.IntersectionObserver;
  globalThis.IntersectionObserver = FakeIntersectionObserver;

  const topSection = document.getElementById('top');
  const servicesSection = document.getElementById('services');
  const docEl = document.documentElement;

  Object.defineProperty(docEl, 'scrollHeight', { value: 2000, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true });
  Object.defineProperty(window, 'scrollY', { value: 500, configurable: true });
  topSection.getBoundingClientRect = () => ({ top: -10 });
  servicesSection.getBoundingClientRect = () => ({ top: 100 });

  try {
    initNav();

    window.dispatchEvent(new window.Event('scroll'));

    const activeNav = document.querySelector('.nav-link.is-active');
    const progress = document.getElementById('scrollProgress').style.width;
    assert.equal(activeNav.getAttribute('href'), '#services');
    assert.equal(progress, '50%');

    const navToggle = document.getElementById('navToggle');
    navToggle.click();
    assert.equal(document.body.classList.contains('nav-open'), true);
    assert.equal(navToggle.getAttribute('aria-expanded'), 'true');

    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    assert.equal(document.body.classList.contains('nav-open'), false);

    const reveal = document.getElementById('reveal1');
    assert.equal(reveal.classList.contains('is-visible'), true);
  } finally {
    globalThis.IntersectionObserver = previousIO;
    cleanup();
  }
});
