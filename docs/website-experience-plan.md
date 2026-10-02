# FlowSync website experience

Date: 2026-10-02

## Objective

One clear marketing page for an AI automation agency. Give AI outreach and the
AI agent their own recognizable service sections. Show real results and make
the demonstrations understandable within a few seconds.

## Direction

Preserve the dark palette, Mona Sans, violet signals, normal scrolling, and
the existing service navigation. Fluid movement represents flow; precise
circuit paths represent sync. Use the existing GSAP and CSS, with no new
website dependencies, looping effects, scroll holds, or 3D rendering.

The current implementation and the 2026-10-02 brief take precedence over the
older description of pinned scenes in CLAUDE.md. Preserve both instruction files.

## Checklist

- [x] Inspect the current page, services, motion, proof, and project constraints.
- [x] Establish the visual and motion direction from the owner's brief.
- [x] Clarify the agency identity and show both service outcomes in the opening.
- [x] Give each service a distinct outcome and a concise, approximately 3-second demo.
- [x] Add restrained circuit paths that respond to scroll and retain a static fallback.
- [x] Tighten results, process, navigation, and FAQ copy in English and Italian.
- [x] Verify build, lint, lead tests, responsive layouts, motion preferences, and mobile performance.
- [x] Review desktop and mobile renders and fix any concrete defects in one batch.
- [ ] Open a reviewable preview and pull request. Production merge requires owner approval.

## Content boundaries

AI outreach finds prospective buyers, sends cold email, handles replies with
human approval by default, and helps book appointments. Say it can launch
quickly without inventing a fixed launch deadline. AI agent handles customer
questions on website chat and Instagram, uses business information, and hands
over to the team when needed. No new telephone-channel claims.

Keep existing sourced figures, dates, anonymization, and estimate labels.
Keep legal/contact routes and the existing booking and lead behavior.

## Motion specification

- Focal sequence: a compact two-service illustration, understandable at rest.
- Continuity: keep the service index and animate the shift between its two symbols.
- Background: a small set of SVG circuit paths behind the opening and services.
  Draw with scrolling; never add extra scrolling distance.
- Feedback: short button responses and native expandable FAQ answers.
- Accessibility: readable final states without motion, no focus traps, native touch scrolling.
- Budget: no new runtime packages; mobile Lighthouse performance at least 90.

## Verification

- Production build and ESLint pass. All 40 lead and booking webhook tests pass.
- All 42 responsive configurations pass, including narrow and landscape phones,
  both languages, and reduced motion. One interrupted browser evaluation passed
  on an isolated rerun.
- All 8 experience checks pass: desktop/phone, English/Italian, normal/reduced
  motion. Both service demos finish within 3 seconds; navigation, direct links,
  language changes, circuit activation, and reduced-motion fallbacks work.
- Desktop and phone renders reviewed. No overflow, clipped text, scroll holds,
  or hidden mobile booking action.
- Local production-build mobile Lighthouse: performance 94, accessibility 100,
  best practices 100, SEO 100. LCP 2.6 seconds, blocking time 60 milliseconds,
  layout shift 0. Lab scores are not a guarantee of live visitor performance.
- No new runtime dependencies. Removed the old booking WebGL dot effect and its
  dedicated check; the restrained SVG circuit paths provide the background motion.
- Production remains unchanged until the owner approves the pull request merge.
