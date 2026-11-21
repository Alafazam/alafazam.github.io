---
title: "ScreenReel: a product demo that lives in the repository"
date: 2026-07-04
description: "Why I built ScreenReel, an open-source demo recorder: record a walkthrough by using your app, commit it as readable JSON, then play it live in the product, share it as a link, or render it as video."
tags: [side-project, open-source, product-demos, developer-tools]
---

Product demos rot. A screen recording is out of date the week the UI changes, and a click-through built in a separate demo tool is a second copy of the product that nobody maintains. The demo that matters most, the one a salesperson runs live, depends on someone remembering where to click.

So I built **ScreenReel**: an open-source demo recorder whose output is a plain file that sits next to the code it explains.

## Record by using the app

You record a flow in ScreenReel Studio by using your app normally. Studio turns typing, selects, toggles, sliders, clicks, scrolling and navigation into editable actions. Each scene gets a title, talking points and a pace, and the result exports as a `screenreel.json` file you commit with the app.

```json
{
  "id": "overview",
  "route": "/dashboard?team=sales",
  "title": "Start with the outcome",
  "talkingPoints": "Explain what changed and why it matters.",
  "actions": [
    { "type": "glow", "selector": ".kpi-card", "sequence": true, "count": 4 },
    { "type": "click", "selector": "[data-action=\"open-review\"]" }
  ]
}
```

Because it is plain JSON, a demo can be reviewed, diffed and versioned like any other change.

## One flow, three outputs

- **Live inside the product.** The Projector plays the flow in the real app: it moves a cursor to each target, clicks, types, highlights and shows presenter notes, without replacing anything in the application.
- **A self-playing link.** The same flow plays for a prospect as a video, an autoplay with cards, or a guided tour they step through.
- **A rendered video.** The Capture CLI replays the flow in Chrome with Playwright and FFmpeg and writes an MP4, so the final cut never has to be recorded by hand again.

Setup is one script tag and one element:

```html
<script src="https://cdn.jsdelivr.net/npm/screenreel@0.4.0/dist/projector/screenreel.js" defer></script>
<screenreel-projector project-id="my-app" flow-src="/demos/my-demo.json"></screenreel-projector>
```

## Keeping demos working

The point of keeping the demo in the repository is that it can break loudly instead of quietly. Validation catches a selector that no longer matches, and `flow doctor` repairs safe selector changes before a customer sees the break. It can run in CI like any other test.

## No platform

ScreenReel is Apache 2.0 and framework independent. It needs no backend, no account and no analytics service, and no data leaves the page unless you configure it.

The [live demo](https://alafazam.com/screenreels/) runs ScreenReel on its own landing page, and the source is [on GitHub](https://github.com/Alafazam/screenreels).

*Updated for v0.4.0: the setup snippet, playback modes and flow doctor arrived after the first release.*
