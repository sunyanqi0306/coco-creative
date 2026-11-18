import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage } from './helpers.mjs';
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
  for (const id of SHORT_IG) assert.ok(html.includes(`data-ig="${id}"`), id);
  assert.ok(!html.includes('<iframe'), 'nothing should load before a click');
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
