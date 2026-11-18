// 作品清單。新增一支作品 = 在 WORKS 加一筆。
// YouTube 影片請用「不公開」(Unlisted)，不要用「私人」，否則嵌入後看不到。
// youtubeId 是網址 watch?v= 後面那串，例如 https://youtu.be/AbC123xyz → 'AbC123xyz'。
// 還沒有影片時保留 'YOUTUBE_ID_PLACEHOLDER'，網站會顯示「作品準備中」。

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

const Y = PLACEHOLDER;

export const WORKS: Work[] = [
  { id: 'long-1', kind: 'long', orientation: 'landscape', title: '長期合作｜長片 01', youtubeId: Y, client: '長期合作客戶', hideClient: true, featured: true, service: 'video' },
  { id: 'long-2', kind: 'long', orientation: 'landscape', title: '長期合作｜長片 02', youtubeId: Y, client: '長期合作客戶', hideClient: true, featured: true, service: 'video' },
  { id: 'long-3', kind: 'long', orientation: 'landscape', title: '長期合作｜長片 03', youtubeId: Y, client: '長期合作客戶', hideClient: true, service: 'video' },
  { id: 'long-4', kind: 'long', orientation: 'landscape', title: '長期合作｜長片 04', youtubeId: Y, client: '長期合作客戶', hideClient: true, service: 'video' },
  { id: 'long-5', kind: 'long', orientation: 'landscape', title: '長片 05', youtubeId: Y, service: 'video' },
  { id: 'long-6', kind: 'long', orientation: 'landscape', title: '長片 06', youtubeId: Y, service: 'video' },
  ...Array.from({ length: 10 }, (_, i): Work => ({
    id: `short-${i + 1}`, kind: 'short', orientation: 'portrait', title: `短影音 ${String(i + 1).padStart(2, '0')}`,
    youtubeId: Y, featured: i < 4, service: i < 6 ? 'video' : 'social',
  })),
  { id: 'ai-1', kind: 'ai', orientation: 'portrait', title: 'AI 短影音 01', youtubeId: Y, featured: true, service: 'video' },
  { id: 'ai-2', kind: 'ai', orientation: 'portrait', title: 'AI 短影音 02', youtubeId: Y, service: 'video' },
  { id: 'ai-3', kind: 'ai', orientation: 'portrait', title: 'AI 短影音 03', youtubeId: Y, service: 'video' },
];

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
