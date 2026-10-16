import { validateProjects, type Project } from "../content/model";
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("branden-portfolio-studio", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("drafts");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () =>
      reject(new Error("瀏覽器未允許儲存資料，請檢查隱私或儲存空間設定。"));
    req.onblocked = () =>
      reject(new Error("請關閉其他作品管理分頁後再試一次。"));
  });
}
export async function readDrafts(): Promise<Project[] | null> {
  const db = await openDatabase();
  try {
    const data = await new Promise<unknown>((resolve, reject) => {
      const req = db
        .transaction("drafts", "readonly")
        .objectStore("drafts")
        .get("projects");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return data === undefined ? null : validateProjects(data);
  } finally {
    db.close();
  }
}
export async function writeDrafts(projects: Project[] | null) {
  const data = projects === null ? null : validateProjects(projects);
  const db = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("drafts", "readwrite");
      if (data === null) tx.objectStore("drafts").delete("projects");
      else tx.objectStore("drafts").put(data, "projects");
      tx.oncomplete = () => resolve();
      tx.onerror = () =>
        reject(new Error("資料未能儲存，可能超過瀏覽器空間限制。"));
      tx.onabort = () => reject(new Error("儲存已中止，請稍後重試。"));
    });
  } finally {
    db.close();
  }
}
