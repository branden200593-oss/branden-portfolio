# Live visual editing

The project uses Vite 7, React 19 and `@vitejs/plugin-react`. The running server
watches CSS, `src/App.tsx` and `src/content/projects.ts`. The bootstrap is kept
separate so React Fast Refresh can preserve component state. Dependency checks
use `npm ls --depth=0`; reinstall only if dependencies are missing or changed.

## Current cloud workspace

The persistent dev command is `npm run dev -- --port 5173 --strictPort` from
`/workspace/branden-portfolio`. Reuse it across edits. Do not stop it, rebuild or
export HTML for each CSS/content change. Availability lasts only as long as the
cloud runtime remains alive; processes cannot be assumed to survive suspension
or environment publication.

This chat exposes shell/browser automation but no user-accessible Preview/Ports
forwarding or embedded browser capability. Internal Chromium can validate the
site, but it cannot create a browser pane in the user's chat or map a cloud
loopback address onto their Mac. Do not substitute a static artifact for a live
preview or create a public tunnel/deployment without authorization.

## Mac: Codex desktop app and a normal browser

1. Put the complete current source folder on the Mac once. It must contain
   `package.json`, `src/App.tsx` and `vite.config.ts`. The original GitHub
   initialization README alone cannot run this app. Cloud workspace files do not
   automatically synchronize to a Mac folder.
2. Install Node.js 22.12+ (Node 24 is supported). In the Codex desktop app, open
   this **local project folder** and use its local execution mode. Keep subsequent
   editing conversations in that local project, rather than the cloud task.
   UI names can vary by app version; an embedded browser is not required.
3. In macOS Terminal, navigate to the source folder. For example, if it lives in
   `~/Projects/branden-portfolio`:

   ```sh
   cd ~/Projects/branden-portfolio
   node --version
   npm ci
   npm run dev -- --port 5173 --strictPort
   ```

4. Leave that terminal running. In a second terminal:

   ```sh
   open http://localhost:5173
   ```

   This address refers to the dev server **running on the Mac**, not the cloud.
5. Place the Codex app and browser side by side using macOS window tiling (or
   manually resize both windows). Ask the local Codex session to modify a
   particular section. Saving changes updates the browser automatically.
   Do not rerun npm, export HTML or deploy after each edit.
6. If port 5173 is occupied, use `lsof -nP -iTCP:5173 -sTCP:LISTEN` to identify
   the process. Reuse it if it is this project. Do not kill unrelated processes.

Suggested local Codex instruction:

> Keep the existing Vite dev server running and use HMR. Modify only the section
> I specify. Preserve all other sections. Do not export static HTML, deploy or
> add personal photos. Let me review changes in my browser before proceeding.

`npm run test:hmr` validates live CSS, component and content updates without
navigation, retains carousel state, and restores all temporary invisible probes.
It requires an already running dev server and system Chromium; on a Mac, set
`CHROMIUM_EXECUTABLE_PATH` to your installed Chrome executable if needed.

## Mac launcher with Safari

From the complete local project folder, run:

```sh
bash scripts/start-safari.command
```

The launcher is macOS-only. It checks Node >=22.12, uses an existing Homebrew
to install Node 24 when necessary (otherwise opens the official Node download
page for a manual install), installs exact lockfile dependencies on first use
or changes, starts Vite on loopback with an available port and opens Safari.
It reuses a saved running server only after checking its process working
directory and Vite client. Keep the terminal window open. No Git remote or
deployment operation is performed. State/logs are ignored under `.local-dev/`.

The launcher was syntax-checked in the cloud; macOS installation and Safari
opening cannot be verified from the attached Linux environment. Existing HMR
validation uses Chromium and is not a claim of a Safari test.

For side-by-side windows, hover over the green window button in Codex, select
the left tiling option, then choose Safari for the right side. On macOS versions
with different menu labels, drag/resize both windows to occupy half the screen.
