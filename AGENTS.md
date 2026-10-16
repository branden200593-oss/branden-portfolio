# Branden Portfolio working agreement

- Preserve this existing Vite checkout and user work. Do not create a worktree
  unless requested. Preserve Hero, 3D Showcase and the existing portfolio sections.
- The user authorized completing the site, testing, normal Git commits/pushes and
  review deployment to the existing Netlify project. Do not force push, replace
  production, create a paid service, change access protection or publish unapproved
  personal/student photos without confirmation.
- Prefer the cloud + stable Netlify review workflow. Do not require Mac setup,
  ZIP downloads, screenshots or static HTML as substitutes for a real website.
- Keep the Vite server running across ordinary edits. Bootstrap: src/main.tsx;
  exported home component: src/App.tsx. Preserve Fast Refresh boundaries.
- Edit src/content/projects.ts for shared website content. Never invent outcomes,
  roles or dates. Unverified material remains clearly labelled pending review.
- /studio is intentionally a browser-local draft editor using IndexedDB. It has
  no login or server writes. Never imply those drafts were publicly published or
  synchronized. Preserve image-rights checks and strict import validation.
- Run build and relevant browser/studio/HMR checks for substantive changes.
  tests/hmr.cjs restores invisible source probes; never build while probes run.
- Netlify: site 4e04a51a-fad2-4280-8edf-91ac2e4e3b28, branden-portfolio-v1.
  scripts/deploy-netlify.py targets only codex-preview. Verify actual deployed
  responses and inherited protection; do not manufacture a deployment URL or
  claim readiness from a successful local build.
- Netlify API and Drive now work; official Netlify OAuth completed in this session.
  Session credential material lives outside this repo and must never be logged.
  GitHub API, Framer reference and WebKit download hosts remain proxy-blocked.
  Netlify has no Git source linked; do not claim CD until an actual push-triggered
  build is verified. Production still uses the original Next.js Drop deploy;
  this candidate preserves its public content on the existing complete Vite source.
- Dark editorial branch: codex/dark-editorial. Do not merge to main or replace
  production until the owner reviews. Tag archive/pre-dark-20261016 is the Vite
  source baseline, not missing Next.js source. Keep normal pushes only.
- User explicitly requested Antony-inspired information design. Current routes
  include /about, /projects, /experience, 3 cases and /studio. Use shared tokens
  and four self-hosted fonts; candidate drafts remain hidden, no invented claims.
