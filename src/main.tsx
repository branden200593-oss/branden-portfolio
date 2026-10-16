import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import App from "./App";
import PortfolioProvider from "./store/PortfolioProvider";
import ProjectPage from "./pages/ProjectPage";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Experience from "./pages/Experience";
import "./fonts.css";
import "./style.css";
import "./design-system.css";
const Studio = lazy(() => import("./pages/Studio"));
function RoutePosition() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      } else window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <PortfolioProvider>
      <RoutePosition />
      <Suspense
        fallback={
          <main className="page-loading" aria-busy="true">
            Loading…
          </main>
        }
      >
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </PortfolioProvider>
  </BrowserRouter>,
);
