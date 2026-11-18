// 全站共用資料：工作室名稱、LINE、導覽列。
// LINE 資料拿到之後，改這裡的 id / url / qr 三個值即可。

export const SITE = {
  name: 'COCO CREATIVE',
  short: 'COCO',
  tagline: '影音製作 · 社群經營 · 網站服務 · 行銷企劃',
  line: {
    id: 'LINE_ID_PLACEHOLDER',
    url: 'https://line.me/R/ti/p/LINE_ID_PLACEHOLDER',
    qr: '/images/line-qr-placeholder.svg',
  },
  nav: [
    { label: '作品', href: '/works/' },
    { label: '服務', href: '/services/' },
    { label: '關於', href: '/about/' },
    { label: '聯絡', href: '/contact/' },
  ],
};
