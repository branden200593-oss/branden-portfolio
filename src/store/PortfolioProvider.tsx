import { useEffect, useState, type ReactNode } from "react";
import { PortfolioContext } from "./context";
import { projects as seedProjects } from "../content/projects";
import { validateProjects, type Project } from "../content/model";
import { readDrafts, writeDrafts } from "./database";

export default function PortfolioProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [drafts, setDrafts] = useState<Project[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState("");
  useEffect(() => {
    let cancelled = false;
    readDrafts()
      .then((data) => {
        if (!cancelled) setDrafts(data);
      })
      .catch(() => {
        if (!cancelled)
          setStorageError(
            "此瀏覽器的草稿無法讀取，正在顯示網站原始內容；既有資料未被覆寫。",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  const save = async (items: Project[]) => {
    const data = validateProjects(items);
    await writeDrafts(data);
    setDrafts(data);
    setStorageError("");
  };
  const reset = async () => {
    await writeDrafts(null);
    setDrafts(null);
    setStorageError("");
  };
  return (
    <PortfolioContext.Provider
      value={{
        projects: drafts ?? seedProjects,
        local: drafts !== null,
        loading,
        storageError,
        save,
        reset,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}
