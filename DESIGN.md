---
name: FlowSync AI Solutions
description: A cinematic workspace for an AI automation agency.
colors:
  canvas: "#0a0a0b"
  surface: "#121214"
  raised: "#17161b"
  line: "#232227"
  fg: "#f4f3ed"
  muted: "#b3b1aa"
  faint: "#82817c"
  accent: "#9d7cff"
typography:
  display:
    fontFamily: '"Mona Sans Variable", system-ui, sans-serif'
    fontSize: "clamp(3.05rem, 7.6vw, 6rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: '"Mona Sans Variable", system-ui, sans-serif'
    fontSize: "clamp(1.9rem, 1.2rem + 2.6vw, 3.1rem)"
    fontWeight: 620
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  scene-headline:
    fontFamily: '"Mona Sans Variable", system-ui, sans-serif'
    fontSize: "clamp(2.5rem, 4.7vw, 4.5rem)"
    fontWeight: 620
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  title:
    fontFamily: '"Mona Sans Variable", system-ui, sans-serif'
    fontSize: "1.25rem"
    fontWeight: 620
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: '"Mona Sans Variable", system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  action:
    fontFamily: '"Mona Sans Variable", system-ui, sans-serif'
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.6
  machine:
    fontFamily: '"IBM Plex Mono", ui-monospace, monospace'
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.canvas}"
    typography: "{typography.action}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-quiet:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.fg}"
    typography: "{typography.action}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  field:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.fg}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  work-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: FlowSync AI Solutions

## Overview

**Creative North Star: “Cinematic workspace.”**

FlowSync is shown as a place where business work moves through real tools. Graphite architecture, sculpted work surfaces and directional white and lavender light give the pages depth; large, readable Mona Sans keeps the work in front. The existing FlowSync mark remains part of the header.

Scroll selects workflow beats and reverses their order. Within each beat, a short interruptible transition reveals new work: record fields, business rules or a draft, then the completed action or review-ready reply. Step buttons offer direct control. Work surfaces settle into short readable holds. The scenes use native HTML for their words and controls, so the experience remains useful without WebGL or when motion is reduced. English and Italian are both first-class layouts.

**Key Characteristics:**
- Graphite base with lavender reserved for calls to action and meaningful states.
- Layered architecture around readable HTML work surfaces.
- Purposeful, reversible scroll movement with a complete static fallback.

## Colors

The palette pairs near-black graphite surfaces and warm-white text with lavender for interface actions, meaningful states and the directional lighting in the workspace.

### Primary
- **Signal lavender**: the primary action, selected or live states, and key figures.

### Neutral
- **Canvas black**: page background and the dark base of the workspace.
- **Surface graphite**: contained panels and raised work areas.
- **Raised graphite**: secondary emphasis within the dark interface.
- **Line graphite**: borders and dividers.
- **Warm white**: primary text and high-importance values.
- **Muted stone**: supporting text.
- **Faint stone**: lowest-contrast text; keep it at the established legible contrast.

**The Interface Signal Rule.** In interface details, lavender marks an action or meaningful state. The workspace may also use lavender as architectural light.

## Typography

**Display Font:** Mona Sans Variable (system-ui, sans-serif)
**Body Font:** Mona Sans Variable (system-ui, sans-serif)
**Label/Mono Font:** IBM Plex Mono (ui-monospace, monospace), only for machine output inside illustrations.

**Character:** Mona Sans is broad, direct and readable. Large sizes carry the cinematic scale; the same family keeps body copy and controls clear.

### Hierarchy
- **Display** (600, responsive 3.05–6rem, line-height 1): the opening headline, with tight tracking.
- **Headline** (620, responsive 1.9–3.1rem, line-height 1.06): section headings.
- **Scene headline** (620, responsive 2.5–4.5rem, line-height 1.04): independent service scene titles.
- **Title** (620, 1.25rem, line-height 1.25): component and card headings.
- **Body** (400, 1rem, line-height 1.6): standard readable copy.
- **Action** (600, 0.95rem, line-height 1.6): buttons and compact calls to action.
- **Machine output** (400, 0.75rem, line-height 1.5): IBM Plex Mono within illustrations only.

**The Readable Scale Rule.** Display type may be expansive; body copy and controls remain practical at every viewport.

## Layout

