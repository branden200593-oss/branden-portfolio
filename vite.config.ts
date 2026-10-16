import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execFileSync } from "node:child_process";

const revision =
  process.env.COMMIT_REF ||
  process.env.VITE_BUILD_COMMIT ||
  execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();

export default defineConfig({
  plugins: [
    react(),
    {
      name: "build-revision",
      transformIndexHtml: () => [
        {
          tag: "meta",
          attrs: { name: "build-revision", content: revision },
          injectTo: "head",
        },
      ],
    },
  ],
});
