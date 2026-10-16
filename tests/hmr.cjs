const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");

// Run only against the development server. Invisible probes are restored in finally.
(async () => {
  const paths = ["src/style.css", "src/App.tsx", "src/content/projects.ts"];
  const originals = new Map(
    await Promise.all(
      paths.map(async (p) => [p, await fs.readFile(p, "utf8")]),
    ),
  );
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
  });
  async function restore() {
    for (const [p, text] of originals) {
      if ((await fs.readFile(p, "utf8")) !== text) await fs.writeFile(p, text);
    }
  }
  try {
    const page = await browser.newPage();
    const errors = [],
      updates = [];
    let navigations = 0;
    page.on("pageerror", (e) => errors.push(e.message));
    // Router replaceState is a same-document event, not a page reload.
    // Count actual document requests instead of generic frame-navigation events.
    page.on("request", (request) => {
      if (
        request.isNavigationRequest() &&
        request.resourceType() === "document"
      )
        navigations++;
    });
    page.on("websocket", (socket) =>
      socket.on("framereceived", (frame) => {
        try {
          const msg = JSON.parse(frame.payload.toString());
          if (msg.type === "update")
            updates.push(
              ...msg.updates.map((x) => ({ type: x.type, path: x.path })),
            );
        } catch {}
      }),
    );
    await page.goto(process.env.BASE_URL || "http://127.0.0.1:5173/", {
      waitUntil: "networkidle",
    });
    await page
      .getByRole("button", { name: "Next project", exact: true })
      .click();
    const title = page.locator(".showcase-bottom h3");
    assert.equal(await title.textContent(), "Sparks of Education");

    await fs.writeFile(
      paths[0],
      originals.get(paths[0]) + "\n:root { --branden-hmr-probe: ready; }\n",
    );
    await page.waitForFunction(
      () =>
        getComputedStyle(document.documentElement)
          .getPropertyValue("--branden-hmr-probe")
          .trim() === "ready",
    );

    // Keep separate saves outside the watcher duplicate-event window.
    await page.waitForTimeout(250);
    await fs.writeFile(paths[0], originals.get(paths[0]));
    await page.waitForFunction(
      () =>
        !getComputedStyle(document.documentElement)
          .getPropertyValue("--branden-hmr-probe")
          .trim(),
    );

    const main = originals.get(paths[1]);
    assert.ok(main.includes('className="hero-intro"'));
    await fs.writeFile(
      paths[1],
      main.replace(
        'className="hero-intro"',
        'className="hero-intro" data-hmr-probe="ready"',
      ),
    );
    await page.waitForFunction(
      () => document.querySelector(".hero-intro")?.dataset.hmrProbe === "ready",
    );
    assert.equal(
      await title.textContent(),
      "Sparks of Education",
      "Fast Refresh must retain carousel state",
    );

    // Keep separate saves outside the watcher duplicate-event window.
    await page.waitForTimeout(250);
    await fs.writeFile(paths[1], originals.get(paths[1]));
    await page.waitForFunction(
      () =>
        !document.querySelector(".hero-intro")?.hasAttribute("data-hmr-probe"),
    );
    assert.equal(await title.textContent(), "Sparks of Education");

    const content = originals.get(paths[2]);
    const phrase = "connection, and shared experiences.";
    assert.ok(content.includes(phrase));
    await fs.writeFile(paths[2], content.replace(phrase, phrase + " "));
    await page.waitForFunction(() =>
      document
        .querySelector(".showcase-bottom p")
        ?.textContent.endsWith("experiences. "),
    );
    assert.equal(await title.textContent(), "Sparks of Education");

    // Keep separate saves outside the watcher duplicate-event window.
    await page.waitForTimeout(250);
    await fs.writeFile(paths[2], originals.get(paths[2]));
    await page.waitForFunction(
      () =>
        !getComputedStyle(document.documentElement).getPropertyValue(
          "--branden-hmr-probe",
        ) &&
        !document
          .querySelector(".hero-intro")
          ?.hasAttribute("data-hmr-probe") &&
        document
          .querySelector(".showcase-bottom p")
          ?.textContent.endsWith("experiences."),
    );
    assert.equal(
      navigations,
      1,
      "Changes should apply without a full page navigation",
    );
    assert.ok(
      updates.some((x) => x.path === "/src/style.css"),
      "The imported CSS module should receive a live update",
    );
    assert.ok(
      updates.some((x) => x.type === "js-update" && x.path === "/src/App.tsx"),
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS: live WebSocket updates for CSS, React and content; carousel state retained; no page reload; source files restored.",
    );
  } finally {
    await restore();
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
