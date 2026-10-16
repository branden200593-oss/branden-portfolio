# Existing-site deployment contract

Site: branden-portfolio-v1, id 4e04a51a-fad2-4280-8edf-91ac2e4e3b28.
The current production deploy is 6ad22e67730850e71cf441c3 (Next.js static output,
Netlify Drop). It is not the README-only GitHub main or the Vite source branch.
The API confirmed no linked repository/build settings and Google-only connected
account; Netlify authorization is present for this session, GitHub linking is not.

The candidate branch is codex/dark-editorial, based on the existing complete Vite
branch. Build command npm run build, publish dist, base repository root, Node 24,
framework Vite (no Next.js runtime plugin). Existing netlify.toml sets the build,
SPA routing and headers. Access protection must never be weakened.

The direct review helper scripts/deploy-netlify.py only updates codex-preview,
never production. Credentials are read from the environment, not committed.
Session OAuth credentials are stored outside the repository with restrictive
permissions and never printed. The stable review alias is subject to response
and rendered-browser verification; its name alone is not proof of readiness.

Continuous deployment requires linking this existing site to the existing
GitHub repository through Netlify's official GitHub authorization. Do not claim
that creating workflow YAML or pushing a branch establishes that integration.
Production branch should be main after the owner approves the Vite migration
and final design. Until then do not merge this branch into main or initiate a
production build. A link wizard may try an initial build; the README-only main
cannot build this candidate and must not be used as a migration shortcut.

After Git integration is authorized: preserve the published deploy, enable
feature-branch/PR previews, open the candidate PR, verify an actual push-triggered
Netlify build at the matching commit, run the rendered preview smoke and confirm
production remains the old deploy. Only then report GitHub → Netlify enabled.

Quality CI checks lint, types, production compilation, real homepage/case contents,
fonts/images, responsive controls and studio persistence on Chromium and WebKit.
PR smoke checks the actual Netlify URL and build-revision marker. Protected
previews return an authorization error; automation must preserve protection.

No tokens are placed in source, scripts, build artifacts, URLs, chat or logs.
No production branch security, access policy or billing changes are authorized
implicitly by a successful preview.

## Verified review delivery

Stable protected review: https://codex-preview--branden-portfolio-v1.netlify.app
First dark-editorial deployment: 6ad23884bd7a780071b7c042, context branch-deploy,
not published to production. Actual rendered content, expected revision, routes,
images/fonts and inherited team-login protection were verified. The original
production deploy remained unchanged. No Git-triggered Netlify build has yet
been observed; source linking still requires the owner's GitHub application grant.
