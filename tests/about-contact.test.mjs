import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage, allPages } from './helpers.mjs';
import { SITE } from '../src/data/site.ts';

test('about has two team cards and the no-handoff promise', () => {
  const html = readPage('/about/');
  assert.equal((html.match(/data-testid="team-card"/g) || []).length, 2);
  assert.ok(html.includes('中間不會被轉手'));
});

test('team cards render without photos when none are set', () => {
  const html = readPage('/about/');
  const cards = html.split('data-testid="team-card"').slice(1).map((c) => c.split('</article>')[0]);
  assert.equal(cards.length, 2);
  for (const c of cards) assert.ok(!c.includes('<img'), 'team card still has an image');
  assert.ok(!html.includes('team-placeholder'));
});

test('about page shows no placeholder text', () => {
  const html = readPage('/about/');
  for (const s of ['___', '這裡放一句']) assert.ok(!html.includes(s), `about still shows ${s}`);
});

test('LINE links point to the official account on every page', () => {
  for (const route of allPages()) {
    const html = readPage(route);
    assert.ok(html.includes('href="https://lin.ee/55uyXCb"'), `${route} missing official LINE link`);
    assert.ok(!html.includes('LINE_ID_PLACEHOLDER'), `${route} still shows LINE placeholder`);
  }
});

test('contact QR code is the real one', () => {
  const html = readPage('/contact/');
  assert.ok(html.includes('/coco-creative/images/line-qr.jpg'));
  assert.ok(!html.includes('line-qr-placeholder'));
});

test('contact has LINE link and QR code', () => {
  const html = readPage('/contact/');
  assert.ok(html.includes(SITE.line.url));
  assert.match(html, /<img[^>]+alt="[^"]*LINE QR Code[^"]*"/);
});
