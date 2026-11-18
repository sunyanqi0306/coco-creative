// 新增作品用的小工具（給 scripts/add-work.mjs 和測試用）。

export const PLACEHOLDER = 'YOUTUBE_ID_PLACEHOLDER';

const ID = /^[A-Za-z0-9_-]{11}$/;

/** 從各種 YouTube 網址（或直接貼 ID）取出 11 碼影片 ID；不是 YouTube 就回傳 null。 */
export function parseYouTubeId(input) {
  const s = String(input ?? '').trim();
  if (ID.test(s)) return s;
  let url;
  try {
    url = new URL(s);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www|m)\./, '');
  let id = null;
  if (host === 'youtu.be') id = url.pathname.slice(1).split('/')[0];
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (url.searchParams.get('v')) id = url.searchParams.get('v');
    else {
      const m = url.pathname.match(/^\/(shorts|embed|live)\/([^/]+)/);
      if (m) id = m[2];
    }
  }
  return id && ID.test(id) ? id : null;
}

/** 從 Instagram Reel／貼文網址取出代碼（例如 Dey0OHeBpF3）；不是 Instagram 就回傳 null。 */
export function parseInstagramId(input) {
  let url;
  try {
    url = new URL(String(input ?? '').trim());
  } catch {
    return null;
  }
  if (url.hostname.replace(/^www\./, '') !== 'instagram.com') return null;
  const m = url.pathname.match(/^\/(reel|reels|p)\/([A-Za-z0-9_-]+)/);
  return m ? m[2] : null;
}

/**
 * 加一支作品：優先填掉同類型的第一個「作品準備中」佔位；沒有佔位就新增一筆。
 * 回傳新的清單（不改動原本的）和用到的作品 id。
 */
export function addWork(list, { youtubeId, instagramId, kind, title, featured = false, service = 'video', orientation }) {
  const source = youtubeId ? { youtubeId } : { instagramId };
  const key = youtubeId || instagramId;
  if (list.some((w) => w.youtubeId === key || w.instagramId === key)) throw new Error(`這支影片（${key}）已經在網站上了`);
  const works = list.map((w) => ({ ...w }));
  const shape = orientation || (kind === 'long' ? 'landscape' : 'portrait');
  const slot = works.find((w) => w.kind === kind && w.youtubeId === PLACEHOLDER);
  if (slot) {
    delete slot.youtubeId;
    Object.assign(slot, source, { title, orientation: shape, service });
    if (featured) slot.featured = true;
    return { works, id: slot.id };
  }
  const n = works.filter((w) => w.kind === kind).length + 1;
  let id = `${kind}-${n}`;
  while (works.some((w) => w.id === id)) id = `${kind}-${n}-${Math.random().toString(36).slice(2, 6)}`;
  const entry = { id, kind, orientation: shape, title, ...source, service };
  if (featured) entry.featured = true;
  works.push(entry);
  return { works, id };
}
