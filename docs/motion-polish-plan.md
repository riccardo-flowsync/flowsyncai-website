# Motion and interaction polish

- [x] Inspect the live site on desktop and mobile, preserving the existing visual identity.
- [x] Shorten scroll settling, heading reveals, and illustration sequences.
- [x] Make the outreach approval and illustration replay controls usable.
- [x] Refine button, navigation, and FAQ feedback.
- [x] Verify both languages, responsive layouts, reduced motion, and mobile performance.
- [x] Open a pull request and inspect the deployed preview. Production merge requires owner approval.

## Validation before the six-page upgrade

- Build and lint passed. All 40 lead-function tests passed.
- Layout checks passed across 19 screen sizes in both languages, plus reduced motion. Two interrupted browser runs passed on a separate retry.
- `node scripts/check-demo-controls.mjs` checks keyboard approval, approval during replay, language changes, reduced motion, and the absence of network writes.
- `node scripts/check-booking-dots.mjs` passed, preserving the existing calendar interaction.
- Lighthouse mobile performance: 95/100, 2.5-second largest contentful paint, 60 ms total blocking time, no layout shift. Measured on the production build with other browser checks stopped.
- Desktop and mobile examples, mobile navigation, and FAQ opening were also checked visually.
- [Pull request #4](https://github.com/riccardo-flowsync/flowsyncai-website/pull/4) has a ready Vercel preview. Approval was verified in the deployed preview through the browser. The isolated external test browser could not reach the app, so automated interaction checks were verified on the local production build.

This records the earlier motion pass. Current website validation is in `website-upgrade-plan.md`. The home booking animation and its dot-field check were retired when booking moved to the contact page.
