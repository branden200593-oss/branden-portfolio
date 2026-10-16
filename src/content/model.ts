export type Project = {
  featured?: boolean;
  gallery?: { src: string; alt: string; credit: string; approved: boolean }[];
  id: string;
  slug: string;
  name: string;
  title: string;
  short: string;
  cat: string;
  year: string;
  tone: "terra" | "stone" | "moss";
  description: string;
  role: string;
  context: string[];
  actions: string[];
  learnings: string[];
  evidence: string[];
  status: "published" | "hidden";
  cover: string;
  alt: string;
  imageApproved: boolean;
  imageCredit: string;
};
const fields = [
  "id",
  "slug",
  "name",
  "title",
  "short",
  "cat",
  "year",
  "description",
  "role",
  "cover",
  "alt",
  "imageCredit",
] as const;
export function validateProjects(value: unknown): Project[] {
  if (!Array.isArray(value) || value.length > 30)
    throw new Error("作品資料須為陣列，最多 30 件。");
  const slugs = new Set<string>(),
    ids = new Set<string>();
  return value.map((raw: unknown) => {
    if (!raw || typeof raw !== "object") throw new Error("作品格式不正確。");
    const p = raw as Record<string, unknown>;
    for (const key of fields) {
      if (typeof p[key] !== "string")
        throw new Error(`作品欄位 ${key} 必須是文字。`);
      if (
        (p[key] as string).length >
        (key === "cover" ? 2_500_000 : key === "description" ? 1500 : 240)
      )
        throw new Error(`欄位 ${key} 過長。`);
    }
    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug as string) ||
      slugs.has(p.slug as string)
    )
      throw new Error("網址代稱須唯一，並使用小寫英文、數字或連字號。");
    if (!(p.id as string).trim() || ids.has(p.id as string))
      throw new Error("作品識別碼不可重複。");
    if (!(p.name as string).trim() || !(p.short as string).trim())
      throw new Error("請填寫作品中英文名稱。");
    slugs.add(p.slug as string);
    ids.add(p.id as string);
    if (!["terra", "stone", "moss"].includes(p.tone as string))
      throw new Error("請選擇有效的作品色調。");
    if (!["published", "hidden"].includes(p.status as string))
      throw new Error("作品顯示狀態不正確。");
    if (typeof p.imageApproved !== "boolean")
      throw new Error("圖片授權欄位不正確。");
    const cover = p.cover as string;
    if (
      cover &&
      !/^data:image\/(?:webp|png|jpeg);base64,[a-zA-Z0-9+/=]+$/.test(cover) &&
      !/^\/images\/[a-zA-Z0-9/_-]+\.(?:webp|png|jpg|jpeg)$/.test(cover)
    )
      throw new Error("圖片僅接受本機圖片檔，不接受外部連結或 SVG。");
    if (cover && (!(p.alt as string).trim() || !p.imageApproved))
      throw new Error("使用圖片前請填寫替代文字並確認可公開使用。");
    const lists: Record<string, string[]> = {};
    for (const key of ["context", "actions", "learnings", "evidence"]) {
      const list = p[key];
      if (
        !Array.isArray(list) ||
        list.length > 12 ||
        list.some((x) => typeof x !== "string" || x.length > 3000)
      )
        throw new Error(`${key} 請使用文字段落，最多 12 段。`);
      lists[key] = list;
    }
    const galleryRaw = p.gallery ?? [];
    if (!Array.isArray(galleryRaw) || galleryRaw.length > 12)
      throw new Error("圖集最多 12 張圖片。");
    const gallery = galleryRaw.map((raw: unknown) => {
      if (!raw || typeof raw !== "object") throw new Error("圖集格式不正確。");
      const image = raw as Record<string, unknown>;
      if (
        typeof image.src !== "string" ||
        image.src.length > 2_500_000 ||
        (!/^data:image\/(?:webp|png|jpeg);base64,[a-zA-Z0-9+/=]+$/.test(
          image.src,
        ) &&
          !/^\/images\/[a-zA-Z0-9/_-]+\.(?:webp|png|jpg|jpeg)$/.test(image.src))
      )
        throw new Error("圖集圖片來源不正確。");
      if (
        typeof image.alt !== "string" ||
        !image.alt.trim() ||
        image.alt.length > 240 ||
        typeof image.credit !== "string" ||
        image.credit.length > 240 ||
        image.approved !== true
      )
        throw new Error("圖集必須包含替代文字及已確認的使用授權。");
      return {
        src: image.src,
        alt: image.alt,
        credit: image.credit,
        approved: true,
      };
    });
    if (p.featured !== undefined && typeof p.featured !== "boolean")
      throw new Error("精選狀態不正確。");
    // Construct an allowlisted record instead of retaining arbitrary imported properties.
    return {
      gallery,
      featured: p.featured !== false,
      id: p.id as string,
      slug: p.slug as string,
      name: p.name as string,
      title: p.title as string,
      short: p.short as string,
      cat: p.cat as string,
      year: p.year as string,
      tone: p.tone as Project["tone"],
      description: p.description as string,
      role: p.role as string,
      context: lists.context,
      actions: lists.actions,
      learnings: lists.learnings,
      evidence: lists.evidence,
      status: p.status as Project["status"],
      cover,
      alt: p.alt as string,
      imageApproved: p.imageApproved,
      imageCredit: p.imageCredit as string,
    };
  });
}
