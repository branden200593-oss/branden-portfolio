import { createContext, useContext } from "react";
import type { Project } from "../content/model";
export type PortfolioState = {
  projects: Project[];
  local: boolean;
  loading: boolean;
  storageError: string;
  save: (projects: Project[]) => Promise<void>;
  reset: () => Promise<void>;
};
export const PortfolioContext = createContext<PortfolioState | null>(null);
export function usePortfolio() {
  const value = useContext(PortfolioContext);
  if (!value) throw new Error("Portfolio provider is required.");
  return value;
}
