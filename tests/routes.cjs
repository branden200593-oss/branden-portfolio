const { launch } = require("./browser-engine.cjs");
const assert = require("node:assert/strict");
(async () => {
  const browser = await launch();
  try {
    const root = (process.env.BASE_URL || "http://127.0.0.1:5173").replace(
      /\/$/,
      "",
    );
    for (const width of [1440, 768, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("response", (r) => {
        if (r.status() >= 400)
          errors.push(r.status() + " " + new URL(r.url()).pathname);
      });
      const cases = [
        ["eswatini", "史瓦帝尼國際教育"],
        ["sparks", "教院小火花"],
        ["sustainability", "校園永續實踐"],
      ];
      for (const [slug, name] of cases) {
        await page.goto(root + "/projects/" + slug + "/", {
          waitUntil: "networkidle",
        });
        await page
          .getByRole("heading", { name: name + ".", exact: true })
          .waitFor();
        assert.ok((await page.title()).includes(name));
        assert.equal(await page.locator(".case-chapter").count(), 4);
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          "Case overflow " + width + " " + slug,
        );
        await page.locator(".next-project").click();
        const expected =
          cases[(cases.findIndex((x) => x[0] === slug) + 1) % cases.length][1];
        await page
          .getByRole("heading", { name: expected + ".", exact: true })
          .waitFor();
      }
      await page.goto(root + "/missing-page/", { waitUntil: "networkidle" });
      await page
        .getByRole("heading", { name: "Still exploring.", exact: true })
        .waitFor();
      await page.getByRole("link", { name: "回到首頁 ↗", exact: true }).click();
      await page.locator(".hero h1").waitFor();
      assert.ok(
        (
          await page
            .locator(".orbit-card.center")
            .evaluate((e) => getComputedStyle(e).transform)
        ).includes("matrix3d"),
        "Showcase should use real perspective transforms",
      );
      if (width === 1440) {
        await page.goto(root + "/projects/eswatini/", {
          waitUntil: "networkidle",
        });
        await page.locator(".case-heading h1").waitFor();
        await page.screenshot({
          path: ".artifacts/case-desktop.png",
          fullPage: true,
        });
      }
      assert.deepEqual(errors, []);
      await page.close();
    }
    console.log(
      "PASS: all three case URLs, chapter content, next-story links, 404 return, genuine 3D transforms and overflow at 1440/768/390/320; no browser or asset errors.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
