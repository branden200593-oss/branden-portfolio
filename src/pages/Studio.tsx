import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  Plus,
  Save,
  Upload,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";
import { usePortfolio } from "../store/context";
import { validateProjects, type Project } from "../content/model";
import SiteHeader from "../components/SiteHeader";
import PageFooter from "../components/PageFooter";

function emptyProject(): Project {
  return {
    id: crypto.randomUUID(),
    slug: `new-project-${crypto.randomUUID().slice(0, 6)}`,
    name: "新作品",
    short: "New project",
    title: "",
    cat: "EDUCATION",
    year: "年份待確認",
    tone: "stone",
    description: "",
    role: "角色待確認",
    context: [],
    actions: [],
    learnings: [],
    evidence: [],
    status: "hidden",
    cover: "",
    alt: "",
    imageApproved: false,
    imageCredit: "",
  };
}
async function prepareImage(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("請使用 JPEG、PNG 或 WebP；不接受 SVG 或其他檔案。");
  if (file.size > 10_000_000) throw new Error("圖片請小於 10 MB。");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    if (image.naturalWidth * image.naturalHeight > 40_000_000)
      throw new Error("圖片尺寸過大，請先縮小到四千萬像素以下。");
    const ratio = Math.min(
      1,
      1600 / image.naturalWidth,
      1600 / image.naturalHeight,
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * ratio);
    canvas.height = Math.round(image.naturalHeight * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("瀏覽器無法處理這張圖片。");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/webp", 0.82);
    if (data.length > 2_500_000)
      throw new Error("圖片仍過大，請換較小的圖片。");
    return data;
  } finally {
    URL.revokeObjectURL(url);
  }
}
export default function Studio() {
  const { projects, loading, local, save, reset, storageError } =
    usePortfolio();
  const [form, setForm] = useState<Project | null>(null),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const importRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    document.title = "個人草稿工作室 — BRANDEN.";
    return () => {
      document.title = "Branden Lee — Portfolio";
    };
  }, []);
  useEffect(() => {
    if (!loading && !form)
      setForm(structuredClone(projects[0] ?? emptyProject()));
  }, [loading, projects, form]);
  useEffect(() => {
    if (!dirty) return;
    const guard = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);
  useEffect(() => {
    if (!dirty) return;
    const guard = (event: MouseEvent) => {
      const anchor = (event.target as Element)?.closest?.("a[href]");
      if (anchor && !window.confirm("有尚未儲存的修改。確定離開工作室嗎？")) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    document.addEventListener("click", guard, true);
    return () => document.removeEventListener("click", guard, true);
  }, [dirty]);
  function update<K extends keyof Project>(key: K, value: Project[K]) {
    setForm((p) => (p ? { ...p, [key]: value } : p));
    setDirty(true);
    setMessage("");
    setError("");
  }
  function choose(p: Project) {
    if (dirty && !window.confirm("有尚未儲存的修改。要放棄並切換作品嗎？"))
      return;
    setForm(structuredClone(p));
    setDirty(false);
    setError("");
    setMessage("");
  }
  async function persist() {
    if (!form || busy) return;
    setBusy(true);
    setError("");
    try {
      const next = projects.some((p) => p.id === form.id)
        ? projects.map((p) => (p.id === form.id ? form : p))
        : [...projects, form];
      await save(next);
      setDirty(false);
      setMessage("已儲存至此瀏覽器，可立即查看本裝置預覽。尚未對外發布。");
    } catch (e) {
      setError(e instanceof Error ? e.message : "儲存失敗，請稍後再試。");
    } finally {
      setBusy(false);
    }
  }
  async function reorder(index: number, direction: number) {
    if (dirty || busy) return;
    setBusy(true);
    try {
      const next = [...projects];
      [next[index], next[index + direction]] = [
        next[index + direction],
        next[index],
      ];
      await save(next);
      setMessage("本裝置的作品順序已儲存。");
      setError("");
    } catch {
      setError("排序未能儲存，請稍後再試。");
    } finally {
      setBusy(false);
    }
  }
  async function toggle(p: Project) {
    if (dirty || busy) return;
    setBusy(true);
    try {
      const next = projects.map((x) =>
        x.id === p.id
          ? {
              ...x,
              status: (x.status === "published"
                ? "hidden"
                : "published") as Project["status"],
            }
          : x,
      );
      await save(next);
      if (form?.id === p.id) setForm(next.find((x) => x.id === p.id)!);
      setMessage("本裝置的顯示狀態已更新。");
    } catch (e) {
      setError(e instanceof Error ? e.message : "無法更新狀態。");
    } finally {
      setBusy(false);
    }
  }
  function exportBackup() {
    const blob = new Blob(
      [JSON.stringify({ schemaVersion: 1, projects }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "branden-portfolio-drafts.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("草稿備份已匯出；請保管其中的照片與個人內容。");
  }
  async function importBackup(file: File) {
    if (file.size > 25_000_000) {
      setError("備份檔請小於 25 MB。");
      return;
    }
    setBusy(true);
    try {
      const raw = JSON.parse(await file.text());
      if (raw.schemaVersion !== 1) throw new Error("不支援這個備份版本。");
      const data = validateProjects(raw.projects);
      if (!window.confirm("這會取代此瀏覽器的全部作品草稿。要繼續嗎？")) return;
      await save(data);
      setForm(structuredClone(data[0] ?? emptyProject()));
      setDirty(false);
      setError("");
      setMessage("備份已匯入此瀏覽器，沒有對外發布。");
    } catch (e) {
      setError(e instanceof Error ? e.message : "備份讀取失敗。");
    } finally {
      setBusy(false);
    }
  }
  async function restoreOriginal() {
    if (
      !window.confirm(
        "這會移除此瀏覽器的全部個人草稿與照片，回到網站原始內容。建議先匯出備份。確定繼續嗎？",
      )
    )
      return;
    setBusy(true);
    try {
      await reset();
      setForm(null);
      setDirty(false);
      setMessage("已恢復網站原始內容。");
      setError("");
    } catch {
      setError("還原失敗，草稿尚未清除。");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="studio-page">
        <div className="studio-heading">
          <p className="small-label">A SPACE TO SHAPE YOUR STORIES</p>
          <h1>
            個人草稿
            <br />
            <em>工作室。</em>
          </h1>
          <p>整理作品、試排順序，讓故事慢慢成形。</p>
        </div>
        <div className="studio-boundary">
          <strong>僅儲存在此瀏覽器，不會修改公開網站。</strong>
          <p>
            此工作室沒有公共寫入接口，也不使用帳號或密碼。你可以在本裝置試編輯、上傳圖片與預覽；換裝置、清除瀏覽器資料或切換網址，草稿不會自動同步。可透過備份保留資料，之後由維護流程發布。
          </p>
        </div>
        <div className="studio-tools">
          <button
            className="dark-pill"
            onClick={() => choose(emptyProject())}
            disabled={busy}
          >
            <Plus size={16} />
            新增作品
          </button>
          <Link className="light-pill" to="/">
            查看本裝置首頁 <ArrowUpRight size={16} />
          </Link>
          <button
            onClick={exportBackup}
            className="light-pill"
            disabled={loading || busy || dirty}
          >
            <Download size={16} />
            匯出備份
          </button>
          <button
            onClick={() => importRef.current?.click()}
            className="light-pill"
            disabled={busy || dirty}
          >
            <Upload size={16} />
            匯入備份
          </button>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importBackup(file);
              e.target.value = "";
            }}
          />
        </div>
        <div aria-live="polite" role="status" className="studio-message">
          {message}
        </div>
        {(error || storageError) && (
          <div role="alert" className="studio-error">
            {error || storageError}
          </div>
        )}
        {loading ? (
          <p aria-busy="true">讀取草稿中…</p>
        ) : (
          <div className="studio-layout">
            <aside className="studio-list" aria-label="作品清單">
              <p className="small-label">
                {projects.length} PROJECTS /{" "}
                {local ? "LOCAL DRAFT" : "SITE CONTENT"}
              </p>
              {projects.map((p, i) => (
                <div
                  key={p.id}
                  className={`studio-list-item ${form?.id === p.id ? "current" : ""}`}
                >
                  <button
                    className="studio-project-select"
                    onClick={() => choose(p)}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <b>{p.name}</b>
                    <small>
                      {p.status === "published" ? "本機預覽顯示" : "已隱藏"}
                    </small>
                  </button>
                  <div className="studio-row-tools">
                    <button
                      aria-label={`上移 ${p.name}`}
                      disabled={i === 0 || dirty || busy}
                      onClick={() => void reorder(i, -1)}
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      aria-label={`下移 ${p.name}`}
                      disabled={i === projects.length - 1 || dirty || busy}
                      onClick={() => void reorder(i, 1)}
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      aria-label={`${p.status === "published" ? "隱藏" : "顯示"} ${p.name}`}
                      disabled={dirty || busy}
                      onClick={() => void toggle(p)}
                    >
                      {p.status === "published" ? (
                        <Eye size={16} />
                      ) : (
                        <EyeOff size={16} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="reset-drafts"
                disabled={busy || dirty || !local}
                onClick={() => void restoreOriginal()}
              >
                還原網站原始內容
              </button>
            </aside>
            {form && (
              <form
                className="studio-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  void persist();
                }}
              >
                <div className="studio-form-heading">
                  <h2>{form.name || "編輯作品"}</h2>
                  <span>{dirty ? "尚未儲存" : "已載入"}</span>
                </div>
                <div className="form-two">
                  {(
                    [
                      ["name", "作品中文名稱"],
                      ["short", "作品英文名稱"],
                      ["slug", "網址代稱"],
                      ["year", "年份／狀態"],
                      ["cat", "專案類別"],
                      ["role", "個人角色"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key}>
                      {label}
                      <input
                        name={key}
                        value={form[key]}
                        maxLength={240}
                        required={
                          key === "name" || key === "short" || key === "slug"
                        }
                        onChange={(e) => update(key, e.target.value)}
                      />
                    </label>
                  ))}
                </div>
                <label>
                  作品標語
                  <input
                    name="title"
                    value={form.title}
                    maxLength={240}
                    onChange={(e) => update("title", e.target.value)}
                  />
                </label>
                <label>
                  作品摘要
                  <textarea
                    name="description"
                    value={form.description}
                    rows={3}
                    maxLength={1500}
                    onChange={(e) => update("description", e.target.value)}
                  />
                </label>
                {(
                  [
                    ["context", "專案背景"],
                    ["actions", "參與與行動"],
                    ["learnings", "學習與成果"],
                    ["evidence", "紀錄與待確認資料"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key}>
                    {label}
                    <span className="field-help">
                      每行一段，僅填寫可確認的內容。
                    </span>
                    <textarea
                      name={key}
                      value={form[key].join("\n")}
                      rows={4}
                      onChange={(e) => update(key, e.target.value.split("\n"))}
                    />
                  </label>
                ))}
                <div className="form-two">
                  <label>
                    視覺色調
                    <select
                      name="tone"
                      aria-label="視覺色調"
                      value={form.tone}
                      onChange={(e) =>
                        update("tone", e.target.value as Project["tone"])
                      }
                    >
                      <option value="terra">陶土 Terra</option>
                      <option value="stone">霧灰 Stone</option>
                      <option value="moss">苔綠 Moss</option>
                    </select>
                  </label>
                  <label>
                    本裝置預覽狀態
                    <select
                      name="status"
                      aria-label="本裝置預覽狀態"
                      value={form.status}
                      onChange={(e) =>
                        update("status", e.target.value as Project["status"])
                      }
                    >
                      <option value="published">顯示</option>
                      <option value="hidden">隱藏</option>
                    </select>
                  </label>
                </div>
                <fieldset className="image-field">
                  <legend>封面圖片</legend>
                  <p className="field-help">
                    JPEG、PNG、WebP，最大 10
                    MB。圖片將縮小並重新編碼，不保留原始
                    EXIF。此操作沒有上傳到伺服器。
                  </p>
                  {form.cover ? (
                    <img
                      src={form.cover}
                      alt={form.alt || "正在編輯的封面預覽"}
                    />
                  ) : (
                    <div className={`studio-image-placeholder ${form.tone}`}>
                      封面預覽
                    </div>
                  )}
                  <label className="upload-label">
                    選擇封面圖片
                    <input
                      aria-label="選擇封面圖片"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={busy}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        e.target.value = "";
                        if (!file) return;
                        setBusy(true);
                        setError("");
                        try {
                          const data = await prepareImage(file);
                          setForm((p) =>
                            p ? { ...p, cover: data, imageApproved: false } : p,
                          );
                          setDirty(true);
                        } catch (err) {
                          setError(
                            err instanceof Error
                              ? err.message
                              : "無法處理圖片。",
                          );
                        } finally {
                          setBusy(false);
                        }
                      }}
                    />
                  </label>
                  {form.cover && (
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => {
                        update("cover", "");
                        update("alt", "");
                        update("imageApproved", false);
                      }}
                    >
                      移除此封面
                    </button>
                  )}
                  <label>
                    圖片替代文字
                    <input
                      name="alt"
                      value={form.alt}
                      maxLength={240}
                      onChange={(e) => update("alt", e.target.value)}
                    />
                  </label>
                  <label>
                    來源／攝影署名
                    <input
                      name="imageCredit"
                      value={form.imageCredit}
                      maxLength={240}
                      onChange={(e) => update("imageCredit", e.target.value)}
                    />
                  </label>
                  <label className="checkbox-label">
                    <input
                      name="imageApproved"
                      type="checkbox"
                      checked={form.imageApproved}
                      onChange={(e) =>
                        update("imageApproved", e.target.checked)
                      }
                    />
                    我已確認這張照片可公開使用，並已取得其中可辨識人物所需的同意。
                  </label>
                </fieldset>
                <div className="studio-save">
                  <button
                    type="submit"
                    className="dark-pill"
                    disabled={busy || !dirty}
                  >
                    <Save size={16} />
                    {busy ? "處理中…" : "儲存至此瀏覽器"}
                  </button>
                  {!dirty &&
                    form.status === "published" &&
                    projects.some((p) => p.id === form.id) && (
                      <Link
                        className="light-pill"
                        to={`/projects/${form.slug}/`}
                      >
                        預覽案例頁 <ArrowUpRight size={16} />
                      </Link>
                    )}
                  <span>此操作不會對外發布。</span>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
      <PageFooter />
    </>
  );
}
