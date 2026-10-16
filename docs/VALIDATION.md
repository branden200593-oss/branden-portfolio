# Validation — Dark Editorial, 2026-10-16

## Executed locally

- Dependencies installed and lockfile updated. npm audit --omit=dev: 0 vulnerabilities.
- npm run build: ESLint, strict TypeScript and Vite production output passed.
- HMR: actual CSS/component/content WebSocket updates, retained carousel state,
  no full reload, no browser errors, all temporary source probes restored.
- Built-output browser suite: 1440/768/390/320, real perspective, next/previous,
  scoped keyboard, pointer drag/cancellation, Chromium touch swipes, case links,
  mobile navigation and reduced motion passed.
- Case routes: 3 cases × 4 widths, four chapters, next story, unknown-route
  return, real 3D transforms, no horizontal overflow/asset/JavaScript errors.
- Editorial: Home/About/Projects/Experience/Eswatini × 4 widths, every image
  decoded, project/year filters, hidden draft case routes inaccessible,
  correct dark background, no empty link targets, no white screens.
- Font verification uses actual Chromium CDP rendered-glyph information:
  Instrument Serif regular + italic, Noto Serif TC, Noto Sans TC and Inter all
  rendered as custom fonts; no fallback glyphs in the sampled text nodes.
- Studio: create/edit, rights gate, raster re-encoding, persistence, reorder,
  visibility, backup export/import, malicious SVG rejection, all-hidden state,
  reset, unsaved-navigation guard and mobile overflow; no server writes.

The built homepage JavaScript is approximately 140 kB gzip, studio approximately
5.3 kB gzip. CJK WOFF2 files use Unicode ranges; font files are self-hosted.
Photo source sizes are roughly 59–303 KiB. These are build/resource observations,
not a mobile field-performance score or a full accessibility certification.

## Compatibility limit

The cloud's local WebKit download was blocked by proxy 403. Both Chromium and
WebKit subsequently ran and passed in GitHub Actions at commit 3f845da:
https://github.com/branden200593-oss/branden-portfolio/actions/runs/38919103438
Both jobs succeeded; artifacts were retained. The initial run had an unsuccessful
WebKit step without accessible logs; diagnostic reporting and artifact retention
were added before the successful run. No claim is made about that initial cause.
Linux WebKit does not establish a physical Safari/macOS test.
The Framer reference page was similarly blocked; owner-supplied design rules
were used rather than claiming a direct template inspection.

## Netlify verification

The actual protected review at
https://codex-preview--branden-portfolio-v1.netlify.app was uploaded and rendered:
8 direct routes passed at the expected commit, with CSP/noindex; all 4 widths,
3D interactions, editorial fonts/images, case routes and local studio passed.
Production still pointed to 6ad22e67730850e71cf441c3 after deployment.
Unauthenticated review access returns 401 and Netlify's official login redirect.
The existing account's Netlify authorization was used with the official
/auth/edge-access and /.netlify/login-helper flow; access policies were unchanged.

The cloud Chromium did not trust the environment proxy's CA. Persistently adding
that CA was rejected by automatic approval review; no certificate store was
changed. For external rendering only, requests used Playwright's API transport
through the environment proxy with TLS certificate verification, then passed the
responses to Chromium at the real origin. This verifies deployed content and
browser behavior, not an independent browser-side TLS handshake or Mac Safari.
Ordinary direct browser checks ran locally and in GitHub CI.

The local studio remains browser-local, not a shared authenticated CMS.
Only previously public site photos are retained. Additional Drive photos remain
unimported and require authorization review; draft candidates contain no
invented dates, roles or outcomes. See MATERIALS.md.

## Follow-up stability fix

A subsequent WebKit run exposed an intermittent next-story click/navigation
failure. Source inspection found portrait/landscape gallery images all declared
as 1200×900, so delayed decoding could move following content. Gallery metadata
now retains each actual image's width/height, strictly validated and backward
compatible with existing studio backups. A delayed-image regression checks the
next-story position before and after decoding at all four widths. Route tests
wait for fonts and place the actual link in view before an ordinary click, then
assert the expected URL and heading, capturing diagnostic evidence on failure.
No forced clicks, test retries or skipped WebKit assertions were introduced.
