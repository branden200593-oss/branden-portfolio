import type { Project } from "./model";

// Named by the owner. No roles, dates, outcomes or photo permissions inferred.
// Hidden in all public-facing lists and case-study routes until reviewed.
export const drafts: Project[] = [
  [
    "04",
    "kinmen-schweitzer",
    "金門史懷哲教育服務",
    "Kinmen Education Service",
    "EDUCATION",
  ],
  [
    "05",
    "sustainable-picnic",
    "午間永續野餐會",
    "A Sustainable Lunch",
    "SUSTAINABILITY · SOCIAL INNOVATION",
  ],
  [
    "06",
    "digital-partners",
    "數位學伴",
    "Digital Learning Partners",
    "EDUCATION",
  ],
  [
    "07",
    "gengxing",
    "耕星社教育服務",
    "Gengxing Education Service",
    "EDUCATION · SOCIAL INNOVATION",
  ],
].map(([id, slug, name, short, cat]) => ({
  id,
  slug,
  name,
  short,
  cat,
  title: "",
  year: "年份待確認",
  tone: "stone",
  description:
    "素材整理中的未公開草稿。待核對參與角色、時程與可公開紀錄後，再整理為完整案例。",
  role: "待本人核對",
  context: [],
  actions: [],
  learnings: [],
  evidence: [
    "核對個人角色、時間與案例範圍",
    "確認照片人物公開授權與可公開成果來源",
  ],
  status: "hidden",
  cover: "",
  alt: "",
  imageCredit: "",
  imageApproved: false,
  featured: false,
  gallery: [],
}));
