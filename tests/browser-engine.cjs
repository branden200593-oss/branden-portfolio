const { chromium, webkit } = require("playwright");
const fs = require("node:fs");
const engine = process.env.BROWSER_ENGINE || "chromium";
if (!["chromium", "webkit"].includes(engine))
  throw new Error("Unknown browser engine");
module.exports = {
  engine,
  launch: () =>
    engine === "webkit"
      ? webkit.launch()
      : chromium.launch({
          executablePath:
            process.env.CHROMIUM_EXECUTABLE_PATH ||
            (fs.existsSync("/usr/bin/chromium")
              ? "/usr/bin/chromium"
              : undefined),
          args: ["--no-sandbox"],
        }),
};
