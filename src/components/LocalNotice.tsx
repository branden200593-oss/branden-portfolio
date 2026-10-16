import { Link } from "react-router-dom";
import { usePortfolio } from "../store/context";
export default function LocalNotice() {
  const { local } = usePortfolio();
  return local ? (
    <aside className="local-notice">
      正在查看此瀏覽器的個人草稿，其他訪客不會看到這些修改。
      <Link to="/studio">管理草稿</Link>
    </aside>
  ) : null;
}
