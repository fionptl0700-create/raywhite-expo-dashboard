# RayWhite Expo Dashboard — Claude 工作規則

## 專案
- `index.html`：線上 Dashboard（GitHub Pages）。`RayWhite_Dashboard.html`、`GitHub上傳用_index.html` 為同內容副本。
- `data.json`：資料來源，由 `.github/workflows/update-dashboard.yml` 跑 `scripts/update-data.js` 自動更新並 commit。不要手改 data.json。

## Skill 自動路由（強制）
接到任務時，先比對下表；命中就**先呼叫對應 skill 再動手**，不用等使用者指名。多個命中時依序全用。

| 任務訊號 | 必用 skill |
|---|---|
| 改 Dashboard 版面、配色、字體、圖表樣式、RWD、可讀性 | `ui-ux-pro-max` → 收尾用 `impeccable` 做 polish/audit |
| 「看起來很醜／很 AI／不專業」、UI 檢查、上線前把關 | `impeccable` |
| 組織架構圖、流程圖、SOP、中台架構、泳道、漏斗、時間軸、甘特 | `diagram-design` |
| 展會：要不要參展、攤位 ROI、展前展中展後流程、名單轉換 | `events` |
| 加盟招商方案、加盟金／權益包裝、成交誘因、保證條款 | `offers` |
| 年度／季度行銷或招商計畫、預算分配、優先順序 | `marketing-plan` |
| 招商簡報、one-pager、異議處理話術、提案書、battle card | `sales-enablement` |
| 競品（其他房仲品牌）定價、定位、動態 | `competitor-profiling`，需要近期輿情時加 `last30days` |
| 找潛在加盟主、名單分級、誰先打 | `prospecting` |
| 名單階段定義、MQL/SQL、CRM 流程、行銷與業務權責交接 | `revops` |
| 轉介紹／加盟主推薦獎勵制度 | `referrals` |
| 招商頁、DM、廣告文案、標題 | `copywriting` |
| 為什麼客戶不買、定錨、稀缺、框架效應 | `marketing-psychology` |
| 中文文稿完成後（提案、公告、文案、報告） | **一律最後過一次 `humanizer-zh`** |
| 「最近大家怎麼說 X」、趨勢、市場聲量 | `last30days` |
| Dashboard 任何圖表（Chart.js）、KPI 卡、配色、圖例、tooltip、新增指標 | **先 `dataviz`** → 再 `ui-ux-pro-max` → 收尾 `impeccable` |
| 新做一頁 Dashboard／報表頁／把資料變成可分享頁面 | `data:build-dashboard` → `dataviz` → `impeccable` |
| 企劃、提案、報告要統一視覺（配色＋字體主題） | `anthropic-skills:theme-factory` |
| 要做 PPT／簡報檔（.pptx） | `anthropic-skills:pptx` → 套 `theme-factory` → 圖用 `diagram-design` |
| 發布成網頁 Artifact（企劃頁、展會一頁式） | `artifact-design` |

### 設計美化鏈（強制）
任何會給人看的視覺產出（Dashboard、企劃、簡報、一頁式），依序走：
1. 內容 skill（events / offers / marketing-plan…）
2. 主題統一：`theme-factory`（簡報、文件）或 `ui-ux-pro-max`（Dashboard、網頁）
3. 圖：架構／流程用 `diagram-design`；數據圖表用 `dataviz`
4. 視覺把關：`impeccable` audit + polish
5. 文字收尾：`humanizer-zh`

### 企劃必附圖（強制）
凡企劃類產出（行銷／招商／展會計畫、加盟方案、提案書、營運制度），內容 skill 跑完後，**交付前一律用 `diagram-design` 畫圖並嵌入企劃**，不等使用者要求。最低配置：
1. **時間軸／甘特**：執行節點、里程碑、負責人
2. **權責泳道**：誰負責哪段、交接點在哪
3. **轉換漏斗或預算流向**（依內容擇一）：名單轉換率、預算分配到成果

依內容加畫：組織架構、中台架構、決策樹、SOP 流程。
例外：單頁 one-pager、純文案、短話術可不畫。
流程順序：內容 skill → `diagram-design` → `humanizer-zh`（文字收尾）。

## 輸出規則
- 繁體中文。結論先行、條列、高密度，不寫空話。
- 數字要可追溯到 `data.json` 或明確來源；推論和事實分開標示。
- 改 HTML 時三個副本要同步，或先問使用者以哪個為主。
