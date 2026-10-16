// Legacy single-page helper retained from the initial prototype.
// The routed website now uses a real Vite/Netlify preview; this is not an active workflow.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist");
const out = path.resolve(".artifacts");
let html = await readFile(path.join(root, "index.html"), "utf8");
const script = html.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/);
const stylesheet = html.match(/<link[^>]*href="([^"]+\.css)"[^>]*>/);
if (!script || !stylesheet)
  throw new Error(
    "Expected one Vite script and stylesheet. Run the production build first.",
  );
const js = await readFile(path.join(root, script[1]), "utf8");
let css = await readFile(path.join(root, stylesheet[1]), "utf8");
for (const match of [...css.matchAll(/url\(([^)]+)\)/g)]) {
  const url = match[1].replace(/^["']|["']$/g, "");
  if (url.startsWith("data:")) continue;
  if (!url.startsWith("/assets/"))
    throw new Error(`Unexpected asset URL: ${url}`);
  const bytes = await readFile(path.join(root, url));
  const mime = url.endsWith(".woff2") ? "font/woff2" : "font/woff";
  css = css.replace(
    match[0],
    `url(data:${mime};base64,${bytes.toString("base64")})`,
  );
}
html = html.replace(
  script[0],
  () =>
    `<script type="module">${js.replace(/<\/script/gi, "<\\/script")}</script>`,
);
html = html.replace(stylesheet[0], () => `<style>${css}</style>`);
await mkdir(out, { recursive: true });
await writeFile(path.join(out, "branden-preview.html"), html);
console.log("Self-contained preview: .artifacts/branden-preview.html");
