---
title: "My Old Laptop Felt Sluggish. Its GPU Was Stuck in Slow Mode."
date: 2026-10-10
description: "An evening of tinkering with a 2013 NVIDIA GPU on Linux, together with Claude Opus 5.5: finding out it ran at its slowest speed, testing faster speeds one careful step at a time, and a side quest that ended in an open bug."
tags: [linux, nvidia, ai, hardware]
draft: true
---

I've been using my old Lenovo Y500 again. It's a 2013 laptop with an NVIDIA GeForce GT 750M, now running Ubuntu, and it does its job. But it felt a bit sluggish, so one evening I went looking for the reason. First question: is the GPU even working properly?

It was working. It just wasn't working very hard. The graphics card was running at its **slowest possible speed**, all the time, with its memory at **one-sixth** of what it's rated for.

NVIDIA stopped supporting this generation of cards years ago, so Linux uses the open-source driver, called nouveau. It's good, but it starts the card at its lowest clock level and never raises it.

Then the developer in me spoke up. I had Claude Opus 5.5 running right there on that laptop, able to read logs and run commands. So why not tinker with it properly, and test as we go?

## Three levels, one step at a time

The driver lists three clock levels for this card:

| Level | Core | Memory |
|---|---|---|
| `07` (what it boots with) | 405 MHz | 810 MHz |
| `0a` | up to 1058 MHz | 1600 MHz |
| `0f` | up to 1058 MHz | 5000 MHz |

The obvious move is to jump straight to the top. The smart one is to go up one level at a time, because on some laptops of this era a higher level can freeze the whole screen.

So before changing anything, we put the guards in place:

- **An automatic revert.** Every test armed a timer that put the card back on its slowest level after 5 minutes. It ran as a system service, outside the terminal, so it would still fire even if the desktop locked up.
- **A temperature cut-off.** If the GPU reached 85°C during a test, it dropped back straight away instead of waiting out the timer.
- **A reboot as the last resort.** The card always starts on the slow level, so the worst case was a frozen screen and a restart, never a broken laptop.

With that in place, the first test was the middle level, `0a`. It ran for five minutes while I kept using the laptop: stable, never above 55°C, and about 60% faster in a quick 3D benchmark. Then the timer switched it back, exactly as planned.

## Two tracks

While the clock tests ran, we started a second track. Kepler cards like this one have a dedicated chip for decoding video. If it worked, the CPU wouldn't have to do that job.

That track ended in a dead end. The video chip needs a small piece of firmware, which loaded fine, but every attempt to decode a video crashed the player. Reading the kernel logs led us to an [open Mesa bug](https://gitlab.freedesktop.org/mesa/mesa/-/issues/13611), reported on this exact GPU, plus a [second one in the kernel driver](https://gitlab.freedesktop.org/drm/nouveau/-/issues/437). Neither has a fix yet. So we removed the firmware, and video stays on the CPU, which handles 1080p without dropping a frame anyway.

Knowing *why* something doesn't work, with a bug link to watch, is a perfectly good outcome for an evening.

## Back to the clock speed, with something to watch

For the top level, I wanted to *see* what was happening rather than read numbers in a terminal. So we built a small page, the **[GPU Test Bench](/tools/gpu-test-bench/index.html)**. It plays a 1080p test video and counts dropped frames, runs a 3D load test with an FPS counter, and, when run on the laptop itself, shows live graphs of GPU and CPU temperature.

<figure class="shot">
<img src="/images/blog/old-nvidia-gpu/test-bench-video.webp" alt="GPU Test Bench playing a 1080p test pattern video, with tiles showing Playing, 1920×1080, 30 FPS, 0 dropped frames and 'No (CPU)' for hardware decode" loading="lazy" />
<figcaption>Smooth 1080p at 30 FPS, zero dropped frames — decoded by the CPU, since the video chip is out of the picture.</figcaption>
</figure>

Then the real test: level `0f`, with memory at 5000 MHz, for five minutes with the 3D load running the whole time. It held steady and peaked at **69°C**, well under the cut-off.

<figure class="shot">
<img src="/images/blog/old-nvidia-gpu/test-bench-live-stats.webp" alt="Live system stats: GPU 69°C, CPU 76°C, CPU usage 15%, memory 45%, with small graphs, above a table showing GeForce GT 750M, nouveau, Mesa 26.0.8 and kernel 7.0" loading="lazy" />
<figcaption>Live stats at level 0f under load: the GPU settles in the high 60s.</figcaption>
</figure>

| Level | 5-minute test | Peak temperature |
|---|---|---|
| `07` (boot) | — | 57°C idle |
| `0a` | ✅ stable | 55°C |
| `0f` | ✅ stable, under constant 3D load | 69°C |

## Making it stick, safely

One last surprise: the driver *knows* the GPU's temperature limits, but it never slows the card down when it gets hot. Between roughly 85°C and an emergency shutdown at 135°C, nothing happens.

So the guard from the tests became permanent. A small service now starts at boot and puts the card on `0f`. It checks the temperature every five seconds, steps down at 85°C, drops to the slowest level at 92°C, and climbs back up once things cool below 70°C. Every change is written to the system log, so I can always see what it did and why.

On a normal day it does nothing at all. That's the point.

## What I liked about this

None of it was clever. The whole evening was small steps, each with a way back: test one level, watch it, let it revert, then decide on the next one. It's the same way you'd roll out a risky change at work, applied to a 13-year-old laptop.

Having an AI pair that could read kernel logs, dig through bug trackers and write the safety nets *before* we touched anything made that easy to stick to.

## Try it yourself

- **[Open the GPU Test Bench](/tools/gpu-test-bench/index.html)** to see what your browser knows about your GPU, play the test video and run the 3D load test.
- **[Download it](/tools/gpu-test-bench/gpu-test-bench.zip)** (2.6 MB) to get the live temperature graphs on your own machine: unzip, run `python3 serve.py`, and open `http://127.0.0.1:8767`. It needs only Python 3 and never leaves your computer.
- Got a Kepler-era NVIDIA card (GeForce 600 or 700 series) on nouveau? The [temperature guard script](/tools/gpu-test-bench/gpu-clock-guard) and its [service file](/tools/gpu-test-bench/gpu-clock-guard.service) are there too. Read them first, and test your own levels with a revert in place before making anything permanent.
