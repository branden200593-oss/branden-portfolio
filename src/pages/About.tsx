import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import PageFooter from "../components/PageFooter";
import { usePageTitle } from "../hooks/usePageTitle";

export default function About() {
  usePageTitle("About Branden Lee");
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="editorial-page about-page">
        <header className="editorial-heading">
          <p className="eyebrow">ABOUT / BRANDEN LEE 李好</p>
          <h1>
            Always <em>a learner.</em>
          </h1>
          <p className="editorial-deck">
            從理解一個人，
            <br />
            開始改變一點點。
          </p>
        </header>
        <section className="profile-spread">
          <figure>
            <img
              src="/images/classroom.webp"
              alt="Branden 在史瓦帝尼教室進行資訊教育教學"
              width="1200"
              height="900"
            />
            <figcaption>01 / LEARNING IN THE FIELD · ESWATINI</figcaption>
          </figure>
          <div>
            <span className="small-label">WHO I AM</span>
            <h2>李好，Branden Lee</h2>
            <p className="lead">
              我就讀國立清華大學教育學院，雙專長為永續發展與英語教學。
            </p>
            <p>
              從金門的班級、星光班的課後陪伴，到史瓦帝尼的資訊教室，我持續學習如何回應不同的學習需要。
            </p>
            <p>
              這些現場讓我逐漸相信：好的教育設計，始於願意傾聽。當我們看見人的差異，科技、課程與社群才有機會成為支持學習的橋梁。
            </p>
            <Link className="text-link" to="/experience/">
              走過的學習現場 <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
        <section className="editorial-section">
          <div className="editorial-section-label">
            <span className="small-label">01 / INTERESTS</span>
            <h2>關注的議題</h2>
          </div>
          <div className="interest-grid">
            {[
              [
                "Education Innovation",
                "教育創新",
                "從學習者的需要出發，思考課程與科技如何支持不同的學習步調。",
              ],
              [
                "International Education",
                "國際教育",
                "在跨文化教室裡練習傾聽，讓理解走在方法之前。",
              ],
              [
                "Sustainability",
                "永續發展",
                "把公共議題轉譯為日常能理解、能參與的教育與行動。",
              ],
              [
                "Social Innovation",
                "社會創新",
                "透過活動與社群設計，讓人與人有機會建立連結。",
              ],
            ].map(([en, zh, text], i) => (
              <article key={en}>
                <span className="small-label">0{i + 1}</span>
                <h3>{zh}</h3>
                <p className="interest-english">{en}</p>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="editorial-section">
          <div className="editorial-section-label">
            <span className="small-label">02 / EDUCATION</span>
            <h2>在清華，從教育出發。</h2>
          </div>
          <div className="editorial-prose">
            <p className="lead">
              國立清華大學
              <br />
              教育學院學士班
            </p>
            <p>
              雙專長：永續發展與英語教學。透過課程、教育服務與校園實踐，持續探索學習者差異與跨領域教育的連結。
            </p>
            <Link className="text-link" to="/projects/">
              閱讀實踐案例 <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>
        <section className="editorial-section">
          <div className="editorial-section-label">
            <span className="small-label">03 / MY APPROACH</span>
            <h2>先理解，再設計。</h2>
          </div>
          <div className="approach-list">
            {[
              [
                "Listen",
                "傾聽現場",
                "先看見人的差異，理解參與者正在面對的困難與期待。",
              ],
              [
                "Make",
                "把想法做出來",
                "從教案、活動流程到溝通文字，將觀察轉成可以參與的起點。",
              ],
              [
                "Reflect",
                "回到學習者",
                "檢視設計如何被使用，留下反思，再調整下一次的實踐。",
              ],
            ].map(([en, title, text], i) => (
              <article key={en}>
                <span className="small-label">0{i + 1}</span>
                <div>
                  <p className="approach-english">{en}</p>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="future-note">
          <span className="small-label">FUTURE DIRECTIONS</span>
          <h2>
            Keep asking.
            <br />
            <em>Keep learning.</em>
          </h2>
          <p>
            接下來，希望持續探索教育創新、跨文化學習與永續發展的交會處。讓研究與實踐相互對話，也讓每一次走進現場，都成為下一次提問的起點。
          </p>
          <Link className="text-link" to="/#contact">
            從一段對話開始 <ArrowUpRight size={16} />
          </Link>
        </section>
      </main>
      <PageFooter />
    </>
  );
}
