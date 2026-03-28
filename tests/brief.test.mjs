import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBrief } from '../assets/js/modules/brief.js';

test('buildBrief uses fallback values', () => {
  const text = buildBrief({ task: 'Сканирование', deadline: '2 недели' });
  assert.ok(text.includes('Меня зовут Не указано'));
  assert.ok(text.includes('Контакт для связи: Не указано'));
});

test('buildBrief renders provided fields', () => {
  const text = buildBrief({
    name: 'Иван',
    contact: '@ivan',
    task: 'Прототип',
    deadline: 'Срочно',
    assets: 'STL',
    description: 'Нужен тестовый образец.'
  });

  assert.ok(text.includes('Меня зовут Иван'));
  assert.ok(text.includes('Что уже есть: STL.'));
});
