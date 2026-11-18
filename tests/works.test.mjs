import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage } from './helpers.mjs';
import { WORKS, KINDS } from '../src/data/works.ts';

const html = readPage('/works/');

test('works page lists all categories', () => {
  for (const label of ['全部', '長片', '短影音', 'AI 影片', '企劃']) {
    assert.ok(html.includes(`>${label}<`), `missing filter ${label}`);
  }
});

test('placeholder ids render placeholder cards', () => {
  assert.ok(!html.includes('ytimg.com/vi/YOUTUBE_ID_PLACEHOLDER'), 'placeholder thumbnail url leaked');
  assert.ok(!html.includes('embed/YOUTUBE_ID_PLACEHOLDER'), 'placeholder iframe leaked');
  assert.match(html, /data-testid="work-placeholder"/);
});

test('real youtube id renders lazy thumbnail button', () => {
  // works.ts has one demo-free real id only if user added it; build from data
  const real = WORKS.find((w) => w.youtubeId && w.youtubeId !== 'YOUTUBE_ID_PLACEHOLDER');
  if (!real) return;
  assert.ok(html.includes(`data-yt="${real.youtubeId}"`));
  assert.ok(!html.includes('<iframe'), 'iframe must not load before click');
});

test('empty category shows coming soon exactly when data is empty', () => {
  for (const kind of KINDS) {
    const empty = WORKS.filter((w) => w.kind === kind.id).length === 0;
    assert.equal(html.includes(`data-empty-for="${kind.id}"`), empty, `kind ${kind.id}`);
  }
});

test('no client name when hideClient', () => {
  for (const w of WORKS.filter((w) => w.hideClient && w.client)) {
    assert.ok(!html.includes(w.client), `client ${w.client} leaked`);
  }
});
