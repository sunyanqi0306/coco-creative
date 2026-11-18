import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage } from './helpers.mjs';
import { SITE } from '../src/data/site.ts';

test('about has two team cards and the no-handoff promise', () => {
  const html = readPage('/about/');
  assert.equal((html.match(/data-testid="team-card"/g) || []).length, 2);
  assert.ok(html.includes('中間不會被轉手'));
});

test('contact has LINE link and QR code', () => {
  const html = readPage('/contact/');
  assert.ok(html.includes(SITE.line.url));
  assert.match(html, /<img[^>]+alt="[^"]*LINE QR Code[^"]*"/);
});
