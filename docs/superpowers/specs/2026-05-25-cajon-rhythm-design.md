# Cajon Rhythm Design

## Goal
Build a mobile-first cajon rhythm game web app from the supplied master prompt. The app must run without supplied media by using visual placeholders and Web Audio fallback synthesis, while preserving the expected asset paths for later drop-in images and samples.

## Architecture
The app is a Vite, React, and TypeScript project. React owns screen flow and rendering, while pure game logic lives under `src/engine`. The rhythm engine exposes snapshots that React can render with DOM nodes moved by CSS transforms.

## Core Experience
The first screen is the playable app, not a landing page. Users can start instrument mode, choose a rhythm chart, open the tutorial, or change settings. The game stage centers a vertical cajon body with four hit targets: Slap L, Slap R, Bass L, and Bass R.

## Audio
`AudioEngine` uses Web Audio API. It attempts to load `public/audio/slap.mp3` and `public/audio/bass.mp3`; if either file is missing, it plays synthesized cajon-like fallback sounds. Volume, hit variation, stereo pan, and unlock behavior are handled in the engine.

## Rhythm Logic
Charts are TypeScript objects. `judge.ts` owns lane metadata, timing windows, scoring, ranking, and accuracy helpers. `RhythmEngine` owns sorted runtime notes, misses, hit results, visible note calculation, count-in, pause, resume, finish state, and result snapshots.

## Storage
Settings and best scores use migration-safe localStorage keys:
- `cajon-rhythm:settings:v1`
- `cajon-rhythm:bestScores:v1`
- `cajon-rhythm:tutorialSeen:v1`

## Assets
Runtime asset aliases point at `public/assets/*.png`. Because the current folder does not contain image attachments, each alias has a CSS/text fallback. Original assets can later be placed in `public/assets/original/` and copied to the documented ASCII aliases.

## Testing
Vitest covers judge behavior and rhythm engine behavior from the prompt. Build verification covers React, TypeScript, CSS, PWA manifest links, and import health.

## Self-Review
No open placeholders block MVP execution. Missing image and audio attachments are handled through explicit fallback behavior. The design matches the prompt scope while prioritizing an executable mobile game over advanced service-worker caching.
