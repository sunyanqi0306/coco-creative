// 檢查 → 存版本 → 推上 GitHub（推上去之後 GitHub 會自動更新網站，約 1 分鐘）。
import { spawnSync } from 'node:child_process';

const run = (cmd, args, opts = {}) =>
  spawnSync(cmd, args, { stdio: opts.quiet ? 'pipe' : 'inherit', shell: process.platform === 'win32', encoding: 'utf8' });

export function publish(message) {
  console.log('\n[1/3] 建置並檢查網站…（約 10 秒）');
  const t = run('npm', ['test'], { quiet: true });
  if (t.status !== 0) {
    console.log((t.stdout || '') .split('\n').filter((l) => /✖|not ok|Error/.test(l)).slice(0, 15).join('\n'));
    console.log('\n✖ 檢查沒過，所以沒有發布。上面是出問題的地方，改好再執行一次 npm run upload。');
    return false;
  }
  console.log('      ✔ 檢查通過');

  console.log('[2/3] 存成新版本…');
  run('git', ['add', '-A']);
  const staged = run('git', ['diff', '--cached', '--quiet'], { quiet: true });
  if (staged.status === 0) {
    console.log('      沒有新的變更。');
  } else if (run('git', ['commit', '-q', '-m', message]).status !== 0) {
    console.log('\n✖ 存版本失敗。');
    return false;
  }

  console.log('[3/3] 推上 GitHub…');
  if (run('git', ['push', '-q']).status !== 0) {
    console.log('\n✖ 推送失敗，請檢查網路，或執行 gh auth status 確認 GitHub 有登入。');
    return false;
  }
  console.log('\n✔ 完成！約 1 分鐘後網站會更新：https://sunyanqi0306.github.io/coco-creative/\n');
  return true;
}
