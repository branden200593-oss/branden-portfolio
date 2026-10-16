const assert = require("node:assert/strict");
const fs = require("node:fs");
const { launch, engine } = require("./browser-engine.cjs");

(async () => {
  const browser = await launch();
  const root = (process.env.BASE_URL || "http://127.0.0.1:4173").replace(
    /\/$/,
    "",
  );
  fs.mkdirSync(".artifacts", { recursive: true });
  const report = { engine, fonts: [], routes: [], performance: {} };
  try {
    for (const width of [1440, 768, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("response", (response) => {
        if (response.status() >= 400)
          errors.push(`${response.status()} ${response.url()}`);
      });
      for (const [path, selector] of [
        ["/", ".hero h1"],
        ["/about/", ".about-page h1"],
        ["/projects/", ".projects-page h1"],
        ["/experience/", ".experience-page h1"],
        ["/projects/eswatini/", ".case-heading h1"],
      ]) {
        await page.goto(root + path, { waitUntil: "networkidle" });
        await page.locator(selector).waitFor({ state: "visible" });
        await page.evaluate(async () => {
          for (const image of document.images) image.loading = "eager";
          await Promise.all(
            [...document.images].map((image) => image.decode()),
          );
          await document.fonts.ready;
        });
        assert.ok(
          (await page.locator("main").innerText()).length > 180,
          "Rendered content must rule out a white screen",
        );
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `Overflow: ${width} ${path}`,
        );
        assert.equal(
          await page.evaluate(
            () => getComputedStyle(document.body).backgroundColor,
          ),
          "rgb(8, 9, 13)",
        );
        assert.equal(await page.locator("main h1").count(), 1);
        assert.equal(
          await page
            .locator("img")
            .evaluateAll((images) =>
              images.every((image) => image.complete && image.naturalWidth > 0),
            ),
          true,
          `Images ${path}`,
        );
        assert.equal(
          await page.locator('a[href=""], a[href="#"]').count(),
          0,
          "No empty button destinations",
        );
        if (path === "/projects/") {
          assert.equal(await page.locator(".index-project").count(), 3);
          await page
            .getByRole("button", { name: "International", exact: true })
            .click();
          assert.equal(await page.locator(".index-project").count(), 1);
          await page
            .getByRole("link", { name: "閱讀 史瓦帝尼國際教育", exact: true })
            .waitFor();
          await page
            .getByRole("button", { name: "Social Innovation", exact: true })
            .click();
          assert.equal(await page.locator(".index-project").count(), 1);
          await page.getByRole("button", { name: "All", exact: true }).click();
          assert.equal(await page.locator(".index-project").count(), 3);
        }
        if (path === "/experience/") {
          assert.equal(await page.locator(".experience-entry").count(), 3);
          await page.getByRole("button", { name: "2025", exact: true }).click();
          assert.equal(await page.locator(".experience-entry").count(), 1);
          assert.ok(
            (await page.locator(".experience-entry").innerText()).includes(
              "二年級班導",
            ),
          );
          await page
            .getByRole("button", { name: "所有年份", exact: true })
            .click();
        }
        if (path === "/projects/eswatini/")
          assert.equal(await page.locator(".case-inline-photo").count(), 2);
        if (width === 1440 && path === "/") {
          const selectors = [
            [".hero h1", "Instrument Serif"],
            [".hero h1 em", "Instrument Serif"],
            [".hero-cn", "Noto Serif TC"],
            [".site-header nav a", "Inter"],
            [".about-body > p:not(.lead)", "Noto Sans TC"],
          ];
          if (engine === "chromium") {
            const cdp = await page.context().newCDPSession(page);
            await cdp.send("DOM.enable");
            await cdp.send("CSS.enable");
            const { root: document } = await cdp.send("DOM.getDocument");
            for (const [selector, family] of selectors) {
              const { nodeId } = await cdp.send("DOM.querySelector", {
                nodeId: document.nodeId,
                selector,
              });
              const { fonts } = await cdp.send("CSS.getPlatformFontsForNode", {
                nodeId,
              });
              assert.ok(
                fonts.some(
                  (font) =>
                    font.isCustomFont &&
                    font.glyphCount > 0 &&
                    font.familyName.startsWith(family),
                ),
                `Actual rendered font ${selector}: ${family}`,
              );
              assert.ok(
                fonts.every((font) => font.isCustomFont),
                `Unexpected fallback ${selector}`,
              );
              report.fonts.push({ selector, fonts });
            }
          } else {
            for (const [selector] of selectors) {
              assert.ok(
                await page
                  .locator(selector)
                  .first()
                  .evaluate((element) => {
                    const style = getComputedStyle(element);
                    return document.fonts.check(
                      `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
                      element.textContent,
                    );
                  }),
                `Font availability ${selector}`,
              );
            }
          }
          report.performance = await page.evaluate(() => ({
            resources: performance.getEntriesByType("resource").length,
            transferredBytes: performance
              .getEntriesByType("resource")
              .reduce((sum, resource) => sum + resource.transferSize, 0),
          }));
        }
        if (width === 1440 || width === 390) {
          await page.screenshot({
            path: `.artifacts/editorial-${engine}-${width}-${path.replace(/\W+/g, "-")}.png`,
            fullPage: true,
          });
        }
        report.routes.push({ width, path, passed: true });
      }
      for (const slug of [
        "kinmen-schweitzer",
        "digital-partners",
        "gengxing",
        "sustainable-picnic",
      ]) {
        await page.goto(root + `/projects/${slug}/`, {
          waitUntil: "networkidle",
        });
        await page
          .getByRole("heading", { name: "Still exploring.", exact: true })
          .waitFor();
      }
      assert.deepEqual(errors, []);
      await page.close();
    }
    fs.writeFileSync(
      `.artifacts/editorial-${engine}.json`,
      JSON.stringify(report, null, 2),
    );
    console.log(
      `PASS (${engine}): 5 rendered routes × 4 widths, all photos decoded, project/year filters, hidden drafts inaccessible, dark palette, font loading${engine === "chromium" ? " and actual rendered custom fonts via CDP" : " availability"}; no white screens, overflow or asset errors.`,
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
