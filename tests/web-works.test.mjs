import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage } from './helpers.mjs';

const SITES = [
  { url: 'https://domintw.com/', name: 'DOMIN 島眠床墊', img: '/coco-creative/images/works/domintw.webp' },
  { url: 'https://isetanlife.com/', name: '伊勢丹傢俱', img: '/coco-creative/images/works/isetanlife.webp' },
];

test('works page has a 網站 filter with both sites', () => {
  const html = readPage('/works/');
  assert.ok(html.includes('>網站<'), 'missing 網站 filter');
  for (const s of SITES) {
    assert.ok(html.includes(`href="${s.url}"`), `missing link ${s.url}`);
    assert.ok(html.includes(s.img), `missing screenshot ${s.img}`);
    assert.ok(html.includes(s.name), `missing name ${s.name}`);
  }
});

test('site links open in a new tab safely', () => {
  const html = readPage('/works/');
  for (const s of SITES) {
    const a = html.match(new RegExp(`<a[^>]*href="${s.url.replace(/[.?/]/g, '\\$&')}"[^>]*>`));
    assert.ok(a, s.url);
    assert.match(a[0], /target="_blank"/);
    assert.match(a[0], /rel="noopener"/);
  }
});

test('no tracking parameters in site links', () => {
  assert.ok(!readPage('/works/').includes('srsltid'));
});

test('web service page shows the site works instead of the coming-soon steps', () => {
  const html = readPage('/services/web/');
  const rel = html.split('data-section="related"')[1].split('</section>')[0];
  for (const s of SITES) assert.ok(rel.includes(`href="${s.url}"`), `web page missing ${s.url}`);
  assert.ok(!rel.includes('data-testid="coming-soon"'));
});

test('website works are not on the video page', () => {
  const rel = readPage('/services/video/').split('data-section="related"')[1].split('</section>')[0];
  for (const s of SITES) assert.ok(!rel.includes(s.url));
});
