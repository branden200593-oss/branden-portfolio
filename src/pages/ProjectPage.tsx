import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { usePortfolio } from "../store/context";
import SiteHeader from "../components/SiteHeader";
import PageFooter from "../components/PageFooter";
import LocalNotice from "../components/LocalNotice";
import NotFound from "./NotFound";
export default function ProjectPage() {
  const { slug } = useParams();
  const { projects, loading } = usePortfolio();
  const published = projects.filter((p) => p.status === "published");
  const project = published.find((p) => p.slug === slug);
  useEffect(() => {
    document.title = project
      ? `${project.name} — BRANDEN.`
      : "Project — BRANDEN.";
    return () => {
      document.title = "Branden Lee — Portfolio";
    };
  }, [project?.name]);
  if (loading)
    return (
      <main className="page-loading" aria-busy="true">
        Loading project…
      </main>
    );
  if (!project) return <NotFound />;
  const next = published[(published.indexOf(project) + 1) % published.length];
  return (
    <>
      <SiteHeader />
      <LocalNotice />
      <main id="main-content" className="case-page">
        <div className="case-topline">
          <Link to="/#projects">← Selected projects</Link>
          <span>{project.cat}</span>
        </div>
        <section className="case-heading">
          <p className="eyebrow">
            A FIELD NOTE /{" "}
            {String(published.indexOf(project) + 1).padStart(2, "0")}
          </p>
          <h1>
            {project.name}
            <span>.</span>
          </h1>
          <p className="case-english">{project.short}</p>
          <p className="case-tagline">{project.title}</p>
        </section>
        <div className={`case-cover ${project.tone}`}>
          {project.cover && project.imageApproved ? (
            <img src={project.cover} alt={project.alt} fetchPriority="high" />
          ) : (
            <div className="case-cover-art" aria-hidden="true">
              <span>{project.id}</span>
            </div>
          )}
          <span className="case-cover-caption">
            {project.cover
              ? project.imageCredit || project.name
              : "ORIGINAL VISUAL STUDY · PHOTOGRAPHY PENDING REVIEW"}
          </span>
          <a href="#case-story" aria-label="閱讀專案內容">
            <ArrowDown />
          </a>
        </div>
        <div className="case-intro">
          <p>{project.description}</p>
          <dl>
            <div>
              <dt>YEAR</dt>
              <dd>{project.year}</dd>
            </div>
            <div>
              <dt>ROLE</dt>
              <dd>{project.role}</dd>
            </div>
            <div>
              <dt>FOCUS</dt>
              <dd>{project.cat}</dd>
            </div>
          </dl>
        </div>
        <div className="case-story" id="case-story">
          {[
            ["01", "專案背景", project.context],
            ["02", "參與與行動", project.actions],
            ["03", "學習與成果", project.learnings],
            ["04", "紀錄與待確認資料", project.evidence],
          ].map(([number, title, paragraphs]) => (
            <section className="case-chapter" key={number as string}>
              <span className="small-label">
                {number as string} / FIELD NOTES
              </span>
              <div>
                <h2>{title as string}</h2>
                {(paragraphs as string[]).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        {published.length > 1 && (
          <Link
            className={`next-project ${next.tone}`}
            to={`/projects/${next.slug}/`}
          >
            <span className="small-label">NEXT STORY</span>
            <h2>{next.name}</h2>
            <span>{next.short}</span>
            <ArrowUpRight aria-hidden="true" />
          </Link>
        )}
      </main>
      <PageFooter />
    </>
  );
}
