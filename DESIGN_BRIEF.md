# BRANDEN. — Premium Dark Editorial

Current direction: the owner's Antony-inspired request, 2026-10-16. Borrow
personal narrative, a clear project index, quiet hierarchy, generous spacing and
photographic case-study rhythm. Do not copy template source, proprietary images
or brand text. The Framer marketplace reference was blocked by the cloud proxy;
the owner's explicit specification guides this implementation.

Shared tokens are in src/design-system.css. Primary #08090D, secondary #111827,
card #252B35, text #F4F5F7, secondary text #9CA3AF, muted #747B89. Photos retain
natural color. Neutral overlays support legibility; borders replace glow.

Self-hosted fonts in src/fonts.css: Noto Serif TC Variable (Chinese headings,
400–500), Instrument Serif (English display, limited italic), Noto Sans TC
Variable (Chinese body), Inter Variable (UI and English body). Unicode-ranged
WOFF2 loads only the necessary faces. Display 76–168px, h1 42–96px, h2 48–88px,
body 16px / ~2 line-height for Chinese, captions 12px, metadata 10px. Mobile
adjustments preserve reading order, Chinese line breaks and photo crops.

Home preserves cinematic Hero, interactive perspective carousel, selected work,
About, Journey and Contact. Dedicated /about/, /projects/ and /experience/
provide depth without placing everything on the homepage. Three existing cases
retain source-backed roles and reflections, with photography between chapters.

Content is typed in src/content/model.ts, projects.ts, drafts.ts and journey.ts.
Unverified projects remain hidden; no invented outcomes. No new Drive images
are released without rights review, especially recognizable minors.

The 3D carousel retains pointer, touch and scoped keyboard controls. All motion
respects prefers-reduced-motion. The local studio preserves IndexedDB drafts,
image conversion, validation, import/export, ordering and visibility. It is not
an authenticated shared CMS. No login mock or server writes are implied.

Release policy: independent branch, tested preview on the existing Netlify site,
then owner review before any production merge or release. Never force push.
