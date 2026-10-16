const url = process.argv[2];
if (!url) throw new Error("Usage: node scripts/wait-http.cjs URL");
(async () => {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      /* The server may still be starting. */
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Server did not become available: " + url);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
