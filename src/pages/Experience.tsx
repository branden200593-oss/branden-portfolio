import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import PageFooter from "../components/PageFooter";
import { usePageTitle } from "../hooks/usePageTitle";
import { journey } from "../content/journey";
import { usePortfolio } from "../store/context";

export default function Experience() {
  usePageTitle("Experience & Journey");
  const [year, setYear] = useState("all");
  const { projects } = usePortfolio();
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="editorial-page experience-page">
        <header className="editorial-heading">
          <p className="eyebrow">EXPERIENCE / A CONTINUING JOURNEY</p>
          <h1>
            Learning
            <br />
            <em>through doing.</em>
          </h1>
          <p className="editorial-deck">走進現場，讓經驗慢慢成為觀點。</p>
        </header>
        <div className="filter-bar" role="group" aria-label="依年份檢視經歷">
          {[
            ["all", "所有年份"],
            ...journey.map((item) => [item.year, item.year]),
          ].map(([value, label]) => (
            <button
              key={value}
              aria-pressed={year === value}
              onClick={() => setYear(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="experience-list" aria-live="polite">
          {journey
            .filter((item) => year === "all" || item.year === year)
            .map((item) => (
              <article className="experience-entry" key={item.year}>
                <span className="experience-year">{item.year}</span>
                <div>
                  <p className="small-label">{item.label}</p>
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                  <ul className="experience-tags">
                    {item.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <div className="experience-links">
                    {item.links.map((slug) => {
                      const project = projects.find(
                        (p) => p.slug === slug && p.status === "published",
                      );
                      return project ? (
                        <Link key={slug} to={`/projects/${slug}/`}>
                          {project.name} ↗
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
              </article>
            ))}
        </div>
        <div className="experience-note">
          <span className="small-label">THE THREAD BETWEEN EXPERIENCES</span>
          <p>
            從班級陪伴、跨文化教學到校園倡議，持續練習同一件事：
            <br />
            <strong>理解人的需要，再找到行動的起點。</strong>
          </p>
          <Link className="text-link" to="/about/">
            更多關於我 ↗
          </Link>
        </div>
      </main>
      <PageFooter />
    </>
  );
}
