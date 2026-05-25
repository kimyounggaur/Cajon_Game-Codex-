# Cajon Rhythm Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Cajon Rhythm mobile web app requested in the master prompt.

**Architecture:** Create a Vite React TypeScript app. Keep pure rhythm, judge, audio, input, storage, haptics, and chart logic outside React components. Render the cajon and notes with DOM/CSS transforms and requestAnimationFrame.

**Tech Stack:** Vite, React, TypeScript, CSS variables, Web Audio API, localStorage, PWA manifest, Vitest.

---

### Task 1: Project Shell and Failing Tests

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/tests/judge.test.ts`
- Create: `src/tests/rhythmEngine.test.ts`

- [ ] **Step 1: Write failing tests**

Create tests for all required judge and engine behaviors: timing windows, one-time note judgement, nearest same-lane selection, lane isolation, sorted chart loading, hit scoring, miss reset, and finish state.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm run test`
Expected: FAIL because `src/engine/judge.ts` and `src/engine/rhythmEngine.ts` do not exist yet.

### Task 2: Pure Engine Modules

**Files:**
- Create: `src/engine/judge.ts`
- Create: `src/engine/chart.ts`
- Create: `src/engine/rhythmEngine.ts`
- Create: `src/engine/scheduler.ts`
- Create: `src/charts/*.ts`

- [ ] **Step 1: Implement minimal judge logic**

Implement lane metadata, timing windows, scoring, accuracy, rank, stars, and nearest-note judgement.

- [ ] **Step 2: Run judge tests**

Run: `npm run test -- src/tests/judge.test.ts`
Expected: PASS.

- [ ] **Step 3: Implement rhythm engine**

Implement chart loading, start/pause/resume/stop, visible notes, hits, misses, and finish snapshots.

- [ ] **Step 4: Run engine tests**

Run: `npm run test -- src/tests/rhythmEngine.test.ts`
Expected: PASS.

### Task 3: App UI and Runtime

**Files:**
- Create: `src/App.tsx`
- Create: `src/main.tsx`
- Create: `src/components/*.tsx`
- Create: `src/styles/*.css`
- Create: `src/assets/assets.ts`
- Create: `src/engine/audioEngine.ts`
- Create: `src/engine/input.ts`
- Create: `src/engine/storage.ts`
- Create: `src/engine/haptics.ts`

- [ ] **Step 1: Build mobile app shell**

Implement Home, Game, Settings, Tutorial, Result, HUD, CajonStage, CajonBody, TouchPad, and NoteView components.

- [ ] **Step 2: Build Web Audio runtime**

Implement unlock, preload, buffer playback, fallback synth, pan, gain, detune, and settings integration.

- [ ] **Step 3: Connect interactions**

Wire pointer events, keyboard mapping, haptic feedback, judgement feedback, and settings persistence.

### Task 4: PWA, README, Verification

**Files:**
- Create: `public/manifest.webmanifest`
- Create: `public/sw.js`
- Create: `README.md`

- [ ] **Step 1: Add manifest and lightweight service worker**

Keep caching conservative and safe for development.

- [ ] **Step 2: Run verification**

Run: `npm run test`
Expected: PASS.

Run: `npm run build`
Expected: PASS.

Run local app and inspect mobile viewport for no horizontal overflow.

## Self-Review
The plan covers all prompt deliverables. No task depends on unavailable attached assets or audio files; both are graceful fallbacks. The implementation is scoped as a complete MVP with room for later visual asset replacement.
