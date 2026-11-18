import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage } from './helpers.mjs';

const page = (id) => readPage(`/services/${id}/`);
const has = (html, list) => list.forEach((s) => assert.ok(html.includes(s), `missing ${s}`));

test('four service pages with own titles', () => {
  const titles = { video: '影音製作', social: '社群經營', web: '網站服務', marketing: '行銷企劃' };
  for (const [id, t] of Object.entries(titles)) {
    assert.match(page(id), new RegExp(`<title>${t}`));
  }
});

test('services index lists all four', () => {
  const html = readPage('/services/');
  for (const id of ['video', 'social', 'web', 'marketing']) assert.ok(html.includes(`/coco-creative/services/${id}/`));
});

test('video page prices', () => {
  has(page('video'), ['NT$1,000', 'NT$1,500', 'NT$2,000', 'NT$4,500', 'NT$5,500', 'NT$19,800', '30 秒', '60 秒', '90 秒', '8～15 分鐘', '15～20 分鐘']);
});

test('social page prices', () => {
  has(page('social'), ['NT$28,000', '廣告預算 20%']);
});

test('web page prices', () => {
  has(page('web'), ['NT$40,000', 'NT$4,000', 'NT$10,000']);
});

test('marketing page prices', () => {
  has(page('marketing'), ['NT$15,000']);
});

test('every service page has non-empty related section', () => {
  for (const id of ['video', 'social', 'web', 'marketing']) {
    const html = page(id);
    const i = html.indexOf('data-section="related"');
    assert.ok(i >= 0, `${id} lacks related`);
    const chunk = html.slice(i, i + 4000);
    assert.ok(/class="vcard|data-testid="coming-soon"/.test(chunk), `${id} related is empty`);
  }
});
