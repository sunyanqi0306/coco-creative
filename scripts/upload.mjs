// 把電腦裡改好的內容（價格、文字、作品…）發布到網站。
// 用法：npm run upload            （自動寫版本說明）
//      npm run upload -- "改價格"  （自己寫版本說明）
import { publish } from './publish-lib.mjs';

const message = process.argv.slice(2).join(' ').trim() || 'content: update site';
process.exit(publish(message) ? 0 : 1);
