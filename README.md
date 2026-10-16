# BRANDEN. Portfolio

Branden Lee（李好）的教育創新、國際教育、永續發展與社會創新作品集。
沿用既有 Vite / React / TypeScript 原始碼改版；保留 Hero、可拖曳／觸控的 CSS 3D
Showcase、Selected Projects、三個案例及本機草稿工作室。

## 開發與驗證

Node 24（.nvmrc），最低 22.12。`npm ci` 安裝鎖定依賴。

```sh
npm run dev -- --port 5173 --strictPort
npm run build
npm run test:hmr
npm run preview -- --port 4173 --strictPort
BASE_URL=http://127.0.0.1:4173 npm run test:browser
BASE_URL=http://127.0.0.1:4173 npm run test:routes
BASE_URL=http://127.0.0.1:4173 node tests/layout.cjs
BASE_URL=http://127.0.0.1:4173 npm run test:studio
npm run test:editorial
```

Build 包含 ESLint 與嚴格 TypeScript。dist 是 Netlify 發布目錄。
HMR 測試會暫時放入不可見探針並在 finally 還原；不可同時進行正式建置。
瀏覽器測試預設用系統 Chromium，未安裝時使用 Playwright 管理的 Chromium。
`BROWSER_ENGINE=webkit` 切換 WebKit；CI 會安裝需要的引擎與系統依賴。
Linux WebKit 不代表實體 macOS Safari 已通過測試。

## 網站與內容

- `/`：電影式首頁、互動 3D、精選案例、理念與聯絡。
- `/about/`：背景、關注議題、教育、方法與未來方向。
- `/projects/`：可依主題篩選的完整已發布作品庫。
- `/experience/`：2024–2026 經歷與年份篩選。
- `/projects/eswatini/`、`/projects/sparks/`、`/projects/sustainability/`：案例。
- `/studio/`：僅此瀏覽器的草稿管理。

`src/content/projects.ts` 是三個公開案例；`drafts.ts` 是四個隱藏候選草稿；
`journey.ts` 保留既有網站經歷。`model.ts` 為型別與匯入驗證。
`src/design-system.css` 是共用深色設計系統；`fonts.css` 載入四套自託管字體。

## 草稿管理的實際邊界

可新增／編輯／排序／隱藏作品、設定首頁精選、處理封面圖片及匯入／匯出備份。
資料存在 IndexedDB，僅影響同一來源、同一瀏覽器；不自動公開、同步或跨裝置。
既有 IndexedDB 資料優先保留，不因原始碼更新而覆寫。

沒有公開寫入 API、密碼欄位或假登入。圖片需確認使用及人物授權，Canvas 重編碼
不保留 EXIF；匯入嚴格限制欄位、大小、slug、來源，拒絕 SVG／外部 URL。
共享 CMS 需另行取得 Git OAuth／儲存服務授權，不視為已完成。

## 版本與部署

既有正式站來自 Netlify Drop 的 Next.js 靜態輸出；GitHub main 只有 README，
不等同正式站來源。此改版從完整的 codex/portfolio-v1 分支繼續，未重新生成專案，
並保留線上已有內容及影像。詳見 docs/MATERIALS.md。

獨立分支 codex/dark-editorial，回復標籤 archive/pre-dark-20261016。
沿用 Netlify branden-portfolio-v1（4e04a51a-fad2-4280-8edf-91ac2e4e3b28）。
正式站在使用者審查前不得取代。Git 整合的目前狀態與下一步見 docs/DEPLOYMENT.md。

GitHub Actions quality.yml 包含 lint/typecheck/build、HMR、Chromium/WebKit
渲染及互動測試；preview.yml 在 PR 等待正確 commit 的 Netlify 預覽，並驗證實際
頁面與安全標頭。Ready 狀態不足以驗收。實際執行紀錄見 docs/VALIDATION.md。

後續直接用自然語言指定頁面與區塊；維護者修改、測試、普通 commit/push 並更新
審查版本，使用者不需操作 Terminal 或下載 ZIP。正式合併仍需本人確認。
