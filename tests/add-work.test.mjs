import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseYouTubeId, addWork, PLACEHOLDER } from '../scripts/works-lib.mjs';

test('parses every common YouTube url shape', () => {
  for (const url of [
    'https://youtu.be/AbC123xyz_-',
    'https://www.youtube.com/watch?v=AbC123xyz_-',
    'https://www.youtube.com/watch?v=AbC123xyz_-&t=10s',
    'https://youtube.com/shorts/AbC123xyz_-?feature=share',
    'https://m.youtube.com/watch?v=AbC123xyz_-',
    'AbC123xyz_-',
  ]) {
    assert.equal(parseYouTubeId(url), 'AbC123xyz_-', url);
  }
});

test('rejects things that are not YouTube ids', () => {
  for (const bad of ['', 'hello', 'https://vimeo.com/123', 'https://youtube.com/']) {
    assert.equal(parseYouTubeId(bad), null, bad);
  }
});

const base = () => [
  { id: 'long-1', kind: 'long', orientation: 'landscape', title: '長片 01', youtubeId: PLACEHOLDER, service: 'video' },
  { id: 'short-1', kind: 'short', orientation: 'portrait', title: '短影音 01', youtubeId: 'Real0000001', service: 'video' },
  { id: 'short-2', kind: 'short', orientation: 'portrait', title: '短影音 02', youtubeId: PLACEHOLDER, service: 'video' },
];

test('fills the first placeholder of the same kind', () => {
  const { works, id } = addWork(base(), { youtubeId: 'NewShort001', kind: 'short', title: '咖啡廳開幕', featured: true });
  assert.equal(id, 'short-2');
  const w = works.find((x) => x.id === 'short-2');
  assert.equal(w.youtubeId, 'NewShort001');
  assert.equal(w.title, '咖啡廳開幕');
  assert.equal(w.featured, true);
  assert.equal(w.orientation, 'portrait');
  assert.equal(works.length, 3);
});

test('filling a placeholder uses the chosen service page', () => {
  const { works } = addWork(base(), { youtubeId: 'NewShort002', kind: 'short', title: 's', service: 'social' });
  assert.equal(works.find((w) => w.id === 'short-2').service, 'social');
});

test('appends a new entry when no placeholder of that kind is left', () => {
  const { works, id } = addWork(base(), { youtubeId: 'NewAi000001', kind: 'ai', title: 'AI 測試' });
  assert.equal(id, 'ai-1');
  const w = works.at(-1);
  assert.deepEqual(
    { id: w.id, kind: w.kind, orientation: w.orientation, youtubeId: w.youtubeId, service: w.service },
    { id: 'ai-1', kind: 'ai', orientation: 'portrait', youtubeId: 'NewAi000001', service: 'video' },
  );
});

test('long videos default to landscape', () => {
  const { works } = addWork([], { youtubeId: 'NewLong0001', kind: 'long', title: '形象片' });
  assert.equal(works[0].orientation, 'landscape');
});

test('does not mutate the input list', () => {
  const list = base();
  addWork(list, { youtubeId: 'NewShort001', kind: 'short', title: 'x' });
  assert.equal(list[2].youtubeId, PLACEHOLDER);
});

test('refuses a video that is already on the site', () => {
  assert.throws(() => addWork(base(), { youtubeId: 'Real0000001', kind: 'short', title: 'dup' }), /已經在網站上/);
});
