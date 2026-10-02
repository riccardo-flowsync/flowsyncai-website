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
website dependencies, looping effects, scroll holds, or 3D rendering. The latest
owner refinement extends the circuit field behind the whole home page through
the footer and lets the top navigation scroll away naturally.

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
- [x] Prepare a reviewable preview and pull request. Production merge requires owner approval.

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
- Background: a small set of SVG circuit paths across the full home page and footer.
  Light up with scrolling; never add extra scrolling distance.
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

## Review

- Pull request: https://github.com/riccardo-flowsync/flowsyncai-website/pull/5
- Vercel preview: https://flowsyncai-website-git-codex-flo-bf39a2-riccardo-2769s-projects.vercel.app
  (requires the project's existing Vercel sign-in).
- Local production-build preview: http://127.0.0.1:4177/ while this session's server runs.
- Vercel reports a successful preview deployment. Its served page references the
  same production JavaScript bundle as the locally tested build.

## Browser polish follow-up

Owner feedback, 2026-10-02: inspect the preview directly, fix small visual flaws,
and make the circuit paths clearly light up while scrolling. Keep this in preview.

- [x] Inspect the page with computer use at desktop and phone widths.
- [x] Keep brighter circuit traces in the margins and tie illumination to the visible scroll position.
- [x] Remove text showing through the header; align support figures and improve disclosure controls.
- [x] Confirm the changes in the browser, check layouts and reduced motion, and measure mobile performance.
- [x] Save and push the refinements to the existing preview pull request.

Follow-up verification: build and lint pass; 42 layout configurations and all 8
interaction combinations pass. The interaction check now verifies that the light
reaches 65% of the viewport, reverses on upward scrolling, stays outside the text,
and remains fully drawn for reduced motion. Desktop and phone views confirmed with
computer use, including service navigation and opening the result details.

Latest local mobile Lighthouse: performance 95, accessibility 100, best practices
100, SEO 100. LCP 2.4 seconds, blocking time 50 milliseconds, layout shift 0.

## Continuous background refinement

Owner feedback, 2026-10-02: use the whole background, not narrow edge rails; carry
it from the opening through the footer and remove the frozen top boundary.

- [x] Replace narrow rails with broad, low-contrast circuit routes at two depths.
- [x] Extend the background through all home sections and the footer.
- [x] Let the top navigation scroll away; remove the fixed progress rail and full-width section rules.
- [x] Adjust the mobile service navigation and link offsets for the scrolling header.
- [x] Verify desktop/phone renders, footer illumination, navigation, reduced motion, layouts, and mobile performance.
- [x] Update the existing preview pull request, keeping production unchanged.

Refinement verification: production build and lint pass. All 42 layout
configurations pass. All 8 interaction configurations pass, including the two
phone cases rerun after accounting for fractional scroll rounding in the check.
The checks cover full-page background coverage, illumination in both directions
and at the footer, the scrolling header, both languages, service links, route
cleanup, and reduced motion. Desktop and phone renders confirmed with computer use.

Current local mobile Lighthouse: performance 94, accessibility 100, best practices
100, SEO 100. LCP 2.6 seconds, blocking time 60 milliseconds, layout shift 0.
