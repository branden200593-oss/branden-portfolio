const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
fs.mkdirSync(".artifacts", { recursive: true });
for (const suite of ["browser", "routes", "layout", "studio", "editorial"]) {
  const result = spawnSync(process.execPath, [`tests/${suite}.cjs`], {
    encoding: "utf8",
    env: process.env,
  });
  const output = (result.stdout || "") + (result.stderr || "");
  fs.writeFileSync(`.artifacts/${suite}.log`, output);
  process.stdout.write(output);
  if (result.status !== 0) {
    // Test diagnostics contain no credentials: these suites run only on localhost.
    const detail = output
      .slice(-4500)
      .replace(/%/g, "%25")
      .replace(/\r/g, "%0D")
      .replace(/\n/g, "%0A");
    console.error(
      `::error title=${process.env.BROWSER_ENGINE} ${suite}::${detail}`,
    );
    process.exit(result.status || 1);
  }
}
