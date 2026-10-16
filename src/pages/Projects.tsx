import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import PageFooter from "../components/PageFooter";
import LocalNotice from "../components/LocalNotice";
import { usePortfolio } from "../store/context";
import { usePageTitle } from "../hooks/usePageTitle";

const categories = [
  "All",
  "Education",
  "Sustainability",
  "International",
  "Social Innovation",
];
export default function Projects() {
  usePageTitle("All Projects");
  const [category, setCategory] = useState("All");
  const { projects } = usePortfolio();
  const published = projects.filter((p) => p.status === "published");
  const visible = published.filter(
    (p) =>
      category === "All" ||
      p.cat.toLowerCase().includes(category.toLowerCase()),
  );
  return (
    <>
      <SiteHeader />
      <LocalNotice />
      <main id="main-content" className="editorial-page projects-page">
        <header className="editorial-heading">
          <p className="eyebrow">PROJECT INDEX / EDUCATION & IMPACT</p>
          <h1>
            Stories
            <br />
            <em>from the field.</em>
          </h1>
          <p className="editorial-deck">從教室到社群，以實踐理解世界。</p>
          <p className="editorial-summary">
            每個案例都從一個真實的需要開始。這裡記錄參與的角色、採取的行動，以及仍在延伸的提問。
          </p>
        </header>
        <div className="filter-bar" role="group" aria-label="依主題篩選作品">
          {categories.map((value) => (
            <button
              key={value}
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <p className="index-count" role="status">
          {String(visible.length).padStart(2, "0")} STORIES /{" "}
          {category.toUpperCase()}
        </p>
        <div className="project-index-grid">
          {visible.map((p, i) => (
            <article className="index-project" key={p.id}>
              <Link to={`/projects/${p.slug}/`} aria-label={`閱讀 ${p.name}`}>
                <div className={`index-project-photo ${p.tone}`}>
                  {p.cover && p.imageApproved ? (
                    <img
                      src={p.cover}
                      alt={p.alt}
                      loading={i === 0 ? "eager" : "lazy"}
                      width="1200"
                      height="900"
                    />
                  ) : (
                    <span className="index-art" aria-hidden="true">
                      {p.id}
                    </span>
                  )}
                  <span className="index-open" aria-hidden="true">
                    <ArrowUpRight />
                  </span>
                </div>
                <div className="index-project-meta">
                  <span>{p.cat}</span>
                  <span>{p.year}</span>
                </div>
                <h2>{p.name}</h2>
                <p className="index-project-english">{p.short}</p>
              </Link>
              <p>{p.description}</p>
              <p className="index-role">
                <span>MY ROLE</span>
                {p.role}
              </p>
            </article>
          ))}
        </div>
        {!visible.length && (
          <p className="empty-index">這個主題的作品仍在整理中。</p>
        )}
        <div className="index-endnote">
          <p>More questions. More possibilities.</p>
          <Link className="text-link" to="/experience/">
            探索完整歷程 <ArrowUpRight size={16} />
          </Link>
        </div>
      </main>
      <PageFooter />
    </>
  );
}
