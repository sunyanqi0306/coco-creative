// 依 src/data/site.ts 的 LINE 網址產生 public/images/line-qr.svg。換網址後執行：node scripts/make-line-qr.mjs
import QRCode from 'qrcode';
import { writeFileSync } from 'node:fs';
import { SITE } from '../src/data/site.ts';

const svg = await QRCode.toString(SITE.line.url, {
  type: 'svg',
  errorCorrectionLevel: 'M',
  margin: 2,
  color: { dark: '#2E241D', light: '#FFFFFF' },
});
writeFileSync('public/images/line-qr.svg', svg);
console.log('line-qr.svg ->', SITE.line.url);
