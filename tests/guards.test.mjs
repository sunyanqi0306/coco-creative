import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { allPages, readPage, DIST } from './helpers.mjs';

const ROOT = join(DIST, '..');

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(html|astro|ts|mjs|js|css|svg|md|json|xml|txt)$/.test(name)) out.push(p);
  }
  return out;
}

test('no internal system name in any tracked or built file', () => {
  const tracked = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: ROOT, encoding: 'utf8' })
    .split('\n').filter(Boolean).map((f) => join(ROOT, f));
  const files = [...walk(join(ROOT, 'dist')), ...tracked];
  const needle = ['om', 'ni', '[-_ ]?', 'ca', 'st'];
  const re = new RegExp(needle.join(''), 'i');
  for (const f of files) {
    if (!existsSync(f) || statSync(f).isDirectory()) continue;
    assert.ok(!re.test(readFileSync(f, 'latin1') + readFileSync(f, 'utf8')), `found internal system name in ${f}`);
  }
});

test('no tax wording on pages', () => {
  for (const route of allPages()) {
    const html = readPage(route);
    for (const w of ['未稅', '含稅', '營業稅']) assert.ok(!html.includes(w), `${route} contains ${w}`);
  }
});

test('every page has seo meta', () => {
  for (const route of allPages()) {
    const html = readPage(route);
    assert.match(html, /<title>[^<]+<\/title>/, `${route} title`);
    assert.match(html, /<meta name="description" content="[^"]+"/, `${route} description`);
    assert.match(html, /<meta property="og:image" content="https?:\/\/[^"]+"/, `${route} og:image`);
    assert.match(html, /<link rel="canonical" href="https?:\/\/[^"]+"/, `${route} canonical`);
  }
});

test('sitemap exists', () => {
  assert.ok(existsSync(join(DIST, 'sitemap-index.xml')));
});
