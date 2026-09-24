---
name: ScreenReel
tagline: Product demos that record and repair themselves
category: Builds
status: Active
impact: One flow for live demos, guided tours, and video capture
icon: play
order: 1
link: https://alafazam.com/screenreels/
tags: [Developer tools, Product demos, Browser automation]
---

ScreenReel is a self-hosted toolkit for authoring a product journey once, presenting it live inside the product, and capturing the same flow as polished video.

## Why I built it

Product demos drift whenever the product changes. Teams then maintain separate scripts for live presentations, guided tours, and recorded videos — each with its own selectors, pacing, and failure modes.

## How it works

ScreenReel uses one browser action runtime across three surfaces: **Projector** presents the journey inside the product, **Studio** lets an author record and repair scenes locally, and **Capture** turns the same scenes into deterministic video. Its validation and repair tools detect broken selectors as the host product evolves.

## Design principles

- Self-hosted, with no required backend, account, analytics service, or model provider
- Browser-local authoring and personal flows
- One portable flow contract across live presentation and video capture
- Explicit validation that fails loudly when a product change breaks a demo

The live showcase includes guided playback, route changes, personalization, branching, narration, analytics events, and Studio authoring.
