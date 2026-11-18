import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPage, allPages, allCss } from './helpers.mjs';

const home = readPage('/');

test('nav starts with a HOME link to the home page', () => {
  for (const route of allPages()) {
    const nav = readPage(route).split('<nav')[1].split('</nav>')[0];
    const links = [...nav.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
    assert.equal(links.length, 5, `${route} nav should have 5 links`);
    assert.equal(links[0][1], '/coco-creative/', `${route} first nav link should go home`);
    assert.match(links[0][2], /HOME/);
  }
});

test('nav labels are English with small Chinese', () => {
  const nav = home.split('<nav')[1].split('</nav>')[0];
  for (const [en, zh] of [['HOME', '首頁'], ['WORKS', '作品'], ['SERVICES', '服務'], ['ABOUT', '關於'], ['CONTACT', '聯絡']]) {
    assert.ok(nav.includes(en), `missing ${en}`);
    assert.ok(nav.includes(zh), `missing ${zh}`);
  }
});

test('home: only the hero is a dark section', () => {
  for (const s of ['featured', 'package', 'case', 'process', 'cta', 'services']) {
    const tag = home.match(new RegExp(`<section[^>]*data-section="${s}"[^>]*>`));
    assert.ok(tag, `missing ${s}`);
    assert.ok(!tag[0].includes('section--dark'), `${s} should not be dark`);
  }
});

test('package card is light, not espresso', () => {
  assert.doesNotMatch(allCss() + home, /\.pkg\[[^\]]+\]\{[^}]*background:var\(--espresso\)/);
});

test('placeholder thumbnails are solid, not striped, with label bottom-left', () => {
  const css = allCss() + home;
  assert.doesNotMatch(css, /\.vcard__media--empty[^{]*\{[^}]*repeating-linear-gradient/);
  assert.match(home, /class="vcard__tag[^"]*"/);
});

test('home services are a dashed list, not boxed cards', () => {
  const sec = home.split('data-section="services"')[1].split('</section>')[0];
  assert.ok(!sec.includes('svc__card'), 'still uses cards');
  assert.equal((sec.match(/class="svc__row/g) || []).length, 4);
  assert.match(allCss() + home, /\.svc__row[^{]*\{[^}]*border-bottom:1px dashed/);
});
