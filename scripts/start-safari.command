#!/bin/bash
# Run on the Mac from Terminal, Finder, or the local Codex project.
set -euo pipefail

if [ "$(uname -s)" != "Darwin" ]; then
  echo "This launcher must run on your Mac. The cloud Linux workspace cannot open Safari."
  exit 2
fi

export PATH="$PATH:/opt/homebrew/bin:/usr/local/bin"
branden_project_dir="$(cd "$(dirname "$0")/.." && pwd -P)"
cd "$branden_project_dir"
if [ ! -f package.json ] || [ ! -d src ] || [ ! -f vite.config.ts ]; then
  echo "The complete Vite project is required: package.json, src/, and vite.config.ts."
  exit 1
fi

branden_state_dir="$branden_project_dir/.local-dev"
mkdir -p "$branden_state_dir"

# Reuse this project's server, never another project's listener.
if [ -f "$branden_state_dir/url" ]; then
  branden_url="$(cat "$branden_state_dir/url")"
  if [[ "$branden_url" =~ ^http://127\.0\.0\.1:([0-9]+)/$ ]]; then
    branden_port="${BASH_REMATCH[1]}"
    for branden_pid in $(lsof -nP -t -iTCP:"$branden_port" -sTCP:LISTEN 2>/dev/null || true); do
      branden_server_dir="$(lsof -a -p "$branden_pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p')"
      if [ "$branden_server_dir" = "$branden_project_dir" ] && curl --silent --fail --max-time 2 "${branden_url}@vite/client" >/dev/null; then
        echo "Reusing this project's running Vite server: $branden_url"
        open -a Safari "$branden_url"
        exit 0
      fi
    done
  fi
fi

branden_node_ok() {
  command -v node >/dev/null 2>&1 && node -e 'const [m,n]=process.versions.node.split(".").map(Number);process.exit(m>22 || (m===22 && n>=12) ? 0 : 1)' >/dev/null 2>&1
}
if ! branden_node_ok; then
  if command -v brew >/dev/null 2>&1; then
    echo "Node.js 22.12+ is required. Installing the Node.js 24 Homebrew formula."
    HOMEBREW_NO_AUTO_UPDATE=1 brew install node@24
    branden_node_prefix="$(brew --prefix node@24)"
    export PATH="$branden_node_prefix/bin:$PATH"
  else
    echo "Install Node.js 24 LTS from the official download page, then run this launcher again."
    open 'https://nodejs.org/en/download'
    exit 1
  fi
fi
branden_node_ok || { echo "Node.js 22.12+ is required."; exit 1; }
node --version
npm --version

# Restore exact dependencies only if missing or the lockfile has changed.
branden_lock_hash="$(shasum -a 256 package-lock.json | awk '{print $1}')"
branden_saved_hash="$(cat "$branden_state_dir/dependencies.sha256" 2>/dev/null || true)"
if [ "$branden_saved_hash" != "$branden_lock_hash" ] || ! npm ls --depth=0 >/dev/null 2>&1; then
  npm ci --no-audit --no-fund
  printf '%s\n' "$branden_lock_hash" > "$branden_state_dir/dependencies.sha256"
fi

branden_log="$branden_state_dir/vite.log"
: > "$branden_log"
rm -f "$branden_state_dir/url"
# Open Safari once Vite prints the actual port it selected. No public tunnel.
(
  for ((branden_attempt=0; branden_attempt<120; branden_attempt++)); do
    branden_url="$(sed -nE 's/.*(http:\/\/127\.0\.0\.1:[0-9]+\/).*/\1/p' "$branden_log" | head -n 1)"
    if [ -n "$branden_url" ] && curl --silent --fail --max-time 1 "$branden_url" >/dev/null; then
      printf '%s\n' "$branden_url" > "$branden_state_dir/url"
      open -a Safari "$branden_url"
      exit 0
    fi
    sleep 0.5
  done
  echo "Safari could not be opened automatically. Check the Vite URL printed in this terminal."
) &
branden_opener_pid=$!
trap 'kill "$branden_opener_pid" 2>/dev/null || true' EXIT

echo "Keep this terminal running. Codex edits update Safari through Vite HMR."
echo "Vite will try port 5173, then select the next available port if needed."
# Run in the foreground so Terminal retains the dev-server session and its logs.
NO_COLOR=1 npm run dev -- --host 127.0.0.1 --port 5173 2>&1 | tee "$branden_log"
