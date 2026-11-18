import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatPrice } from '../src/lib/price.ts';
import { PACKAGES, GROUPS, TAX } from '../src/data/pricing.ts';

const off = { ...TAX, enabled: false };

test('plain amount', () => {
  assert.equal(formatPrice({ label: '', amount: 1500 }, off), 'NT$1,500');
});

test('amount with unit', () => {
  assert.equal(formatPrice({ label: '', amount: 3000, unit: '半天（4 小時）' }, off), 'NT$3,000／半天（4 小時）');
});

test('null amount is 洽詢', () => {
  assert.equal(formatPrice({ label: '', amount: null }, off), '洽詢');
});

test('tax exclusive adds 未稅 label', () => {
  assert.equal(formatPrice({ label: '', amount: 1500 }, { enabled: true, mode: 'exclusive', rate: 0.05 }), 'NT$1,500（未稅）');
});

test('tax inclusive multiplies by rate', () => {
  assert.equal(formatPrice({ label: '', amount: 1500 }, { enabled: true, mode: 'inclusive', rate: 0.05 }), 'NT$1,575');
});

test('tax is off by default', () => {
  assert.equal(TAX.enabled, false);
  assert.equal(formatPrice({ label: '', amount: 1500 }), 'NT$1,500');
});

test('brand package price', () => {
  assert.equal(PACKAGES[0].price, 19800);
  assert.equal(PACKAGES[0].compareAt, 25500);
});

test('four groups in order', () => {
  assert.deepEqual(GROUPS.map((g) => g.id), ['video', 'social', 'web', 'marketing']);
});
