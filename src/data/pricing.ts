// 全站價格都在這個檔案。改數字 → 全站更新。
// amount 填數字（新台幣），填 null 會顯示「洽詢」。unit 是「／」後面的字。

export type PriceItem = { label: string; amount: number | null; unit?: string; note?: string; from?: boolean };
export type PriceTable = { title: string; columns?: string[]; rows: { label: string; cells: PriceItem[] }[]; note?: string };
export type GroupId = 'video' | 'social' | 'web' | 'marketing';
export type PriceGroup = { id: GroupId; no: string; title: string; en: string; summary: string; points: string[]; headline: PriceItem; tables: PriceTable[] };
export type Tax = { enabled: boolean; mode: 'exclusive' | 'inclusive'; rate: number };

// 稅務設定：目前不開發票，enabled 保持 false，網站上不會出現任何稅務字樣。
// 之後能開發票時：enabled 改 true；mode 'exclusive' 會在價格後加「（未稅）」，'inclusive' 會把價格乘上 (1 + rate)。
export const TAX: Tax = { enabled: false, mode: 'exclusive', rate: 0.05 };

// 合作規則（使用者之後提供）
export const TERMS = { deposit: '50%', revisions: '2 次', rush: '20%' };

const p = (amount: number | null, unit?: string, extra: Partial<PriceItem> = {}): PriceItem => ({ label: '', amount, unit, ...extra });

export const GROUPS: PriceGroup[] = [
  {
    id: 'video',
    headline: p(1000), // 服務總覽卡片上顯示的起價
    no: '01',
    title: '影音製作',
    en: 'Video Production',
    summary: '長短影音的企劃、拍攝、剪輯，實體拍攝與 AI 影片都能做。',
    points: [
      '長影音（8～20 分鐘）與短影音（30／60／90 秒）',
      '實體拍攝：一人機組，彈性按支或按時段計',
      '純 AI 影片：自有 AI 自動化流程，可快速量產',
      'AI 數位人／AI 代言：固定虛擬主持人，持續產出口播短影音',
    ],
    tables: [
      {
        title: '短影音',
        columns: ['30 秒', '60 秒', '90 秒'],
        rows: [
          { label: '企劃腳本', cells: [p(1000), p(1500), p(2000)] },
          { label: '剪輯', cells: [p(1000), p(1500), p(2000)] },
          { label: 'AI 影片', cells: [p(500), p(1000), p(1500)] },
        ],
      },
      {
        title: '短影音拍攝',
        rows: [
          { label: '單支', cells: [p(1000, '支')] },
          { label: '半天（4 小時）', cells: [p(3000)] },
          { label: '全天（8 小時）', cells: [p(6000)] },
        ],
        note: '半天可以一次拍好多支短影音。',
      },
      {
        title: '長影音',
        rows: [
          { label: '企劃腳本', cells: [p(3000)] },
          { label: '拍攝・半天（4 小時）', cells: [p(3000)] },
          { label: '拍攝・全天（8 小時）', cells: [p(6000)] },
          { label: '剪輯・8～15 分鐘', cells: [p(4500)] },
          { label: '剪輯・15～20 分鐘', cells: [p(5500)] },
        ],
      },
      {
        title: 'AI 數位人／AI 代言',
        rows: [{ label: '建置', cells: [p(15000, undefined, { from: true })] }],
      },
    ],
  },
  {
    id: 'social',
    headline: p(28000, '月'), // 服務總覽卡片上顯示的起價
    no: '02',
    title: '社群經營',
    en: 'Social & Ads',
    summary: '社群代操加上廣告投放：內容做出來，也幫你推出去。',
    points: ['IG、FB、Threads、TikTok 內容規劃與經營', '貼文、限動、短影音排程發布', 'Meta、Google、YouTube 廣告投放與優化'],
    tables: [
      {
        title: '社群經營',
        rows: [
          { label: '社群代操', cells: [p(28000, '月', { from: true })] },
          { label: '廣告投放', cells: [p(4000, '月', { from: true, note: '廣告預算 20%，最低 NT$4,000／月（不含廣告費）' })] },
        ],
      },
    ],
  },
  {
    id: 'web',
    headline: p(20000), // 服務總覽卡片上顯示的起價
    no: '03',
    title: '網站服務',
    en: 'Web',
    summary: '網站架設、後期更新管理與 SEO，上線之後也有人顧。',
    points: ['形象網站、作品集網站架設', '內容更新、維護與備份', 'SEO：讓客戶在 Google 找得到你'],
    tables: [
      {
        title: '網站服務',
        rows: [
          { label: '網站架設', cells: [p(20000, undefined, { from: true })] },
          { label: '後期更新管理', cells: [p(4000, '月', { from: true })] },
          { label: 'SEO', cells: [p(10000, '月', { from: true })] },
        ],
      },
    ],
  },
  {
    id: 'marketing',
    headline: p(15000, '案'), // 服務總覽卡片上顯示的起價
    no: '04',
    title: '行銷企劃',
    en: 'Marketing Strategy',
    summary: '從品牌定位到活動企劃，把每一支影片放在對的策略裡。',
    points: ['品牌與受眾分析', '年度／季度行銷策略', '活動企劃與內容規劃'],
    tables: [
      {
        title: '行銷企劃',
        rows: [{ label: '行銷企劃', cells: [p(15000, '案', { from: true })] }],
      },
    ],
  },
];

export const PACKAGES = [
  {
    title: '品牌影音包',
    price: 19800,
    compareAt: 25500,
    items: ['1 支長影音（8～15 分）', '4 支 60 秒短影音', '全部企劃腳本', '全天拍攝（8 小時）', '全部剪輯'],
    note: '同一天拍攝，長片與短影音共用素材。',
  },
];
