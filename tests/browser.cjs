const { launch, engine } = require("./browser-engine.cjs");
const assert = require("node:assert/strict");
(async () => {
  const browser = await launch();
  require("node:fs").mkdirSync(".artifacts", { recursive: true });
  const results = [];
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
    ["small-mobile", 320, 740],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      hasTouch: width < 1000,
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push(r.status() + ": " + r.url());
    });
    await page.goto(process.env.BASE_URL || "http://127.0.0.1:5173/", {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);
    await page.locator(".hero h1").waitFor();
    assert.equal(await page.locator("main > section").count(), 6);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "Horizontal overflow " + name,
    );
    await page.locator(".carousel-stage").scrollIntoViewIfNeeded();
    const label = page.locator(".showcase-bottom h3");
    assert.equal(await label.textContent(), "Eswatini Education Project");
    await page
      .getByRole("button", { name: "Next project", exact: true })
      .click();
    assert.equal(await label.textContent(), "Sparks of Education");
    await page
      .getByRole("button", { name: "Previous project", exact: true })
      .click();
    assert.equal(await label.textContent(), "Eswatini Education Project");
    await page.locator(".carousel-stage").focus();
    await page.keyboard.press("ArrowLeft");
    assert.equal(await label.textContent(), "Campus Sustainability");
    // Arrow keys outside the carousel must retain normal page behavior.
    await page
      .locator(".wordmark")
      .evaluate((el) => el.focus({ preventScroll: true }));
    await page.keyboard.press("ArrowRight");
    assert.equal(await label.textContent(), "Campus Sustainability");
    const carousel = page.locator(".carousel-stage");
    // A browser-cancelled gesture must not trigger a project change on release.
    await carousel.dispatchEvent("pointerdown", {
      pointerId: 7,
      clientX: 200,
      clientY: 200,
    });
    await carousel.dispatchEvent("pointercancel", { pointerId: 7 });
    await carousel.dispatchEvent("pointerup", {
      pointerId: 7,
      clientX: 60,
      clientY: 200,
    });
    assert.equal(await label.textContent(), "Campus Sustainability");
    await page
      .locator(".carousel-stage")
      .evaluate((el) =>
        el.scrollIntoView({ block: "center", behavior: "instant" }),
      );
    await page.waitForFunction(() => {
      const b = document
        .querySelector(".carousel-stage")
        .getBoundingClientRect();
      return b.top >= 0 && b.bottom <= innerHeight;
    });
    const stage = await page.locator(".carousel-stage").boundingBox();
    const x = stage.x + stage.width / 2,
      y = stage.y + stage.height / 2;
    await page.mouse.move(x + 60, y);
    await page.mouse.down();
    await page.mouse.move(x - 60, y, { steps: 10 });
    await page.mouse.up();
    assert.equal(await label.textContent(), "Eswatini Education Project");
    if (width <= 900 && engine === "chromium") {
      const cdp = await page.context().newCDPSession(page);
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: x + 60, y }],
      });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: x - 60, y }],
      });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
      assert.equal(await label.textContent(), "Sparks of Education");
    }
    await page.locator(".project-card").nth(1).click();
    await page.waitForURL("**/projects/sparks/");
    await page
      .getByRole("heading", { name: "教院小火花.", exact: true })
      .waitFor();
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "Case overflow " + name,
    );
    await page
      .getByRole("link", { name: "← Selected projects", exact: true })
      .click();
    await page.waitForURL("**/#projects");
    await page.locator(".hero h1").waitFor();
    if (width <= 900) {
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.getByRole("button", { name: "Open menu" }).click();
      await page
        .getByRole("navigation")
        .getByRole("link", { name: "ABOUT", exact: true })
        .click();
      assert.equal(
        await page
          .getByRole("button", { name: "Open menu" })
          .getAttribute("aria-expanded"),
        "false",
      );
      await page.waitForURL("**/about/");
      await page.locator(".about-page h1").waitFor();
      await page
        .getByRole("link", { name: "BRANDEN. Home", exact: true })
        .click();
      await page.locator(".hero h1").waitFor();
    }
    for (const id of [
      "home",
      "work",
      "showcase",
      "about",
      "journey",
      "contact",
    ])
      assert.equal(await page.locator("#" + id).count(), 1);
    assert.deepEqual(errors, []);
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(500);
    if (name === "desktop" || name === "mobile") {
      await page.screenshot({
        path: ".artifacts/" + name + ".png",
        fullPage: true,
      });
      await page.screenshot({ path: ".artifacts/" + name + "-hero.png" });
    }
    results.push({
      viewport: name,
      width,
      passed: true,
      checks: [
        "render",
        "no overflow",
        "navigation",
        "carousel buttons",
        "keyboard",
        "pointer drag",
        ...(width <= 900 && engine === "chromium" ? ["touch swipe"] : []),
        "cancelled gesture",
        "arrow keys outside carousel",
        "project selection",
        "no browser errors",
      ],
    });
    await page.close();
  }
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.goto(process.env.BASE_URL || "http://127.0.0.1:5173/", {
    waitUntil: "networkidle",
  });
  assert.equal(
    await page
      .locator(".hero-content")
      .evaluate((e) => getComputedStyle(e).opacity),
    "1",
  );
  assert.equal(
    await page
      .locator(".orbit-card")
      .first()
      .evaluate((e) => getComputedStyle(e).transitionDuration),
    "0s",
  );
  results.push({ reducedMotion: true, passed: true });
  console.log(JSON.stringify(results, null, 2));
  require("node:fs").writeFileSync(
    ".artifacts/browser-results.json",
    JSON.stringify(results, null, 2),
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
