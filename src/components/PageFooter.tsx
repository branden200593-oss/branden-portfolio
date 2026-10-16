import { Link } from "react-router-dom";
export default function PageFooter() {
  return (
    <footer className="page-footer">
      <Link className="wordmark" to="/">
        BRANDEN.
      </Link>
      <p>Learning beyond boundaries.</p>
      <Link to="/studio">個人草稿工作室</Link>
      <span>© 2026 Branden Lee</span>
    </footer>
  );
}
