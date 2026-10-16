const { launch } = require("./browser-engine.cjs");
const assert = require("node:assert/strict");

(async () => {
  const browser = await launch();
  const root = (process.env.BASE_URL || "http://127.0.0.1:4173").replace(
    /\/$/,
    "",
  );
  try {
    for (const width of [1440, 768, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      let release;
      const gate = new Promise((resolve) => {
        release = resolve;
      });
      try {
        for (const image of ["classroom", "eswatini"]) {
          await page.route(`**/images/${image}.webp`, async (route) => {
            await gate;
            await route.continue();
          });
        }
        await page.goto(root + "/projects/eswatini/", {
          waitUntil: "domcontentloaded",
        });
        await page
          .locator(".case-inline-photo img")
          .last()
          .waitFor({ state: "attached" });
        await page.evaluate(async () => {
          for (const image of document.querySelectorAll(
            ".case-inline-photo img",
          ))
            image.loading = "eager";
          await document.fonts.ready;
        });
        const before = await page
          .locator(".next-project")
          .evaluate((element) => element.getBoundingClientRect().top + scrollY);
        assert.ok(
          await page
            .locator(".case-inline-photo img")
            .evaluateAll((images) => images.every((image) => !image.complete)),
          "Gallery responses must still be held for this test",
        );
        release();
        await page
          .locator(".case-inline-photo img")
          .evaluateAll(async (images) => {
            await Promise.all(images.map((image) => image.decode()));
          });
        const after = await page
          .locator(".next-project")
          .evaluate((element) => element.getBoundingClientRect().top + scrollY);
        assert.ok(
          Math.abs(after - before) <= 1,
          `Lazy photos moved the next-story link by ${after - before}px at ${width}px`,
        );
      } finally {
        release();
        await page.close();
      }
    }
    console.log(
      "PASS: delayed gallery photos preserve next-story position at 1440/768/390/320 before and after actual image decoding.",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
