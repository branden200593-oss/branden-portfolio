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

Playwright WebKit install attempted the official download hosts; this environment
blocked them with proxy 403. WebKit has not run locally. The committed CI matrix
includes WebKit but its execution is not claimed until an actual GitHub run is
observed. Linux WebKit would still not establish a physical Safari/macOS test.
The Framer reference page was similarly blocked; owner-supplied design rules
were used rather than claiming a direct template inspection.

## Netlify verification

The direct review deployment must be verified after upload with the actual HTTPS
response and browser, including all 8 routes, expected commit marker, CSP and
noindex. Then repeat responsive/editorial checks against the real URL. Production
must still point to 6ad22e67730850e71cf441c3. See the task report for the actual
deploy URL/result; local compilation alone is never a deployment success.

The local studio remains browser-local, not a shared authenticated CMS.
Only previously public site photos are retained. Additional Drive photos remain
unimported and require authorization review; draft candidates contain no
invented dates, roles or outcomes. See MATERIALS.md.
