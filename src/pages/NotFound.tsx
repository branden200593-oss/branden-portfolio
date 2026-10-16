import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import PageFooter from "../components/PageFooter";
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="not-found">
        <p className="small-label">404 / A DIFFERENT PATH</p>
        <h1>
          Still exploring<span>.</span>
        </h1>
        <p>這個頁面不存在，或作品尚未開放瀏覽。</p>
        <Link className="dark-pill" to="/">
          回到首頁 ↗
        </Link>
      </main>
      <PageFooter />
    </>
  );
}
