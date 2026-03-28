import test from 'node:test';
import assert from 'node:assert/strict';
import { initFaq } from '../assets/js/modules/faq.js';
import { setupDomFromFixture } from './helpers/dom.mjs';

test('initFaq supports search and expand/collapse with aria sync', () => {
  const { document, window, cleanup } = setupDomFromFixture('faq.html');
  try {
    initFaq();

    const items = [...document.querySelectorAll('.faq-item')];
    const buttons = [...document.querySelectorAll('.faq-q')];
    const search = document.getElementById('faqSearch');
    const resultCount = document.getElementById('faqResultCount');
    const expandAll = document.getElementById('faqExpandAll');
    const collapseAll = document.getElementById('faqCollapseAll');

    search.value = 'скан';
    search.dispatchEvent(new window.Event('input', { bubbles: true }));

    assert.equal(items[0].hidden, false);
    assert.equal(items[1].hidden, true);
    assert.equal(resultCount.textContent, 'Показано 1 из 2');

    expandAll.click();
    assert.equal(items[0].classList.contains('is-open'), true);
    assert.equal(buttons[0].getAttribute('aria-expanded'), 'true');

    collapseAll.click();
    assert.equal(items[0].classList.contains('is-open'), false);
    assert.equal(buttons[0].getAttribute('aria-expanded'), 'false');
  } finally {
    cleanup();
  }
});
