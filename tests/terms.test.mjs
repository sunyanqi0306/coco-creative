import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage, allPages } from './helpers.mjs';

test('process shows the real deposit, revisions and rush terms', () => {
  for (const route of ['/', '/contact/', '/services/video/']) {
    const html = readPage(route);
    assert.ok(html.includes('確認內容後簽約，並支付訂金 50%，排入檔期。'), `${route} deposit`);
    assert.ok(html.includes('含 2 次修改，超過另計；急件加價 20%。'), `${route} revisions/rush`);
  }
});

test('no term placeholders left on any page', () => {
  for (const route of allPages()) assert.ok(!readPage(route).includes('___%'), route);
});
