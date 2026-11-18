import { TERMS } from './pricing.ts';

export const PROCESS: { title: string; text: string }[] = [
  { title: '諮詢', text: '先加 LINE 聊聊需求、預算與時程，請先參考各服務起價。' },
  { title: '提案報價', text: '依需求提出企劃方向與正式報價。' },
  { title: '簽約付訂', text: `確認內容後簽約，並支付訂金 ${TERMS.deposit}，排入檔期。` },
  { title: '製作', text: '企劃、拍攝、剪輯或建置，過程中同步進度。' },
  { title: '修改', text: `含 ${TERMS.revisions}修改，超過另計；急件加價 ${TERMS.rush}。` },
  { title: '交付', text: '交付成品與檔案，付清尾款。' },
];
