---
draft: true
title: "The platform as an intelligent backend"
date: 2026-07-05
description: "Exposing a merchandising platform as MCP tools plus a skills layer, so enterprise AI assistants drive it in natural language instead of clicks."
tags: [ai, platform, mcp]
---

Powerful platforms still bottleneck on the UI. Every workflow means training users on screens; the value of a deep feature set is gated behind knowing where to click. For a merchandising platform with years of algorithms inside it, that's an absurd tax.

So the bet I'm making: treat the platform as an **intelligent backend**. Expose it as a set of well-described tools — MCP servers plus a skills layer — that an enterprise AI assistant can call. The interface becomes conversational; the platform's algorithms stay the source of truth.

## What changes

A merchandiser asks for what they want in plain language — "rebalance next month's OTB for the stores that under-sold this range" — and the assistant orchestrates the underlying platform: the right tools, in the right order, with the platform's own optimization doing the heavy lifting.

Three design principles have mattered most:

- **The tools carry the semantics.** An MCP tool description is product surface now. Writing "what this tool is for, when to use it, what it returns" well is the new UX design.
- **Skills encode the workflows.** Individual tools are verbs; skills are the sentences — the encoded judgment of how an experienced merchandiser sequences a decision.
- **The platform stays authoritative.** The assistant never invents a number. It routes intent to algorithms that were already trusted before AI arrived.

The strategic effect is bigger than convenience: it decouples the platform's value from its screens. Clients can bring their own assistant, and the deep feature set becomes something you can just *talk to*.

More detail in [my work section](/projects/ai-first-interface). This one is early — expect follow-ups as real client workflows land.
