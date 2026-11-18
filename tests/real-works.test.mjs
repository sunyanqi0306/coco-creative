import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage, DIST } from './helpers.mjs';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const allJs = () => {
  const dir = join(DIST, '_astro');
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.js')).map((f) => readFileSync(join(dir, f), 'utf8')).join('\n') : '';
};
import { WORKS } from '../src/data/works.ts';

const html = readPage('/works/');

const LONG = ['svZJrVC3x58', 'DVagWqwu_Pc', '_3-xw49H4FQ', 'dEC6CpKyddo', 'bsgDRQGbW54', 'yBi5ideM-ME'];
const SHORT_YT = ['w4gEf8f7yV8', 'UiXe-c9vTCw', 'SXCgfeTNXOU', '4ok1gWuaqEQ', 'WtpNm9DOZlE', 'uHk3WMxcxbw'];
const SHORT_IG = ['Dey0OHeBpF3', 'DMhqzPv0KLN', 'DKbw52xh2i4'];
const AI = ['GNzJ0DxfWIM', '1t5abQIzIqo', 'FGsgMX4zRAs'];

test('every supplied YouTube video is on the works page', () => {
  for (const id of [...LONG, ...SHORT_YT, ...AI]) assert.ok(html.includes(`data-yt="${id}"`), id);
});

test('instagram reels render as click-to-load cards', () => {
  assert.ok(html.includes('data-ig="Dey0OHeBpF3"'));
  assert.doesNotMatch(html, /<iframe[^>]*\ssrc=/, 'nothing should load before a click');
});

test('instagram reels play in a pop-up dialog, not inline', () => {
  for (const route of ['/works/', '/']) {
    const page = readPage(route);
    assert.equal((page.match(/<dialog[^>]*data-testid="ig-dialog"/g) || []).length, 1, `${route} needs exactly one IG dialog`);
  }
  const script = readPage('/works/') + allJs();
  assert.ok(!/vcard__igframe/.test(script), 'IG iframe should no longer be swapped into the card');
});

test('embeddable reel shows its saved cover image', () => {
  const card = html.split('data-ig="Dey0OHeBpF3"')[1].split('</button>')[0];
  assert.ok(card.includes('/coco-creative/images/works/ig-Dey0OHeBpF3.webp'), 'reel 01 has no cover');
});

test('reels that Instagram refuses to embed link out instead of opening a broken player', () => {
  for (const id of ['DMhqzPv0KLN', 'DKbw52xh2i4']) {
    assert.ok(!html.includes(`data-ig="${id}"`), `${id} should not open the pop-up`);
    const a = html.match(new RegExp(`<a[^>]*href="https://www\\.instagram\\.com/reel/${id}/"[^>]*>`));
    assert.ok(a, `${id} should link to Instagram`);
    assert.match(a[0], /target="_blank"/);
    assert.match(a[0], /rel="noopener"/);
  }
});

test('kinds are right', () => {
  const kindOf = (id) => WORKS.find((w) => w.youtubeId === id || w.instagramId === id)?.kind;
  for (const id of LONG) assert.equal(kindOf(id), 'long', id);
  for (const id of [...SHORT_YT, ...SHORT_IG]) assert.equal(kindOf(id), 'short', id);
  for (const id of AI) assert.equal(kindOf(id), 'ai', id);
});

test('no placeholder cards are left', () => {
  assert.ok(!html.includes('data-testid="work-placeholder"'));
  assert.equal(WORKS.filter((w) => w.youtubeId === 'YOUTUBE_ID_PLACEHOLDER').length, 0);
});

test('no tracking parameters leak into the page', () => {
  for (const t of ['utm_source', 'si=', 'feature=share', 'avpt=']) assert.ok(!html.includes(t), t);
});
