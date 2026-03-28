import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCaseData, validateEstimateState } from '../assets/js/modules/data-guards.js';

test('validateCaseData accepts required fields', () => {
  assert.doesNotThrow(() => {
    validateCaseData('caseX', {
      title: 'Кейс',
      stats: [['Формат', 'CAD']],
      columns: [{ title: 'Задача', items: ['Проверить геометрию'] }]
    });
  });
});

test('validateEstimateState rejects empty bullets', () => {
  assert.throws(() => {
    validateEstimateState({ bullets: [] });
  });
});
