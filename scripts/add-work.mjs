// 在終端機新增一支作品，並（可選）直接發布到網站。
// 用法：在 site 資料夾執行  npm run add-work
import { readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';
import { parseYouTubeId, parseInstagramId, addWork } from './works-lib.mjs';
import { publish } from './publish-lib.mjs';

const FILE = new URL('../src/data/works.json', import.meta.url);
const rl = createInterface({ input: stdin, terminal: false });
const lines = rl[Symbol.asyncIterator]();
// 一行一行讀（直接打字或貼上都可以）
async function ask(q) {
  stdout.write(q);
  const { value, done } = await lines.next();
  if (done) { console.log('\n已取消。'); process.exit(1); }
  if (!stdin.isTTY) stdout.write(value + '\n');
  return value;
}

async function choose(question, options) {
  const lines = options.map((o, i) => `  ${i + 1}) ${o.label}`).join('\n');
  for (;;) {
    const a = (await ask(`${question}\n${lines}\n請輸入數字：`)).trim();
    const n = Number(a);
    if (n >= 1 && n <= options.length) return options[n - 1].value;
    console.log('  → 請輸入上面列出的數字。');
  }
}

async function yesNo(question, def) {
  const hint = def ? '(Y/n)' : '(y/N)';
  const a = (await ask(`${question} ${hint}：`)).trim().toLowerCase();
  if (!a) return def;
  return a.startsWith('y');
}

console.log('\n=== 新增作品 ===\nYouTube 影片請設成「不公開」（不要選「私人」）；Instagram Reel 要是公開帳號才看得到。\n');

let source = null;
while (!source) {
  const link = await ask('貼上 YouTube 或 Instagram Reel 網址：');
  const yt = parseYouTubeId(link);
  const ig = parseInstagramId(link);
  source = yt ? { youtubeId: yt } : ig ? { instagramId: ig } : null;
  if (!source) console.log('  → 看不懂這個網址，請貼 YouTube（youtu.be/…、youtube.com/…）或 Instagram Reel（instagram.com/reel/…）的網址。');
}

const kind = await choose('\n這支是哪一類？', [
  { label: '長片', value: 'long' },
  { label: '短影音', value: 'short' },
  { label: 'AI 影片', value: 'ai' },
]);

let title = '';
while (!title) title = (await ask('\n作品標題（例如：品牌形象片｜某某咖啡）：')).trim();

const service = kind === 'short'
  ? await choose('\n要出現在哪個服務頁？', [
      { label: '影音製作', value: 'video' },
      { label: '社群經營', value: 'social' },
    ])
  : 'video';

const featured = await yesNo('\n要放在首頁「精選作品」嗎？', false);

const works = JSON.parse(readFileSync(FILE, 'utf8'));
let result;
try {
  result = addWork(works, { ...source, kind, title, featured, service });
} catch (e) {
  console.log(`\n✖ ${e.message}`);
  rl.close();
  process.exit(1);
}
writeFileSync(FILE, JSON.stringify(result.works, null, 2) + '\n');
console.log(`\n✔ 已加入作品清單（${result.id}）：${title}`);

const go = await yesNo('\n要現在發布到網站嗎？', true);
rl.close();
if (!go) {
  console.log('\n好，先存在電腦裡。之後要發布時執行：npm run upload\n');
  process.exit(0);
}
process.exit(publish(`content: add work "${title}"`) ? 0 : 1);
