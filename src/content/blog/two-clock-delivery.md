---
draft: true
title: "Two clocks: continuous merge, monthly releases"
date: 2026-02-08
description: "Decoupling how fast engineers merge from how often clients see change — feature flags as a release-management tool, not an engineering toy."
tags: [delivery, feature-flags, release-management]
---

Most delivery pain comes from running engineering and clients on the same clock. When merge and release are the same event, pods block each other waiting for a release train, half-finished work sits in long-lived branches, and rollbacks are terrifying because everything is entangled.

The fix we landed on: run **two clocks at different speeds**.

## The fast clock and the slow clock

Engineers merge continuously behind feature flags — that's the fast clock. Nothing waits for a train; work integrates the day it's ready. Clients receive controlled, predictable monthly releases — that's the slow clock. Flags decide what's on, for whom, and when.

What this bought us:

- **Pods stopped blocking each other.** No more "we can't merge until the release cuts."
- **Rollbacks became flag flips instead of reverts.** A bad feature turns off in seconds; the code stays merged.
- **Clients got a stable rhythm.** Enterprise customers don't want surprises; they want a predictable cadence they can plan training and change management around.

The subtle part is cultural, not technical: feature flags have to be owned as a *product* tool. Which flag turns on for which client, in which release, is a product decision — the flag system is really a client-communication system wearing an engineering costume.

I've written up the operating details in [my work section](/projects/two-clock-delivery). If you're fighting release-train gridlock, start by separating the two clocks — everything else follows.
