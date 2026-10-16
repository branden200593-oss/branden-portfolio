// Netlify deploy previews appear asynchronously after an actual pull request.
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
(async () => {
  const number = process.env.PR_NUMBER;
  if (!/^\d+$/.test(number || ""))
    throw new Error("A real pull request number is required");
  const root = `https://deploy-preview-${number}--branden-portfolio-v1.netlify.app`;
  const deadline = Date.now() + 12 * 60_000;
  while (Date.now() < deadline) {
    let matching = false;
    try {
      const response = await fetch(root);
      if ([401, 403].includes(response.status))
        throw new Error(
          "Preview requires access authorization; preserve protection.",
        );
      const html = await response.text();
      matching =
        response.ok &&
        html.includes(`content="${process.env.EXPECTED_COMMIT}"`);
    } catch (error) {
      if (error.message.includes("access authorization")) throw error;
      console.log("Waiting for the matching Netlify preview commit.");
    }
    if (matching) {
      const result = spawnSync(process.execPath, ["tests/deployed.cjs"], {
        env: { ...process.env, BASE_URL: root },
        stdio: "inherit",
      });
      assert.equal(result.status, 0, "Rendered preview smoke test failed");
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 15_000));
  }
  throw new Error(
    "No matching preview became available. Ready status alone is insufficient.",
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
