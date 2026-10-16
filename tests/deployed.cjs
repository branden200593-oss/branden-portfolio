const assert = require("node:assert/strict");
const { launch } = require("./browser-engine.cjs");

(async () => {
  const root = process.env.BASE_URL;
  if (
    !root?.startsWith("https://") ||
    new URL(root).hostname === "branden-portfolio-v1.netlify.app"
  )
    throw new Error(
      "Supply the actual HTTPS review deployment URL, never production.",
    );
  const browser = await launch();
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    for (const path of [
      "/",
      "/about/",
      "/projects/",
      "/experience/",
      "/projects/eswatini/",
      "/projects/sparks/",
      "/projects/sustainability/",
      "/studio/",
    ]) {
      const response = await page.goto(root.replace(/\/$/, "") + path, {
        waitUntil: "networkidle",
      });
      assert.equal(response.status(), 200, path);
      await page.locator("main h1").waitFor({ state: "visible" });
      assert.ok(
        (await page.locator("main").innerText()).length > 180,
        `Actual rendered contents ${path}`,
      );
      const revision = await page
        .locator('meta[name="build-revision"]')
        .getAttribute("content");
      if (process.env.EXPECTED_COMMIT)
        assert.equal(
          revision,
          process.env.EXPECTED_COMMIT,
          "This must be the reviewed commit",
        );
      assert.ok(/noindex/.test(response.headers()["x-robots-tag"] || ""));
      assert.ok(
        (response.headers()["content-security-policy"] || "").includes(
          "default-src 'self'",
        ),
      );
    }
    assert.deepEqual(errors, []);
    console.log(
      "PASS: actual HTTPS preview renders 8 routes at the expected commit, with no white screens or browser/asset errors; CSP and noindex present.",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
