import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} — BRANDEN.`;
    return () => {
      document.title = "Branden Lee — Portfolio";
    };
  }, [title]);
}
