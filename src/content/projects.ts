import type { Project } from "./model";
export type { Project } from "./model";

// Existing public website content and imagery, captured 2026-10-16. No new claims.
export const projects: Project[] = [
  {
    id: "01",
    slug: "eswatini",
    name: "史瓦帝尼國際教育",
    short: "Eswatini Education Project",
    title: "Learning beyond borders",
    cat: "INTERNATIONAL EDUCATION",
    year: "2026",
    tone: "terra",
    description:
      "走進史瓦帝尼的教室，在資訊教育與跨文化陪伴中，重新理解學習者的需要。",
    role: "課程股成員・教案設計・教學陪伴",
    context: [
      "參與清華大學史瓦帝尼國際志工團，團隊前往四所學校推動資訊教育。我的工作從課程準備走進教室，也從傳授操作轉向理解每位學生的學習步調。",
    ],
    actions: [
      "獨立準備資訊安全與全像投影兩套教案，將抽象概念轉化為可操作的活動。",
      "參與資訊教育教學與助教工作，依學生的操作程度調整引導。",
      "在滑鼠操作、文字選取等基礎任務中，以示範、等待與重複練習支持學習。",
    ],
    learnings: [
      "教育不只是完成教案。當我們願意放慢腳步，陪伴學生找到適合自己的方式，學習才有機會真正發生。",
    ],
    evidence: [
      "確認團隊最終服務人數、課程堂數及成果報告版本",
      "補充個人教案檔案與可公開的學習回饋",
    ],
    cover: "/images/teaching.webp",
    alt: "史瓦帝尼教室裡，志工與學生一起操作電腦",
    gallery: [
      {
        src: "/images/eswatini.webp",
        width: 1600,
        height: 1200,
        alt: "史瓦帝尼國際教育服務現場紀錄",
        credit: "",
        approved: true,
      },
      {
        src: "/images/classroom.webp",
        width: 1108,
        height: 1476,
        alt: "Branden 在史瓦帝尼教室進行資訊教育教學",
        credit: "",
        approved: true,
      },
    ],
    status: "published",
    imageApproved: true,
    imageCredit: "沿用既有公開作品集影像",
    featured: true,
  },
  {
    id: "02",
    slug: "sparks",
    name: "教院小火花",
    short: "Sparks of Education",
    title: "Small sparks, shared belonging",
    cat: "COMMUNITY · SOCIAL INNOVATION",
    year: "2026 · 進行中",
    tone: "stone",
    description:
      "以午間交流與永續野餐，回應教育學院學生對歸屬感與跨系連結的需求。",
    role: "計畫成員・午間活動企劃與執行・總務",
    context: [
      "教院小火花關注學生的社群互動與歸屬感。我負責午間交流活動與總務工作，將跨系交流的想法轉化為能實際參與的校園活動。",
    ],
    actions: [
      "規劃午間永續野餐會，以分組互動與主題活動降低陌生人交流的門檻。",
      "協調引導員、報到與活動物資，讓短短的午休時間也能形成有品質的相遇。",
      "結合自備餐具與日常永續行動，讓議題透過參與被理解。",
    ],
    learnings: [
      "社群的形成，需要有人安排一個能安心加入的起點。活動設計的細節，決定了人與人是否有機會真正認識。",
    ],
    evidence: [
      "補充兩場午間活動的實際出席與回饋",
      "補上團隊共同成果與個人負責範圍的最終說明",
    ],
    cover: "/images/sparks.webp",
    alt: "教院小火花午間野餐會，學生圍坐草地交流",
    gallery: [
      {
        src: "/images/sparks2.webp",
        width: 1600,
        height: 900,
        alt: "教院小火花活動現場紀錄",
        credit: "",
        approved: true,
      },
    ],
    status: "published",
    imageApproved: true,
    imageCredit: "沿用既有公開作品集影像",
    featured: true,
  },
  {
    id: "03",
    slug: "sustainability",
    name: "校園永續實踐",
    short: "Campus Sustainability",
    title: "Making sustainability tangible",
    cat: "SUSTAINABILITY · EDUCATION",
    year: "2026",
    tone: "moss",
    description:
      "從現場採訪、文字報導到活動協作，讓永續議題成為可理解、可參與的日常。",
    role: "第四屆清華校園永續大使・報導與活動協作",
    context: [
      "在清華大學擔任第四屆校園永續大使，接觸食農教育與校園永續行動，練習將現場觀察轉譯為更容易被看見的公共溝通。",
    ],
    actions: [
      "撰寫大新竹食農教育嘉年華相關報導，整理現場觀察與訪談。",
      "參與永續倡議、成果展示與活動執行，累積公共議題溝通經驗。",
      "將永續學習連結至教育活動，思考學生如何從日常參與開始行動。",
    ],
    learnings: [
      "永續不只是一組目標。它也存在於地方合作、資源連結，以及每個人能參與的一個小小選擇之中。",
    ],
    evidence: [
      "補上可公開的報導連結與個人署名版本",
      "確認永續大使任期與個人參與成果",
    ],
    cover: "/images/sustainability.webp",
    alt: "校園永續大使在教室分享永續議題",
    gallery: [
      {
        src: "/images/sustainability2.webp",
        width: 1134,
        height: 1444,
        alt: "校園永續行動現場紀錄",
        credit: "",
        approved: true,
      },
    ],
    status: "published",
    imageApproved: true,
    imageCredit: "沿用既有公開作品集影像",
    featured: true,
  },
];
