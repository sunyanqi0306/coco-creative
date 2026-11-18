import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { allCss, readPage } from './helpers.mjs';

const theme = readFileSync(new URL('../src/styles/theme.css', import.meta.url), 'utf8');
const token = (name) => {
  const m = theme.match(new RegExp(`--${name}:\\s*(#[0-9A-Fa-f]{6})`));
  assert.ok(m, `token --${name} missing`);
  return m[1];
};
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// WCAG AA for body text: 4.5:1
const PAIRS = [
  ['copper-text', 'cream'],
  ['copper-text', 'cream-2'],
  ['copper-text', 'sand'],
  ['ink-soft', 'cream'],
  ['ink-soft', 'cream-2'],
  ['ink-soft', 'sand'],
  ['copper-light', 'espresso'],
  ['espresso', 'sand'],
];

for (const [fg, bg] of PAIRS) {
  test(`--${fg} on --${bg} meets AA`, () => {
    assert.ok(ratio(token(fg), token(bg)) >= 4.5, `${fg}/${bg} = ${ratio(token(fg), token(bg)).toFixed(2)}`);
  });
}

test('text never uses the decorative copper token directly', () => {
  // --copper is for borders/backgrounds only; text uses --copper-text (or --copper-light on dark)
  assert.doesNotMatch(allCss(), /(^|[;{\s])color:\s*var\(--copper\)/);
});

test('thumbnail tags are readable on every placeholder tone', () => {
  for (const bg of [token('sand'), token('sand-2'), '#A88B6E']) {
    assert.ok(ratio(token('espresso'), bg) >= 4.5, `espresso on ${bg} = ${ratio(token('espresso'), bg).toFixed(2)}`);
  }
});
