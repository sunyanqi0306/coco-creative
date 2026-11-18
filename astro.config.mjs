// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 部署到 GitHub Pages：網址是 https://<帳號>.github.io/<repo>/
// 換成自訂網域時：SITE_URL 改成網域、BASE_PATH 改成 '/'，並加 public/CNAME。
const site = process.env.SITE_URL || 'https://example.github.io';
const base = process.env.BASE_PATH || '/coco-creative';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
});