The main content uses a centered 1200px maximum width with 20px gutters, growing to 32px and 48px at wider breakpoints. Desktop workspace scenes use a full-viewport architectural backdrop and a two-column story stage; mobile changes the story to one column, shortens travel and keeps the service steps visible. Content grows with its text; never clip copy or require a fixed-height text box. The site has four core pages, with separate English and Italian paths.

The environment begins only when its world approaches the viewport and waits until after the first paint before setup. Drawing pauses while the scene is off screen or the tab is hidden. Reduced motion removes the 3D backdrop and keeps the HTML work visible. Without OffscreenCanvas, a worker or WebGL, the same HTML remains available against the CSS background.

## Elevation & Depth

Depth comes from layered graphite and violet surfaces, perspective, directional light, soft black shadows and the architectural frame. Shadows support separation between work planes; they do not create a glow around controls. The static CSS background gives the scene a graphite-to-violet atmosphere when the rendered environment is unavailable.

## Shapes

Controls use gently rounded corners (8px). Work surfaces use a more sculpted 12px corner; smaller status marks and nested elements use 6–8px. Fine graphite lines separate records and sections. Build the architectural framing from code geometry and HTML; no decorative raster artwork is part of this system.

## Components

### Buttons
- **Character:** clear, tactile actions with a compact shape.
- **Shape:** gently rounded (8px); primary buttons use 20px horizontal and 12px vertical padding.
- **Primary:** lavender fill with canvas-black text; hover lightens the lavender. Press briefly scales down.
- **Quiet:** transparent canvas, warm-white text and a fine inset line; hover uses raised graphite.
- **Focus:** a visible 2px lavender outline with a 3px offset.

### Cards / Containers
- **Corner style:** sculpted surfaces use 12px; standard evidence cards use 10px.
- **Background:** surface or raised graphite, sometimes with a restrained graphite-to-violet surface treatment.
- **Depth:** black shadows separate foreground work from the environment; borders remain thin and quiet.
- **Internal padding:** 24px for the large work surfaces; compact sub-panels use 16–20px.

### Inputs / Fields
- **Style:** canvas background, faint border, warm-white text and 8px corners, with 14px horizontal and 12px vertical padding.
- **Focus:** lavender border and the shared visible focus outline.
- **Behavior:** native labels and controls stay available to keyboard and touch users.

### Navigation
- **Desktop:** the logo, grouped Services menu, language switch and booking action sit in a fixed 64px header. The Services control opens on hover, click or keyboard; its links gain a raised graphite background on hover.
- **Mobile:** a full-height, scrollable menu groups the two services and keeps language and booking actions within reach.
- **Behavior:** Services opens by hover, click or keyboard; Escape and outside interaction close it. Focus remains visible.

### Workspace scene
- **Character:** layered request, record and action surfaces show a task moving through tools.
- **Motion:** scroll chooses the beat; local transitions settle in 160–360ms regardless of scroll speed. Desktop uses a short 155svh track, mobile uses natural flow. Step buttons work with mouse, keyboard and touch. The scroll wheel is never captured.
- **Causality:** record values appear after lookup, rules or draft follow the record, and the action receipt appears only at completion. Outreach clearly labels the later illustrative reply and keeps it ready for human review.
- **Environment:** restrained camera travel, fixed roll and antialiased edges keep attention on the tool action. The opening headline stays readable during scrolling.
- **Content:** every synthetic demonstration is labelled illustrative. HTML carries the actual text and progress state; the canvas is decorative and hidden from assistive technology.

## Do's and Don'ts

### Do:
- **Do** keep the FlowSync logo, graphite architecture, sculpted surfaces and directional white/lavender light.
- **Do** use Mona Sans Variable for interface text and IBM Plex Mono only for machine output in illustrations.
- **Do** keep focus visible, keyboard and touch operation complete, and reduced-motion content readable.
- **Do** keep English and Italian copy within the same flexible layout rules.
- **Do** label invented examples as illustrative and preserve the evidence source and limits beside real figures.

### Don't:
- **Don't** use lavender as general interface decoration or invent figures, client claims or promises.
- **Don't** make WebGL, motion or a worker necessary to read or use the page.
- **Don't** capture scrolling, add endless animation or hide meaningful content behind a scene.
- **Don't** use fixed-height text boxes or clip text at small sizes.
