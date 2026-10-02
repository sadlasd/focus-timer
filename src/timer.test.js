import test from 'node:test';
import assert from 'node:assert/strict';
import { MODES, formatTime, remainingSeconds } from './timer.js';

test('формат времени с ведущими нулями', () => {
  assert.equal(formatTime(1500), '25:00');
  assert.equal(formatTime(61), '01:01');
  assert.equal(formatTime(9), '00:09');
  assert.equal(formatTime(0), '00:00');
});

test('режимы на 25, 5 и 15 минут', () => {
  assert.deepEqual(Object.values(MODES).map((mode) => mode.seconds), [1500, 300, 900]);
});

test('не обнуляет последнюю неполную секунду', () => {
  assert.equal(remainingSeconds(10000, 9001), 1);
  assert.equal(remainingSeconds(10000, 9999), 1);
});

test('учитывает задержку обновления вкладки', () => {
  assert.equal(remainingSeconds(10000, 4000), 6);
  assert.equal(remainingSeconds(10000, 8000), 2);
});

test('после окончания не показывает отрицательные числа', () => {
  assert.equal(remainingSeconds(10000, 10000), 0);
  assert.equal(remainingSeconds(10000, 60000), 0);
});
