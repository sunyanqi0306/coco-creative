// 全站共用資料：工作室名稱、LINE、導覽列。
// LINE 資料拿到之後，改這裡的 id / url / qr 三個值即可。

export const SITE = {
  name: 'COCO CREATIVE',
  short: 'COCO',
  tagline: '影音製作 · 社群經營 · 網站服務 · 行銷企劃',
  line: {
    id: '', // 填了（例如 '@coco'）聯絡頁就會顯示 LINE ID；空白就不顯示
    url: 'https://lin.ee/55uyXCb',
    qr: '/images/line-qr.svg', // 換網址後執行 node scripts/make-line-qr.mjs 重新產生
  },
  nav: [
    { label: '作品', href: '/works/' },
    { label: '服務', href: '/services/' },
    { label: '關於', href: '/about/' },
    { label: '聯絡', href: '/contact/' },
  ],
};
