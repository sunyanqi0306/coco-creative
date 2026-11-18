import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allPages, readPage, BASE } from './helpers.mjs';

const pages = allPages();

test('site builds at least one page', () => {
  assert.ok(pages.length > 0, 'dist has no pages');
});

test('every page has the LINE button', () => {
  for (const route of pages) {
    const html = readPage(route);
    assert.match(html, /data-testid="line-button"/, `${route} lacks LINE button`);
    assert.ok(html.includes('諮詢前請先參考各服務起價'), `${route} lacks LINE hint`);
  }
});

test('internal links carry base', () => {
  for (const route of pages) {
    const html = readPage(route);
    const bad = [...html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]).filter((h) => !h.startsWith(BASE) && !h.startsWith('//'));
    assert.deepEqual(bad, [], `${route} has links without base`);
  }
});

test('lang is zh-Hant-TW', () => {
  for (const route of pages) {
    assert.match(readPage(route), /<html lang="zh-Hant-TW"/, route);
  }
});
