const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  try {
    const context = await browser.newContext({ acceptDownloads: true });
    const page = await context.newPage();
    const errors = [],
      writes = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (!["GET", "HEAD"].includes(r.method())) writes.push(r.method());
    });
    const root = process.env.BASE_URL || "http://127.0.0.1:5173";
    await page.goto(root + "/studio/", { waitUntil: "networkidle" });
    await page.getByLabel("作品中文名稱", { exact: true }).waitFor();
    assert.equal(await page.locator("input[type=password]").count(), 0);
    assert.equal(await page.locator(".studio-list-item").count(), 3);
    await page.getByRole("button", { name: "新增作品", exact: true }).click();
    await page.getByLabel("作品中文名稱", { exact: true }).fill("測試作品");
    await page.getByLabel("作品英文名稱", { exact: true }).fill("Test Project");
    await page.getByLabel("網址代稱", { exact: true }).fill("test-project");
    await page
      .getByLabel("作品摘要", { exact: true })
      .fill("A browser-local field note.");
    await page
      .getByLabel("專案背景", { exact: false })
      .fill("Test context\nA second paragraph");
    await page
      .getByLabel("本裝置預覽狀態", { exact: true })
      .selectOption("published");
    const png = await page.evaluate(() => {
      const c = document.createElement("canvas");
      c.width = 32;
      c.height = 24;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#cfad90";
      ctx.fillRect(0, 0, 32, 24);
      return c.toDataURL("image/png").split(",")[1];
    });
    await page.getByLabel("選擇封面圖片", { exact: true }).setInputFiles({
      name: "test.png",
      mimeType: "image/png",
      buffer: Buffer.from(png, "base64"),
    });
    await page.locator(".image-field img").waitFor();
    await page
      .getByRole("button", { name: "儲存至此瀏覽器", exact: true })
      .click();
    await page
      .getByRole("alert")
      .filter({ hasText: "確認可公開使用" })
      .waitFor();
    assert.equal(await page.locator(".studio-list-item").count(), 3);
    await page
      .getByLabel("圖片替代文字", { exact: true })
      .fill("A plain test rectangle");
    await page.getByRole("checkbox").check();
    await page
      .getByRole("button", { name: "儲存至此瀏覽器", exact: true })
      .click();
    await page
      .getByRole("status")
      .filter({ hasText: "已儲存至此瀏覽器" })
      .waitFor();
    assert.equal(await page.locator(".studio-list-item").count(), 4);
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator(".studio-list-item").count(), 4);
    await page
      .getByRole("button", { name: "上移 測試作品", exact: true })
      .click();
    await page.getByRole("status").filter({ hasText: "順序已儲存" }).waitFor();
    assert.ok(
      (await page.locator(".studio-list-item").nth(2).textContent()).includes(
        "測試作品",
      ),
    );
    await page
      .getByRole("link", { name: "查看本裝置首頁", exact: false })
      .click();
    await page.locator(".local-notice").waitFor();
    assert.equal(await page.locator(".project-card").count(), 4);
    await page
      .getByRole("link", { name: "Read Test Project", exact: true })
      .click();
    await page
      .getByRole("heading", { name: "測試作品.", exact: true })
      .waitFor();
    assert.equal(
      await page
        .getByAltText("A plain test rectangle")
        .evaluate((e) => e.complete && e.naturalWidth > 0),
      true,
    );
    await page.goto(root + "/studio/", { waitUntil: "networkidle" });
    await page
      .getByRole("button", { name: "隱藏 測試作品", exact: true })
      .click();
    await page
      .getByRole("status")
      .filter({ hasText: "顯示狀態已更新" })
      .waitFor();
    await page.goto(root + "/projects/test-project/", {
      waitUntil: "networkidle",
    });
    await page
      .getByRole("heading", { name: "Still exploring.", exact: true })
      .waitFor();
    await page.goto(root + "/studio/", { waitUntil: "networkidle" });
    const downloadWait = page.waitForEvent("download");
    await page.getByRole("button", { name: "匯出備份", exact: true }).click();
    const download = await downloadWait;
    const backup = JSON.parse(await fs.readFile(await download.path(), "utf8"));
    assert.equal(backup.schemaVersion, 1);
    assert.equal(backup.projects.length, 4);
    assert.ok(
      backup.projects
        .find((p) => p.slug === "test-project")
        .cover.startsWith("data:image/webp;base64,"),
    );
    const bad = structuredClone(backup);
    bad.projects[0].cover = 'data:image/svg+xml,<svg onload="alert(1)"/>';
    await page.locator('input[accept="application/json,.json"]').setInputFiles({
      name: "bad.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(bad)),
    });
    await page
      .getByRole("alert")
      .filter({ hasText: "不接受外部連結或 SVG" })
      .waitFor();
    assert.equal(await page.locator(".studio-list-item").count(), 4);
    while (await page.getByRole("button", { name: /^隱藏 / }).count()) {
      const remaining = await page
        .getByRole("button", { name: /^隱藏 / })
        .count();
      await page
        .getByRole("button", { name: /^隱藏 / })
        .first()
        .click();
      await page.waitForFunction(
        (expected) =>
          document.querySelectorAll(
            '.studio-row-tools button[aria-label^="隱藏"]',
          ).length === expected,
        remaining - 1,
      );
    }
    await page.goto(root + "/", { waitUntil: "networkidle" });
    await page
      .getByText("作品整理中。請稍後再回來看看。", { exact: true })
      .waitFor();
    assert.equal(await page.locator(".project-card").count(), 0);
    await page.goto(root + "/studio/", { waitUntil: "networkidle" });
    page.once("dialog", (dialog) => dialog.accept());
    await page
      .getByRole("button", { name: "還原網站原始內容", exact: true })
      .click();
    await page
      .getByRole("status")
      .filter({ hasText: "已恢復網站原始內容" })
      .waitFor();
    assert.equal(await page.locator(".studio-list-item").count(), 3);
    page.once("dialog", (dialog) => dialog.accept());
    await page
      .locator('input[accept="application/json,.json"]')
      .setInputFiles({
        name: "valid.json",
        mimeType: "application/json",
        buffer: Buffer.from(JSON.stringify(backup)),
      });
    await page.getByRole("status").filter({ hasText: "備份已匯入" }).waitFor();
    assert.equal(await page.locator(".studio-list-item").count(), 4);
    await page.getByLabel("作品標語", { exact: true }).fill("An unsaved note");
    page.once("dialog", (dialog) => dialog.dismiss());
    await page
      .getByRole("link", { name: "查看本裝置首頁", exact: false })
      .click();
    assert.ok(
      page.url().endsWith("/studio/"),
      "Unsaved navigation should stay in the studio",
    );
    await page
      .getByRole("button", { name: "儲存至此瀏覽器", exact: true })
      .click();
    await page
      .getByRole("status")
      .filter({ hasText: "已儲存至此瀏覽器" })
      .waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "Studio mobile overflow",
    );
    assert.deepEqual(errors, []);
    assert.deepEqual(writes, [], "Studio must not send writes to any server");
    console.log(
      "PASS: create/edit, image conversion and rights gate, persistence, reorder, hide, case preview, export, invalid-import rejection, zero-visible state, reset, mobile layout; no server writes or JS errors.",
    );
    await context.close();
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
