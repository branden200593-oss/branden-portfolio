# BRANDEN. Portfolio

Branden Lee（李好）的教育創新、國際教育、永續與社會創新作品集。
沿用原有 Vite / React / TypeScript 網站，保留電影式 Hero、可滑動的 CSS 3D
Showcase、Selected Projects、About、Journey 與 Contact，並加入獨立案例頁。

## 開發與測試

Node.js 22.12+（此環境使用 24.19）。

```sh
npm ci
npm run dev -- --port 5173 --strictPort
npm run build
npm run test:browser
npm run test:studio
npm run test:hmr
```

正式輸出位於 `dist/`；`build` 包含嚴格 TypeScript 檢查。Vite HMR 與 React
Fast Refresh 在 CSS、元件與專案資料修改後更新畫面並保留輪播狀態。
正式輸出可用 `npm run preview -- --port 4173 --strictPort` 驗證；瀏覽器測試支援
`BASE_URL=http://127.0.0.1:4173`（一般瀏覽器測試需要尾端 `/`）。

測試使用系統 Chromium（預設 `/usr/bin/chromium`，可由
`CHROMIUM_EXECUTABLE_PATH` 指定）。測試報告與截圖在忽略的 `.artifacts/`。
這些是 Chromium 裝置模擬；不宣稱實體 Safari 或真實使用者效能測試已通過。

## 頁面與編輯位置

- `/`：完整首頁與可互動 3D 作品展示。
- `/projects/eswatini/`：史瓦帝尼國際教育。
- `/projects/sparks/`：教院小火花。
- `/projects/sustainability/`：校園永續實踐。
- `/studio/`：僅儲存在目前瀏覽器的個人草稿工作室。
- 未知路徑：站內 404 畫面。

`src/App.tsx` 是原有首頁；`src/content/projects.ts` 是正式編入網站的型別化內容。
`src/content/model.ts` 定義資料與匯入驗證。`src/pages/` 放案例與工作室。

## 免費簡化作品管理的邊界

工作室可新增、編輯、排序、隱藏、處理圖片、預覽案例，以及匯入／匯出備份。
資料存放 IndexedDB，**只影響此瀏覽器、此網站來源**，不會自動發布或跨裝置同步。
沒有公共寫入 API、密碼欄位、假登入或聲稱已公開的按鈕。

上傳只接受 JPEG/PNG/WebP，限制大小並經 Canvas 重編碼；不保留原始 EXIF。
圖片必須填寫替代文字並確認人物／使用授權後才能儲存。匯入限制大小、欄位、
網址代稱、重複資料與圖片來源；不接受外部圖片 URL、SVG 或可執行內容。
正式共用管理日後可採 Git OAuth CMS；需要新增帳號權限時再取得確認。

## 內容與素材狀態

姓名、學校與核心領域來自使用者明確提供的資料。案例名稱已知，但具體年份、
分工與成果尚待素材核對；頁面清楚標示待確認，未編造數字或經歷。
目前維持原創 CSS 視覺佔位圖，尚未公開任何個人／學生照片，也沒有猜測聯絡地址。
Google Drive 讀取目前受到環境網路規則限制。素材核對及人物照片授權是後續步驟。

## Netlify 測試部署

沿用 `branden-portfolio-v1`，site ID `4e04a51a-fad2-4280-8edf-91ac2e4e3b28`。
建置 `npm run build`，發布目錄 `dist/`。`public/_headers` 與 `_redirects` 也會
進入直接 API 部署，提供 SPA 路由、安全標頭與 noindex。Noindex 並非存取保護。

維護者以安全注入的 `NETLIFY_AUTH_TOKEN` 執行：

```sh
python scripts/deploy-netlify.py --check
python scripts/deploy-netlify.py
```

此腳本只對既有專案的 `codex-preview` 分支別名部署，從不建立新站、變更登入保護、
替換正式站或寫入 token。需驗證 API 回覆與實際網址後才能回報已部署。
環境目前對 Netlify API 回傳代理 403，且尚未提供 Netlify 授權；未宣稱已部署。

## GitHub 與維護

原始 repository 初始只有 README；現有網站來源為使用者提供的 Vite ZIP 與後續
保留式修改。同步使用普通提交與非強制推送。後續可用自然語言指定修改區塊，
由維護者修改、測試並更新同一測試部署；不需要使用者操作 Terminal 或下載 HTML。
先前 Mac 啟動輔助檔保留，雲端測試部署是目前優先流程。
