import { TAX, type PriceItem, type Tax } from '../data/pricing.ts';

const nt = (n: number) => 'NT$' + n.toLocaleString('en-US');

/** 價格顯示文字：NT$1,500、NT$3,000／半天、洽詢。稅務設定關閉時不加任何稅字。 */
export function formatPrice(item: PriceItem, tax: Tax = TAX): string {
  if (item.amount === null) return '洽詢';
  const amount = tax.enabled && tax.mode === 'inclusive' ? Math.round(item.amount * (1 + tax.rate)) : item.amount;
  let text = nt(amount);
  if (item.unit) text += '／' + item.unit;
  if (tax.enabled && tax.mode === 'exclusive') text += '（未稅）';
  return text;
}

/** 金額本身（給包套、比較價用）。 */
export function formatAmount(amount: number, tax: Tax = TAX): string {
  return formatPrice({ label: '', amount }, tax);
}
