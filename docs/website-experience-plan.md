# FlowSync website experience

Date: 2026-10-02

Current status, 2026-10-03: the approved design is published and the live
contact and booking connections have been verified. Earlier sections preserve
the preview review history; the completed release checklist is at the end.

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

- Focal sequence: one outreach example, completed over 240 pixels of scrolling,
  with all labels readable at rest.
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

## Separate services and improve reading contrast

Owner feedback, 2026-10-02: lead with AI outreach, remove the suggestion that the
two services work together, keep the two-services introduction, and place each
service's results with that service. Keep the full-page circuit background but
reduce its competition with text and small purple elements.

- [x] Restore a single outreach example in the opening, completed over a short scroll.
- [x] Keep the agency identity and present the two services as separate choices.
- [x] Group outreach with outreach results, then AI agent with support results.
- [x] Soften circuit contrast and give content and labels solid dark surfaces.
- [x] Verify responsive layouts, service navigation, motion, reading contrast, and loading speed.
- [x] Update the existing review preview; keep production unchanged.

The opening now shows a single outreach example with readable labels and a short,
reversible scroll trace. The two-services introduction is followed by a complete
outreach chapter and a complete AI agent chapter, each with its own proof. Neutral
opaque surfaces keep circuit lines out of the service copy, labels, and figures.
The smaller service index retains its envelope-to-chat transition. All existing
case-study figures, dates, source notes, and estimate labels remain intact.

Build and lint pass. All 42 layout cases and 8 interaction configurations pass.
The added interaction coverage checks the short workflow and its rewind, results
ownership, and both results anchors clearing the mobile navigation. Desktop and
phone views were inspected with computer use. No runtime dependencies were added.

Latest local mobile Lighthouse: performance 94, accessibility 100, best practices
100, SEO 100. LCP 2.4 seconds, blocking time 120 milliseconds, layout shift 0.

## Keep circuit routes visible between objects

Owner feedback, 2026-10-03: lines should remain visible in empty areas and be
clearer, while passing behind actual cards and other solid objects.

- [x] Remove opaque fills from the service, result, and desktop-index wrappers.
- [x] Strengthen the base and active traces; keep cards, chips, and controls opaque.
- [x] Verify desktop and phone views, then update the review preview.

Desktop and phone renders confirm continuous paths in the gaps and opaque cards.
Build, lint, and all 42 layout configurations pass. Mobile Lighthouse remains 94
for performance and 100 for accessibility, best practices, and SEO, with no layout
shift. Scroll timing and interaction logic are unchanged. Production is unchanged.

## Balance the circuits with clear reading areas

Owner feedback, 2026-10-03: the stronger routes look too chaotic. Preserve depth
in the open spaces while keeping words and figures easy to read.

- [x] Remove the duplicate routes and use a single, moderately lit circuit layer.
- [x] Add soft dark backing only to reading groups, leaving section gaps transparent.
- [x] Check desktop and phone views, responsive layouts, and loading speed.
- [x] Update the review preview, keeping production unchanged.

The circuit now uses three routes instead of six. A soft canvas fade sits beneath
short reading groups and individual figures; full service and result sections
remain transparent, and cards remain opaque. Scroll behavior is unchanged.

Build, lint, and all 42 layout configurations pass. Desktop and phone views confirm
clear figures, headings, service copy, and visible routes in the gaps. Mobile
Lighthouse: performance 94, accessibility 100, best practices 100, SEO 100,
LCP 2.6 seconds, blocking time 50 milliseconds, layout shift 0.

## Replace the process timeline with a founder introduction

Owner approval, 2026-10-03: replace the crowded launch illustrations with the
founder section proposed in review, using the approved portrait composite that
preserves the original face.

- [x] Replace the timeline with a spacious portrait, factual EN/IT introduction, and booking link.
- [x] Update navigation and remove the repeated home-page founder block.
- [x] Verify portrait fidelity, responsive layouts, links, and mobile performance.
- [x] Update the existing review preview, keeping production unchanged.

The About section replaces the illustrated launch steps. It uses the approved
portrait, a short founder introduction, and one booking CTA. Header and footer
links now point to About / Chi siamo. The home booking block no longer repeats
the founder profile; the standalone contact page retains the name and portrait.
No LinkedIn link is shown because none was supplied.

The portrait is lazy-loaded on the home page and encoded as lossless WebP;
decoded pixels match the approved PNG exactly. Build and lint pass. All 42 layout
configurations are covered successfully after rerunning one browser-error case
at 375 x 812 in English. Its normal and reduced-motion reruns both pass.
Desktop and phone visual review passed, with both language menus and the booking
CTA checked through computer use. The design detector reported no findings.
Mobile Lighthouse: performance 94, accessibility 100, best practices 100,
SEO 100; LCP 2.6 seconds, blocking time 60 milliseconds, layout shift 0.

## Shorten the page and keep a compact founder signature

Owner decision, 2026-10-03: remove the large founder section and keep a small
founder signature beside booking. Include Rome and Dubai in both languages.

- [x] Remove the founder section, portrait asset, and About navigation links.
- [x] Show the founder name, role, and Rome and Dubai beside booking in EN/IT.
- [x] Verify desktop/phone layouts, booking navigation, and page performance.
- [x] Update the review preview, keeping production unchanged.

The homepage now moves directly from the service results to FAQ and booking.
The founder signature is plain text on home and contact, with no portrait or
separate personal CTA. The original and edited portrait files remain outside the
website repository. Legal footer details are unchanged.

Build, lint, and all 42 responsive configurations pass. Desktop and phone visual
review found no material issues; English/Italian signatures and removed About
links were checked through computer use. The design detector reported no findings.
Mobile Lighthouse: performance 94, accessibility 100, best practices 100,
SEO 100; LCP 2.6 seconds, blocking time 50 milliseconds, layout shift 0.

## Production release and connection verification

Owner approval, 2026-10-03: publish the reviewed website, then connect and test
the contact and booking paths using clearly labelled disposable records.

- [x] Merge the approved website in PR #5 and publish it at https://flowsyncaisolutions.com.
- [x] Verify the live homepage, contact, privacy and terms pages use the approved build.
- [x] Submit the live contact form and verify the saved message, owner and 24-hour follow-up deadline.
- [x] Enable signed new-booking notifications and verify the production endpoint.
- [x] Complete a booking through the live website and verify a new lead record, calendar appointment and meeting link.
- [x] Verify confirmation emails reach both the host and the test visitor.
- [x] Cancel the test appointment, verify calendar cancellation and archive both test lead records.
- [x] Remove the temporary signing-secret file; keep credentials in the services' protected settings.

The connection setup required configuration changes only. The approved website
code and design are unchanged. Contact-form messages create lead records and do
not send automatic visitor email receipts; booking confirmations are emailed.
Detailed test evidence and screenshots are saved privately outside this public
repository, without adding credentials or test identities to Git.
