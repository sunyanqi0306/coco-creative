// 產生 public/og.png（社群分享預覽圖）與 public/favicon.svg。需要時執行：node scripts/make-og.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#2E241D"/>
<rect x="60" y="60" width="1080" height="510" rx="6" fill="#3B2C22"/>
<g fill="none" stroke="#F3EADB" stroke-opacity=".05">${Array.from({ length: 128 }, (_, i) => `<line x1="60" x2="1140" y1="${62 + i * 4}" y2="${62 + i * 4}"/>`).join('')}</g>
<circle cx="104" cy="104" r="9" fill="#E0573B"/>
<text x="124" y="111" font-family="Arial, sans-serif" font-size="22" letter-spacing="4" fill="#F0C9A8">REC 00:00:12</text>
<text x="110" y="380" font-family="Arial, sans-serif" font-size="120" font-weight="700" letter-spacing="24" fill="#F3EADB">COCO</text>
<text x="114" y="450" font-family="Arial, sans-serif" font-size="44" letter-spacing="18" fill="#F0C9A8">CREATIVE</text>
<rect x="114" y="490" width="140" height="4" fill="#8B5A3C"/>
</svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og.png');

writeFileSync('public/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#2E241D"/><text x="32" y="44" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#F0C9A8">C</text><circle cx="50" cy="14" r="5" fill="#E0573B"/></svg>\n`);
console.log('og.png + favicon.svg written');
