# Motion and interaction polish

- [x] Inspect the live site on desktop and mobile, preserving the existing visual identity.
- [x] Shorten scroll settling, heading reveals, and illustration sequences.
- [x] Make the outreach approval and illustration replay controls usable.
- [x] Refine button, navigation, and FAQ feedback.
- [x] Verify both languages, responsive layouts, reduced motion, and mobile performance.
- [ ] Open a pull request and inspect the deployed preview. Production merge requires owner approval.

## Validation

- Build and lint passed. All 40 lead-function tests passed.
- Layout checks passed across 19 screen sizes in both languages, plus reduced motion. Two interrupted browser runs passed on a separate retry.
- `node scripts/check-demo-controls.mjs` checks keyboard approval, approval during replay, language changes, reduced motion, and the absence of network writes.
- `node scripts/check-booking-dots.mjs` passed, preserving the existing calendar interaction.
- Lighthouse mobile performance: 95/100, 2.5-second largest contentful paint, 60 ms total blocking time, no layout shift. Measured on the production build with other browser checks stopped.
- Desktop and mobile examples, mobile navigation, and FAQ opening were also checked visually.
