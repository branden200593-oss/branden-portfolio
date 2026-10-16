import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowDown, MoveLeft, MoveRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Link } from "react-router-dom";
import { usePortfolio } from "./store/context";
import SiteHeader from "./components/SiteHeader";
import LocalNotice from "./components/LocalNotice";
import { journey } from "./content/journey";

export default function App() {
  const [active, setActive] = useState(0);
  const [copyStatus, setCopyStatus] = useState("");
  const { projects: allProjects } = usePortfolio();
  const projects = allProjects
    .filter((p) => p.status === "published" && p.featured !== false)
    .slice(0, 4);
  const reduce = useReducedMotion();
  const spot = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: spot,
    offset: ["start start", "end start"],
  });
  const parallax = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const project = projects[active] ?? projects[0];
  const swipe = useRef({
    x: 0,
    y: 0,
    dragged: false,
    pointerId: null as number | null,
  });
  useEffect(() => {
    if (active >= projects.length) setActive(0);
  }, [active, projects.length]);
  function carouselKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!projects.length) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActive((a) => (a + 1) % projects.length);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((a) => (a + projects.length - 1) % projects.length);
    }
  }
  function move(e: React.MouseEvent<HTMLDivElement>) {
    if (!spot.current || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    spot.current.style.setProperty(
      "--mx",
      `${((e.clientX - r.left) / r.width) * 100}%`,
    );
    spot.current.style.setProperty(
      "--my",
      `${((e.clientY - r.top) / r.height) * 100}%`,
    );
  }
  return (
    <>
      <SiteHeader />
      <LocalNotice />
      <main id="main-content">
        <section className="hero" id="home" onMouseMove={move} ref={spot}>
          <motion.div
            className="hero-art"
            aria-hidden="true"
            style={{ y: reduce ? 0 : parallax }}
          >
            <img
              className="hero-photo"
              src="/images/hero.webp"
              alt=""
              width="1600"
              height="1067"
              fetchPriority="high"
            />
            <div className="hero-glow" />
            <div className="hero-disc" />
            <div className="hero-silhouette" />
            <div className="hero-grain" />
          </motion.div>
          <div className="hero-topline">
            BRANDEN LEE <span>—</span> EDUCATION & IMPACT
          </div>
          <motion.div
            className="hero-content"
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
          >
            <p className="eyebrow">AN EXPLORATION OF LEARNING AND CHANGE</p>
            <h1>
              Learning
              <br />
              <em>beyond</em> boundaries<span className="period">.</span>
            </h1>
            <p className="hero-cn">以教育回應差異，用行動連結世界。</p>
            <p className="hero-intro">
              Education. Sustainability. Human connection.
            </p>
            <a className="pill" href="#work">
              EXPLORE SELECTED WORK <ArrowUpRight size={17} />
            </a>
          </motion.div>
          <div className="hero-foot">
            <span>BASED IN TAIWAN</span>
            <a href="#showcase">
              SCROLL TO EXPLORE <ArrowDown size={15} />
            </a>
            <span>EDUCATION · PEOPLE · POSSIBILITY</span>
          </div>
        </section>
        <section className="intro-band" id="work">
          <div className="small-label">01 / BRANDEN LEE 李好</div>
          <div className="intro-band-copy">
            <h2>
              Ideas become meaningful
              <br />
              when they meet <em>people.</em>
            </h2>
            <p>
              我是李好，就讀國立清華大學教育學院。從跨文化教室到校園社群，關注教育創新、國際教育、永續發展與社會創新，探索讓學習與生活更靠近的方法。
            </p>
            <Link className="text-link" to="/about/">
              MEET BRANDEN <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
        {project ? (
          <section className="showcase" id="showcase">
            <div className="showcase-header">
              <p className="eyebrow">AN INTERACTIVE EXPLORATION</p>
              <span>DRAG TO EXPLORE. FOLLOW THE STORIES.</span>
            </div>
            <div
              className="carousel-stage"
              role="region"
              aria-roledescription="carousel"
              aria-label="Selected projects. Use arrow keys or swipe to explore."
              tabIndex={0}
              onKeyDown={carouselKey}
              onPointerDown={(e) => {
                swipe.current = {
                  x: e.clientX,
                  y: e.clientY,
                  dragged: false,
                  pointerId: e.pointerId,
                };
              }}
              onPointerCancel={() => {
                swipe.current.pointerId = null;
                swipe.current.dragged = false;
              }}
              onPointerUp={(e) => {
                if (swipe.current.pointerId !== e.pointerId) return;
                swipe.current.pointerId = null;
                const dx = e.clientX - swipe.current.x;
                const dy = e.clientY - swipe.current.y;
                if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
                  swipe.current.dragged = true;
                  setActive(
                    (a) =>
                      (a + (dx < 0 ? 1 : projects.length - 1)) %
                      projects.length,
                  );
                }
              }}
              onClickCapture={(e) => {
                if (swipe.current.dragged) {
                  e.preventDefault();
                  e.stopPropagation();
                  swipe.current.dragged = false;
                }
              }}
            >
              <div
                className="carousel-orbit"
                aria-label="Interactive selected projects"
              >
                {projects.map((p, i) => {
                  const delta =
                    (i - active + projects.length) % projects.length;
                  const pos =
                    delta === 0
                      ? "center"
                      : delta === 1
                        ? "right"
                        : delta === projects.length - 1
                          ? "left"
                          : "offstage";
                  return (
                    <button
                      key={p.id}
                      className={`orbit-card ${pos} ${p.tone}`}
                      onClick={() => setActive(i)}
                      aria-label={`View ${p.short}`}
                      aria-pressed={i === active}
                      tabIndex={pos === "offstage" ? -1 : 0}
                      aria-hidden={pos === "offstage" ? true : undefined}
                    >
                      {p.cover && p.imageApproved && (
                        <img
                          className="project-photo"
                          src={p.cover}
                          alt=""
                          loading="lazy"
                        />
                      )}
                      <span className="orbit-number" aria-hidden="true">
                        {p.id}
                      </span>
                      <div className="orb-text">
                        <span>{p.cat}</span>
                        <b>{p.short}</b>
                        <span>{p.year}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="showcase-bottom">
              <div aria-live="polite" aria-atomic="true">
                <span className="small-label">
                  FEATURED PROJECT / {project.id}
                </span>
                <h3>{project.short}</h3>
                <Link className="story-link" to={`/projects/${project.slug}/`}>
                  閱讀專案故事 <ArrowUpRight size={15} />
                </Link>
                <p>{project.description}</p>
              </div>
              <div className="carousel-actions">
                <button
                  onClick={() =>
                    setActive(
                      (a) => (a + projects.length - 1) % projects.length,
                    )
                  }
                  aria-label="Previous project"
                >
                  <MoveLeft />
                </button>
                <span>
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}
                </span>
                <button
                  onClick={() => setActive((a) => (a + 1) % projects.length)}
                  aria-label="Next project"
                >
                  <MoveRight />
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="showcase" id="showcase">
            <p>作品整理中。請稍後再回來看看。</p>
          </section>
        )}
        <section className="selected" id="projects">
          <div className="section-lead">
            <span className="small-label">02 / STORIES IN ACTION</span>
            <h2>
              Selected
              <br />
              <em>projects.</em>
            </h2>
            <p>
              Each project is a reminder that impact starts with understanding,
              curiosity, and action.
            </p>
          </div>
          <div className="project-grid">
            {projects.map((p, i) => (
              <Link
                to={`/projects/${p.slug}/`}
                aria-label={`Read ${p.short}`}
                className={`project-card ${p.tone} ${i === 0 ? "large" : ""}`}
                key={p.id}
              >
                {p.cover && p.imageApproved && (
                  <img
                    className="project-photo"
                    src={p.cover}
                    alt=""
                    loading="lazy"
                  />
                )}
                <div className="project-meta">
                  <span>
                    {p.id} / {p.cat}
                  </span>
                  <span>{p.year}</span>
                </div>
                <span className="project-watermark" aria-hidden="true">
                  {p.id}
                </span>
                <div className="project-heading">
                  <div>
                    <p className="project-caption">{p.title}</p>
                    <h3>
                      <span className="project-chinese">{p.name}</span>
                      {p.short}
                    </h3>
                  </div>
                  <span className="project-arrow" aria-hidden="true">
                    <ArrowUpRight size={24} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <p className="image-note">
            PHOTOGRAPHS FROM THE FIELD / 持續走進現場
          </p>
          <Link className="text-link all-projects-link" to="/projects/">
            VIEW ALL PROJECTS <ArrowUpRight size={16} />
          </Link>
        </section>
        <section className="about" id="about">
          <span className="small-label">03 / A LITTLE ABOUT ME</span>
          <div className="about-grid">
            <div>
              <p className="section-english">Always a learner.</p>
              <h2>
                從理解一個人，
                <br />
                <em>開始改變一點點。</em>
              </h2>
              <figure className="portrait-placeholder">
                <img
                  src="/images/classroom.webp"
                  alt="Branden 在史瓦帝尼教室進行資訊教育教學"
                  loading="lazy"
                  width="1200"
                  height="900"
                />
                <figcaption>ALWAYS A LEARNER / ESWATINI</figcaption>
              </figure>
            </div>
            <div className="about-body">
              <p className="lead">
                我就讀國立清華大學教育學院，雙專長為永續發展與英語教學。
              </p>
              <p>
                從金門的班級、星光班的課後陪伴，到史瓦帝尼的資訊教室，我持續學習如何回應不同的學習需要。
              </p>
              <p>
                這些現場讓我逐漸相信：好的教育設計，始於願意傾聽。當我們看見人的差異，科技、課程與社群才有機會成為支持學習的橋梁。
              </p>
              <div className="expertise">
                <span>EDUCATION</span>
                <span>SUSTAINABILITY</span>
                <span>SOCIAL INNOVATION</span>
                <span>CROSS-CULTURAL LEARNING</span>
              </div>
              <Link className="text-link" to="/about/">
                更多關於我 <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
        <section className="journey" id="journey">
          <span className="small-label">04 / ON THE WAY</span>
          <div className="journey-grid">
            <h2>
              Still learning.
              <br />
              <em>Always moving.</em>
            </h2>
            <div className="timeline">
              {journey.map(({ year, label, title }) => (
                <Link className="timeline-row" to="/experience/" key={year}>
                  <span>{year}</span>
                  <div>
                    <h3>{label}</h3>
                    <p>{title}</p>
                  </div>
                  <ArrowUpRight size={18} />
                </Link>
              ))}
              <Link className="text-link" to="/experience/">
                THE FULL JOURNEY <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
        <footer id="contact">
          <span className="small-label">LET'S CONNECT</span>
          <h2>
            Good things begin
            <br />
            with a <em>conversation.</em>
          </h2>
          <p>For collaborations, opportunities, and shared ideas.</p>
          <div className="footer-links">
            <div className="contact-actions">
              <a
                className="contact-email"
                href="mailto:branden200593@gmail.com"
              >
                branden200593@gmail.com
              </a>
              <button
                className="copy-email"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      "branden200593@gmail.com",
                    );
                    setCopyStatus("已複製");
                  } catch {
                    setCopyStatus("請點選電郵連結");
                  }
                }}
              >
                複製
              </button>
              <span className="copy-status" role="status" aria-live="polite">
                {copyStatus}
              </span>
            </div>
            <a href="#home">BACK TO TOP ↑</a>
          </div>
          <div className="footer-bottom">
            <b>BRANDEN.</b>
            <span>© 2026 BRANDEN LEE</span>
            <Link to="/studio">個人草稿工作室 ↗</Link>
          </div>
        </footer>
      </main>
    </>
  );
}
