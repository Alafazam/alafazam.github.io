---
title: "GAN thinking: an adversarial loop for product decisions"
date: 2026-03-29
description: "Borrowing the generator–discriminator loop from GANs to stress-test product ideas before they ship — and kill the weak ones early."
tags: [product-thinking, methodology, decision-making]
---

Most product decisions don't die from bad execution. They die from unexamined assumptions — the things everyone in the room silently agreed were true and nobody attacked.

Borrowing from generative adversarial networks, I made the attack an explicit, structured step. I call it **GAN Thinking Mode**, and I run it as a working system in Notion.

## The loop

1. **Generator** — draft the idea: the bet, the plan, what we expect to happen.
2. **Discriminator** — attack it, on purpose and in writing: where does this break? What would have to be true for it to work? Who loses if it succeeds?
3. **Iterate** — only ideas that survive the adversarial loop graduate to a spec.

The discipline is in step two. It's not "devil's advocate" theater in a meeting — it's a written artifact with the same effort budget as the proposal itself. When the critique is structured and mandatory, weak ideas fail cheaply on paper instead of expensively in production.

A few things I've learned running this:

- The generator and discriminator should ideally be **different people** — but even solo, forcing yourself to switch roles in writing catches most of the load-bearing assumptions.
- The best discriminator prompts are boring: *what breaks at 10× scale? what does Sales promise that this doesn't do? what's the migration story?*
- Surviving the loop is a signal the team can rally behind. "This got attacked and lived" builds more conviction than any pitch deck.

The framework write-up lives in [my work section](/projects/gan-thinking-mode). Steal the loop — it costs a document and saves a quarter.
