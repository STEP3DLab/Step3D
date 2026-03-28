import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEstimateState } from '../assets/js/modules/estimate.js';

test('calculateEstimateState clamps score and builds bullets', () => {
  const state = calculateEstimateState({
    type: 'mixed',
    goal: 'production',
    source: 'object',
    scale: 'large',
    notes: 'Очень подробное описание задачи с контекстом, ограничениями и применением результата.',
    priority: 'quality',
    deadline: 'rush'
  });

  assert.ok(state.score >= 42 && state.score <= 92);
  assert.equal(state.chips.route, 'Комбинированный маршрут');
  assert.ok(state.bullets.some((item) => item.includes('крайний срок')));
});

test('calculateEstimateState includes baseline recommendation', () => {
  const state = calculateEstimateState({
    type: 'scan',
    goal: 'demo',
    source: 'idea',
    scale: 'medium',
    notes: '',
    priority: 'budget',
    deadline: 'planned'
  });

  assert.ok(state.bullets.at(-1).includes('Собрать бриф'));
});
