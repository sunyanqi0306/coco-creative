import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage, allCss } from './helpers.mjs';

const html = readPage('/');

test('home sections in order', () => {
  const order = ['hero', 'featured', 'services', 'package', 'case', 'process', 'cta'];
  const idx = order.map((s) => html.indexOf(`data-section="${s}"`));
  idx.forEach((i, n) => assert.ok(i >= 0, `missing section ${order[n]}`));
  assert.deepEqual([...idx].sort((a, b) => a - b), idx, 'sections out of order');
});

test('home shows package price and compare price', () => {
  assert.ok(html.includes('NT$19,800'));
  assert.ok(html.includes('NT$25,500'));
});

test('home links to four service pages', () => {
  for (const id of ['video', 'social', 'web', 'marketing']) {
    assert.ok(html.includes(`href="/coco-creative/services/${id}/"`), id);
  }
});

test('css respects reduced motion', () => {
  assert.match(allCss() + html, /prefers-reduced-motion/);
});

test('ai wording', () => {
  assert.ok(html.includes('自有 AI 自動化流程，可快速量產'));
});
