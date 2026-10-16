# Validation — 2026-10-16

## Executed and passed

- npm install: added the router dependency with a lockfile update.
- npm run build: strict TypeScript + production Vite output passed.
- npm run test:hmr: actual WebSocket-delivered CSS, component and content updates;
  carousel state retained, one document load, all source probes restored. Router
  replaceState is correctly distinguished from an actual document navigation.
- Production npm run test:browser: 1440, 768, 390, 320 px; rendering, no horizontal
  overflow, navigation, carousel arrows/keyboard/mouse drag, mobile touch swipe,
  cancelled gestures, case-page navigation and reduced motion; no browser errors.
- Production npm run test:routes: all three direct case routes, four content
  chapters per case, next-story navigation, unknown-route 404/return, real CSS 3D
  transforms at all four widths; no failed assets or uncaught JS errors.
- Production npm run test:studio: create/edit, image conversion, rights validation,
  IndexedDB persistence across reloads, reorder, hide, case preview, valid backup
  import/export, malicious SVG-import rejection, unsaved-navigation guard,
  all-hidden state, reset and mobile overflow. No server write requests occurred.
- Source scan: no private-key/GitHub-token/npm-token patterns in shipped source.
- python -m py_compile scripts/deploy-netlify.py passed. The live API check exits
  safely when Netlify authorization is absent; no site was created or changed.

## Practical limits

These are Chromium checks with emulated widths/touch; physical Safari and real
network performance were not tested. The homepage main bundle is approximately
135 kB gzip and the studio is a separate approximately 5.3 kB gzip chunk.
The CSP/security/header files exist in dist; actual Netlify response headers
cannot be verified before deployment.

Cases contain clearly marked pending roles/times/results. No personal/student
photos have been published. Google Drive is blocked by the current environment
proxy and picture rights have not been reviewed. The studio is an on-device
editor, not an authenticated shared CMS or public publishing endpoint.

## External blocker

The proxy returns CONNECT 403 for api.netlify.com and drive.google.com.
NETLIFY_AUTH_TOKEN is absent in the running machine; no usable existing binding
was found before declaring the requirement.
Required egress domains and the secret requirement have been saved in the draft;
this does not apply them. Review/save relevant environment settings and supply the
Netlify credential through the secure field, then retry deployment. Publishing
the environment snapshot is distinct from deploying the website.

No Netlify deployment succeeded, and no public website URL is claimed. The deploy
helper targets only the existing site's codex-preview alias, preserves production
and access settings, and requires verification of the resulting URL.
