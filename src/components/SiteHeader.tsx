import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
export default function SiteHeader() {
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setMenu(false);
  }, [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const home = pathname === "/";
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className={`site-header ${home ? "" : "subpage-header"}`}>
        <Link className="wordmark" to="/" aria-label="BRANDEN. Home">
          BRANDEN<span>.</span>
        </Link>
        <nav
          id="primary-navigation"
          aria-label="Main navigation"
          className={menu ? "open" : ""}
        >
          {[
            ["work", "WORK"],
            ["about", "ABOUT"],
            ["journey", "JOURNEY"],
            ["contact", "CONTACT"],
          ].map(([id, text]) => (
            <a
              key={id}
              href={`${home ? "" : "/"}#${id}`}
              onClick={() => setMenu(false)}
            >
              {text}
            </a>
          ))}
        </nav>
        <button
          className="mobile-menu"
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          aria-controls="primary-navigation"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
        <div className="availability">
          <span className="dot" /> PORTFOLIO · 2026
        </div>
      </header>
    </>
  );
}
