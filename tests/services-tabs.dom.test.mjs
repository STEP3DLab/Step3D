import test from 'node:test';
import assert from 'node:assert/strict';
import { initServicesTabs } from '../assets/js/modules/services-tabs.js';
import { setupDomFromFixture } from './helpers/dom.mjs';

test('initServicesTabs switches active tab and syncs #projectType', () => {
  const { document, cleanup } = setupDomFromFixture('services-tabs.html');
  try {
    let onTypeChangeCalls = 0;
    initServicesTabs({
      onTypeChange: () => {
        onTypeChangeCalls += 1;
      }
    });

    const tabs = [...document.querySelectorAll('.service-tab')];
    const panels = [...document.querySelectorAll('.service-panel')];
    const select = document.getElementById('projectType');

    tabs[1].click();

    assert.equal(tabs[1].classList.contains('is-active'), true);
    assert.equal(tabs[0].classList.contains('is-active'), false);
    assert.equal(tabs[1].getAttribute('aria-selected'), 'true');
    assert.equal(select.value, 'reverse');
    assert.equal(panels[1].classList.contains('is-active'), true);
    assert.equal(panels[1].hidden, false);
    assert.equal(onTypeChangeCalls, 1);
  } finally {
    cleanup();
  }
});
