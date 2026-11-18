# COCO CREATIVE 官方網站

用 [Astro](https://astro.build) 做的靜態網站，部署在 GitHub Pages。所有內容都放在 `src/data/` 的資料檔，**改資料檔就好，不用動版面**。

> ⚠ 這個 repo 是公開的。不要把報價單、客戶資料、合約放進來。

## 本機開發

```bash
npm install
npm run dev        # 開發預覽 http://localhost:4321/coco-creative/
npm test           # 建置並執行所有檢查
```

需要 Node.js 22.23 以上（測試建議用 Node 24 以上）。

## 常見更新

### 新增作品：`src/data/works.ts`

1. 把影片上傳到 YouTube，隱私設定選 **「不公開」(Unlisted)**。不要選「私人」，否則網站上播不出來。
2. 複製一筆 `WORKS` 裡的資料，修改這些欄位：

| 欄位 | 說明 |
|---|---|
| `id` | 不重複的代號，例如 `short-11` |
| `kind` | `long` 長片／`short` 短影音／`ai` AI 影片 |
| `orientation` | `landscape` 橫式／`portrait` 直式 |
| `title` | 作品標題 |
| `youtubeId` | 網址 `watch?v=` 後面那串，例如 `https://youtu.be/AbC123xyz` 就填 `AbC123xyz` |
| `image` | 圖片作品才填（目前沒用到），檔案放在 `public/images/` |
| `client` / `hideClient` | 客戶名稱；`hideClient: true` 時網站上不顯示 |
| `featured` | `true` 會出現在首頁精選 |
| `service` | 會顯示在哪一個服務頁：`video`／`social`／`web`／`marketing` |

拿客戶作品當展示前，記得先取得客戶同意。

長期合作案例卡在同一個檔案的 `CASES`。

### 改價格：`src/data/pricing.ts`

- 每個價格都在 `GROUPS` 裡，例如 `p(1500)` 就是 NT$1,500；`p(3000, '月')` 會顯示 NT$3,000／月。
- 包套方案在 `PACKAGES`。
- 合作規則（訂金、修改次數、急件加價）在 `TERMS`。
- **稅**：`TAX.enabled` 目前是 `false`，網站上不會出現任何稅務字樣。之後能開發票時：
  - `mode: 'exclusive'` → 價格後面加「（未稅）」
  - `mode: 'inclusive'` → 價格自動乘上 `1 + rate`

### 換 LINE 資料：`src/data/site.ts`

修改 `line.url`（目前是 `https://lin.ee/55uyXCb`）。QR Code 是從 LINE 官方帳號後台下載的圖，放在 `public/images/line-qr.jpg`，換網址時要一起換這張圖。`line.id` 有填才會顯示在聯絡頁。

### 團隊介紹：`src/data/team.ts`

目前不放照片，卡片上只顯示編號和文字。之後要放照片：把照片存到 `public/images/`，再在那位成員的資料加上 `photo: '/images/檔名.jpg'`。

### 首頁主視覺影片

把 10 秒內、幾 MB 的作品片段存成 `public/hero.mp4`（可以另外放 `public/hero.jpg` 當封面），首頁就會自動靜音循環播放。

### 分享預覽圖

`public/og.png` 是 `node scripts/make-og.mjs` 產生的。之後有 Logo 可以直接換掉這張圖。

## 部署

推送到 `main` 分支後，GitHub Actions（`.github/workflows/deploy.yml`）會自動建置並發布。

第一次設定：

1. 到 repo 的 **Settings → Pages**，把 Source 選成 **GitHub Actions**。
2. 網址會是 `https://<帳號>.github.io/<repo 名稱>/`。

### 換成自訂網域

1. 在 repo 的 **Settings → Secrets and variables → Actions → Variables** 新增兩個變數：
   - `SITE_URL` = `https://你的網域`
   - `BASE_PATH` = `/`
2. 新增 `public/CNAME` 檔案，內容只寫網域，例如 `cococreative.tw`。
3. 到網域商設定 DNS，並在 Settings → Pages 填入網域。
