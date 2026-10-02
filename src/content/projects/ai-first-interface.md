---
name: AI-First Interface Strategy
tagline: The platform as an intelligent backend
category: Builds
status: Active
impact: Merchandising decisions in natural language
icon: bot
order: 2
tags: [AI, Platform, MCP]
---

Exposing the merchandising platform as an intelligent backend — an MCP + skills layer — so enterprise AI assistants can drive merchandising decisions in natural language instead of clicking through screens.

## Problem

Powerful platforms still bottleneck on the UI. Every workflow means training users on screens, and the value is gated behind knowing where to click.

## Approach

Treat the platform as a set of well-described tools (MCP servers + a skills layer) that an AI assistant can call. The interface becomes conversational; the platform's algorithms stay the source of truth.

## Outcome

Clients can ask for merchandising decisions in plain language, and the AI orchestrates the underlying platform — turning a deep feature set into something you can just talk to.

## Design principles

- **The tools carry the semantics.** An MCP tool description is now product surface. Writing what a tool is for, when to use it and what it returns is the new UX design.
- **Skills encode the workflows.** Tools are verbs; skills are the sentences: the encoded judgment of how an experienced merchandiser sequences a decision.
- **The platform stays authoritative.** The assistant never invents a number. It routes intent to algorithms that were trusted before AI arrived.

A merchandiser can ask, "rebalance next month's OTB for the stores that under-sold this range", and the assistant calls the right tools in the right order, with the platform's own optimization doing the heavy lifting.

## Why it matters

It decouples the platform's value from its screens. Clients can bring their own assistant, and years of merchandising algorithms become something you can just talk to.
