// 作品清單放在 works.json。新增作品最簡單的方式：在終端機執行 npm run add-work。
// YouTube 影片請用「不公開」(Unlisted)，不要用「私人」，否則嵌入後看不到。
// 還沒有影片時 youtubeId 是 'YOUTUBE_ID_PLACEHOLDER'，網站會顯示「作品準備中」。
import worksData from './works.json' with { type: 'json' };

export type WorkKind = 'long' | 'short' | 'ai' | 'plan';
export type Work = {
  id: string;
  kind: WorkKind;
  orientation: 'landscape' | 'portrait';
  title: string;
  youtubeId?: string;
  image?: string; // 企劃截圖等圖片作品，放在 public/images/ 底下
  client?: string;
  hideClient?: boolean; // true：網站上不顯示客戶名稱
  featured?: boolean; // true：出現在首頁精選
  service: 'video' | 'social' | 'web' | 'marketing';
};

export const PLACEHOLDER = 'YOUTUBE_ID_PLACEHOLDER';

export const KINDS: { id: WorkKind; label: string }[] = [
  { id: 'long', label: '長片' },
  { id: 'short', label: '短影音' },
  { id: 'ai', label: 'AI 影片' },
];

export const WORKS = worksData as Work[];

// 長期合作案例卡（可以有多張）
export const CASES = [
  {
    title: '長期合作｜YouTube 頻道長片',
    client: '長期合作客戶',
    hideClient: true,
    count: 48,
    years: '___',
    roles: ['企劃', '拍攝', '剪輯'],
    workIds: ['long-1', 'long-2', 'long-3', 'long-4'],
  },
];
