# Cinematic workspace redesign

Approved: 2026-10-02. Build on the existing preview branch; production requires owner approval.

## Checklist
- [x] Confirm cinematic direction and four-page structure with owner.
- [x] Research references and motion skills with GPT-6 Luna agents.
- [x] Build opening and first scroll transition.
- [x] Complete independent service scenes and homepage process.
- [x] Implement Services dropdown and legacy redirects.
- [x] Move evidence into respective service pages; complete EN/IT copy.
- [x] Verify desktop/mobile motion, reverse scroll, fallback, keyboard and booking.
- [x] Run layout, journey, API, lint/build and repeated mobile performance checks.
- [x] Complete fresh design review and documentation.
- [x] Push draft PR and inspect deployed preview.
- [ ] Obtain owner approval for production.

## Direction contract
THESIS: FlowSync builds AI that performs business work. Show the execution of that work in a cinematic workspace; replace the prior text-and-card site.
OWN-WORLD: Graphite architecture, sculpted physical planes, directional white and lavender lighting, Mona Sans, expansive readable type, perspective tool surfaces with purposeful depth. The existing logo remains.
STORY: Enter the agency workspace; explore AI outreach and AI agents as separate services; understand preparation and launch; book a call. Actual case records live on their respective services.
FIRST VIEWPORT: A full-width architectural opening, large agency headline at the front plane, booking within reach, and task surfaces behind and below. Scrolling brings the workspace forward into the first distinct service scene.
FORM: User-selected cinematic workspace, explicitly approved after live Vision Crafters and Linear references. Code-led build because the defining deliverable is working reversible motion and live HTML interfaces, not a static comp.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Motion contract
One lazy Three.js environment per page, with camera movement driven by scroll and visible DOM work surfaces. No autonomous endless animation or wheel capture. Readable holds precede exit. Mobile uses shorter travel and portrait compositions. Reduced motion/no WebGL keep readable HTML and functional examples. AI agents visibly read records and perform connected actions; they are not represented solely by chat bubbles. Every synthetic demonstration is labelled illustrative.

## Research references
- https://www.bilalstudio.io/works/vision-crafters/ (documented build window 2026-07-25 to 2026-08-26)
- https://sorin.work/work/creativedaco (June–August 2026 work period)
- https://github.com/MustBeSimo/web-design-studio/blob/main/SKILL.md
- https://github.com/greensock/gsap-skills
- Existing Impeccable, design-motion-principles, 60fps-animation, accessible-animation skills.

The owner selected cinematic workspace and approved the implementation plan. The two services are independently available. Ecommerce provides concrete agent examples; custom administrative roles depend on the configured tools and permissions. Do not invent universal integrations, commercial promises or case-study data.

## Validation log
- 2026-10-02: build and ESLint pass; 40 API checks pass. Lead endpoints unchanged.
- Full layout matrix: 158/168 passed, exposing a 5px horizontal shift in the homepage process on five portrait sizes in both languages. Fixed the originating horizontal animation. All 80 phone/reduced-motion rechecks now pass.
- Cinematic source detector: no findings.
- Performance: moved shader preparation/rendering into an OffscreenCanvas worker and staged scene setup after first paint. Initial optimized mobile Home run: 96, 70ms blocking time, 2.3s largest-content paint. Repeated runs pending.
- Final functional journey and demonstration checks pass, including viewport resizing, switching reduced motion mid-session and a browser with hardware/software WebGL disabled.
- Desktop and portrait recordings show opening, completed workflow hold and rewind; service exit is asserted and captured on desktop. Phone agent-action capture shows order lookup, return registration and team ticket.
- Fresh independent design review returned fix for one clipped mobile hero row. Added room for the moving panel; recaptured at the same sizes. Independent verdict: ship for the corrected opening, no visible regressions.
- Repeated mobile Lighthouse on the local production build: Home 97/97; AI outreach 95/95; AI agents 95/97; Book a call 96/96.

- Final complete layout matrix: 168/168 passed, including cinematic intermediate states, both languages, short screens and reduced motion. Final lint and production build pass.
- Deployed preview verified for implementation commit 304f741: Vercel success; matching production asset hash; WebGL rendering; desktop/mobile Services and Escape; full mobile opening; connected order/return/ticket demo; Italian legacy Results redirect to agent evidence. PR 4 remains draft. Production awaits owner approval.
