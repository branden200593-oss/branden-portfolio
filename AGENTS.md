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
- The environment currently blocks Netlify/Drive via proxy 403. Required domains
  and NETLIFY_AUTH_TOKEN metadata were saved in the environment draft. Values must
  be entered securely, never in chat or source. Saving a draft does not apply it.
- After the user updates environment access, retry the affected operation and
  resume deployment. Do not repeatedly run unchanged denied requests.
