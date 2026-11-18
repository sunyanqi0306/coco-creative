import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

export const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
export const BASE = '/coco-creative/';

/** Read dist/<route>/index.html. route like '/' or '/works/'. */
export function readPage(route) {
  const file = join(DIST, route, 'index.html');
  return readFileSync(file, 'utf8');
}

/** Every route (e.g. '/', '/works/') that has an index.html in dist. */
export function allPages(dir = DIST) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name.startsWith('_')) continue;
      out.push(...allPages(p));
    } else if (name === 'index.html') {
      out.push('/' + relative(DIST, dir).split(sep).join('/') + (relative(DIST, dir) ? '/' : ''));
    }
  }
  return out.map((r) => r.replace(/\/+/g, '/'));
}

/** Concatenated text of every built CSS file. */
export function allCss() {
  const dir = join(DIST, '_astro');
  if (!existsSync(dir)) return '';
  return readdirSync(dir).filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(dir, f), 'utf8')).join('\n');
}
