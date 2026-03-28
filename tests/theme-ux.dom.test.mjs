import test from 'node:test';
import assert from 'node:assert/strict';
import { initTheme } from '../assets/js/modules/theme.js';
import { initUx } from '../assets/js/modules/ux.js';
import { setupDomFromFixture } from './helpers/dom.mjs';

test('initTheme and initUx persist state and sync aria attributes', () => {
  const { document, cleanup } = setupDomFromFixture('theme-ux.html');
  try {
    localStorage.setItem('step3d-theme', 'ivory');
    localStorage.setItem('step3d-high-contrast', 'true');
    localStorage.setItem('step3d-reduce-motion', 'true');
    localStorage.setItem('step3d-font-scale', '1.1');

    initTheme();
    initUx();

    const themeButtons = [...document.querySelectorAll('.theme-btn')];
    const ivoryBtn = themeButtons.find((btn) => btn.dataset.theme === 'ivory');
    assert.equal(document.body.dataset.theme, 'ivory');
    assert.equal(ivoryBtn.getAttribute('aria-pressed'), 'true');

    themeButtons.find((btn) => btn.dataset.theme === 'midnight').click();
    assert.equal(localStorage.getItem('step3d-theme'), 'midnight');

    const contrastBtn = document.getElementById('toggleContrastBtn');
    contrastBtn.click();
    assert.equal(contrastBtn.getAttribute('aria-pressed'), 'false');
    assert.equal(localStorage.getItem('step3d-high-contrast'), 'false');

    const motionBtn = document.getElementById('toggleMotionBtn');
    motionBtn.click();
    assert.equal(motionBtn.getAttribute('aria-pressed'), 'false');
    assert.equal(localStorage.getItem('step3d-reduce-motion'), 'false');

    assert.equal(document.documentElement.style.fontSize, '110%');
  } finally {
    cleanup();
  }
});
