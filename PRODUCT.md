# Product

<!-- impeccable:product-schema 1 -->

## Platform

Web

## Users

B2B owners and teams evaluating AI automation for sales outreach, customer support or repeatable office work.

## Product purpose

Show how FlowSync builds AI systems that perform business work, help visitors assess the service and its evidence, and make it easy to book an introductory call.

## Experience structure

The approved 2026-10-02 redesign has four core pages: home, AI outreach, AI agents and contact. Privacy and terms remain separate legal pages. The home page introduces the agency, presents the two services independently, explains preparation and launch, and leads to booking. Each service page carries its own examples and evidence.

The header groups AI outreach and AI agents under Services. It retains the logo, language switch and booking action. On mobile, it presents Services as an accessible grouped menu. The old results and how-we-work pages redirect to relevant homepage sections or service evidence, with English and Italian URL prefixes retained.

## Capabilities and constraints

- AI outreach runs personal cold email for B2B buyers. Replies are prepared for human review by default.
- AI agents act within the tools and permissions configured for an agreed role. Current support examples include website chat, Instagram, connected store actions and team handoff through tickets. Other repeatable office work depends on the specific role and permissions.
- Keep the existing contact form and Cal.com booking flow. Load the calendar only after the visitor asks to see available times.
- The site is available in English and Italian. Legal pages remain in both languages.

## Brand commitments

Present FlowSync as an AI automation agency. Keep the graphite workspace, sculpted work surfaces, directional light, Mona Sans and existing logo. Use plain words, sentence case and Italian with "tu". The exact design rules and permitted claims are in `CLAUDE.md`.

## Evidence on hand

Campaign and support records live in `src/components/Results.jsx` and are shown on their respective service pages. Keep dates, definitions, sources and limitations with the numbers. The service demonstrations use invented examples and clearly label them as illustrative. Do not add client names, testimonials, unsupported metrics or promises.

## Product principles

- Show work being performed in the configured tools, not only a chat bubble.
- Explain what happens and where a person reviews or receives a handoff.
- Keep AI outreach and AI agents independently understandable.
- Let dated, anonymized evidence carry the argument.
- Preserve useful HTML content and controls when motion is reduced or WebGL is unavailable.
- Make booking easy without loading the third-party calendar before the visitor chooses.

## Accessibility and inclusion

Support keyboard and touch operation, visible focus, reduced motion and readable layouts from small phones to wide desktops. The Services menu opens by hover, click or keyboard and closes on Escape or outside interaction. Scroll-driven scenes follow normal scrolling, reverse on the way back and never capture the wheel.
