---
title: "My Old NVIDIA GPU Was Stuck in Slow Mode on Linux. Here's the Safe Fix."
date: 2026-10-10
description: "A 2013 laptop GPU on Ubuntu 26.04, running at its slowest clocks because NVIDIA's driver no longer supports it. How I tested faster speeds without risking the machine, made them permanent with a temperature guard — and why GPU video decoding turned out to be a dead end."
tags: [linux, nvidia, nouveau, hardware]
draft: true
---

My home server is an old Lenovo Y500 laptop with a **GeForce GT 750M**, an NVIDIA graphics chip from 2013. It runs Ubuntu 26.04, and the display worked fine out of the box. What I didn't know until I looked: the GPU was running at its **slowest possible speed**, all the time, with its memory at **one-sixth** of what it's rated for.

One evening of careful testing later, it runs at full speed, with a small service that slows it down if it ever gets too hot. Along the way I went down a rabbit hole trying to make it decode video, which taught me more about the Linux graphics stack than I expected.

## TL;DR

| | |
|---|---|
| **The problem** | NVIDIA's driver dropped this generation of cards. The open-source driver (nouveau) works, but boots the GPU at its lowest clocks and never raises them. |
| **The fix** | Raise the clock level by hand, test each level for 5 minutes with an automatic revert, then make the best one permanent. |
| **The safety net** | nouveau knows the GPU's temperature limits but never slows it down. A ~90-line service now does: it steps down at 85°C and recovers below 70°C. |
| **The result** | Memory 810 → 5000 MHz, core 405 → 940 MHz, about 70% more 3D speed in a quick benchmark, peak 69°C under load. |
| **The dead end** | GPU video decoding. Two separate bugs, one in Mesa and one in the kernel, both open and unfixed. |
| **Try it** | My [GPU Test Bench](/tools/gpu-test-bench/index.html) page shows what your browser sees of your GPU, plays a test video and runs a 3D load test. |

## Why not just install NVIDIA's driver?

Because there isn't one any more. The GT 750M is a **Kepler** chip, and the last NVIDIA driver that supports Kepler is the 470 series. It stopped getting updates in 2024, isn't packaged for Ubuntu 26.04, doesn't build on the current Linux kernel, and was never able to run the Wayland-only desktop that GNOME 50 now uses. Newer NVIDIA drivers don't support Kepler at all.

That leaves **nouveau**, the open-source driver the community built by reverse-engineering NVIDIA's hardware. It's already in the kernel, and on this card it gives you OpenGL 4.3 and even Vulkan 1.2 (through the newer NVK driver). It just doesn't touch the clock speed.

## Step 1: See what you've got

Three commands tell the whole story. Install the tools with `sudo apt install mesa-utils vulkan-tools`, then:

```bash
glxinfo -B | grep -E 'renderer|Accelerated'       # is the GPU actually doing the drawing?
vulkaninfo --summary | grep deviceName            # does Vulkan see it?
sudo cat /sys/kernel/debug/dri/*/pstate           # the clock levels
```

The last one is the interesting part. On my card:

```text
07: core 405 MHz memory 810 MHz
0a: core 405-1058 MHz memory 1600 MHz
0f: core 405-1058 MHz memory 5000 MHz
AC: core 405 MHz memory 810 MHz
```

Three levels, and `AC` (the current one) is the lowest. nouveau starts every boot on level `07` and stays there.

## Step 2: Test faster levels, safely

You switch levels by writing to that same file. The catch: on some Kepler laptops a higher level can freeze the screen. So before changing anything, I set up a **timer that switches back on its own after 5 minutes**. It runs as a system service, outside the terminal, so it still fires even if the desktop locks up. (A reboot also always starts back on `07`.)

```bash
PSTATE=$(ls /sys/kernel/debug/dri/*/pstate | head -1)    # run these with: sudo -s

systemd-run --on-active=5min --unit=gpu-revert /bin/sh -c "echo 07 > $PSTATE"   # the safety net
echo 0a > $PSTATE                                                              # try the middle level
grep AC: $PSTATE                                                               # confirm it took
```

Then use the laptop normally for five minutes and keep an eye on the temperature (`watch sensors`, or the GPU Test Bench below). I went in small steps: `0a` first, then `0f` only after `0a` held up.

| Level | Core / memory | 5-minute test | Peak temperature | glxgears* |
|---|---|---|---|---|
| `07` (boot) | 405 / 810 MHz | — | 57°C idle | ~1,500 FPS |
| `0a` | 940 / 1600 MHz | ✅ stable | 55°C | ~2,450 FPS |
| `0f` | 940 / 5000 MHz | ✅ stable, under a constant 3D load | 69°C | ~2,550 FPS |

<small>* glxgears is a tiny test that barely touches memory, so it mostly shows the core-clock jump. Real apps that move textures around gain more from the memory going 810 → 5000 MHz.</small>

## Step 3: Make it permanent, with a temperature guard

Here's something I didn't expect. nouveau knows the GPU's temperature limits. They're right there in the hardware monitoring files:

| Temperature | What's supposed to happen | Does nouveau do it? |
|---|---|---|
| 90°C | Fan to full | Yes |
| 95°C | **Slow the GPU down** | **No — never implemented** |
| 105°C | Pause the GPU | No |
| 135°C | Emergency shutdown | Yes |

So between roughly 85°C and an emergency shutdown, nothing slows the card down. The chip won't destroy itself, but running hot for hours ages an old laptop. Since I was about to run it faster permanently, I wanted that missing step.

So I wrote `gpu-clock-guard`, a small service that starts at boot:

- sets the tested level (`0f` for me),
- checks the temperature every 5 seconds,
- **steps down one level at 85°C, drops to the slowest at 92°C**,
- steps back up after a minute below 70°C,
- re-applies the level after the laptop wakes from sleep (nouveau quietly resets the clocks on resume),
- and logs every change, so `journalctl -u gpu-clock-guard` shows exactly what it did and why.

If you have a Kepler card and want it too: [gpu-clock-guard](/tools/gpu-test-bench/gpu-clock-guard) and its [service file](/tools/gpu-test-bench/gpu-clock-guard.service). Read the script first; it's short.

```bash
sudo install -m 755 gpu-clock-guard /usr/local/sbin/
sudo install -m 644 gpu-clock-guard.service /etc/systemd/system/
echo 'LEVEL=0f' | sudo tee /etc/default/gpu-clock-guard      # the level that passed YOUR test
sudo systemctl enable --now gpu-clock-guard
journalctl -u gpu-clock-guard -f                             # watch it work
```

To undo: `sudo systemctl disable --now gpu-clock-guard`. Stopping it puts the GPU back on its slowest level.

<div class="story-lede">
<p class="story-lede-label">The rabbit hole</p>
<p>With the clocks sorted, I wanted one more thing: let the GPU decode video, so the CPU wouldn't have to. Kepler has a dedicated video chip for exactly that.</p>
<p class="story-lede-turn">It took the rest of the evening, and it still doesn't work. Here's why.</p>
</div>

## The dead end: GPU video decoding

The video chip needs its own small firmware, which nouveau can't ship for licensing reasons. The [standard trick](https://nouveau.freedesktop.org/VideoAcceleration.html) is to extract it from an old NVIDIA driver package. That part worked: the kernel stopped complaining about missing firmware and the video engine started up.

Then I gave it a video, and the player crashed. The kernel log told the story, in two parts:

1. **First, the 3D engine overran a buffer** (`RT_WIDTH_OVERRUN`). It turns out this is a [known Mesa bug](https://gitlab.freedesktop.org/mesa/mesa/-/issues/13611), reported on *my exact GPU*. A refactoring in Mesa 25.2 changed how image buffers are described, and the code for older NVIDIA cards was never updated. It reads the buffer's size from the wrong place, gets garbage, and the GPU's memory protection kills the app.
2. **Then the video chip itself faulted** (`MSVLD … PRIV_VIOLATION`): it tried to read memory it wasn't allowed to touch.

Bug #1 has an obvious workaround: use a Mesa from before the bug. So I compiled **only the video part of Mesa 25.1** into a folder in my home directory, leaving the desktop on the system's Mesa. (Even that needed a one-line patch, because Ubuntu 26.04's C library is newer than that Mesa.) It worked as intended: the buffer errors were gone.

The video-chip fault wasn't. Same error, same place, with both Mesa versions, which points at the **kernel** side of nouveau. There's an [open kernel bug](https://gitlab.freedesktop.org/drm/nouveau/-/issues/437) with the identical error on another Kepler card, unanswered for over a year, and the kernel code that runs the video engines hasn't changed since 2021. Nobody is maintaining it; the nouveau developers' time goes to modern cards.

So video stays on the CPU. That's fine in practice: this i7 plays 1080p H.264 without dropping a frame. But I now know exactly why, and the two bug reports have a clear data point if anyone picks them up.

## The GPU Test Bench

To see all of this without a terminal, I built a single page: the **[GPU Test Bench](/tools/gpu-test-bench/index.html)**. Open it in your browser and it will:

- play a 1080p test video and count decoded and dropped frames, and ask the browser whether it's decoding on the GPU,
- run a Mandelbrot shader as a 3D load test, with an FPS counter, for comparing clock levels,
- show what your browser actually sees of your GPU (WebGL renderer, WebGPU support).

<figure class="shot">
<img src="/images/blog/old-nvidia-gpu/test-bench-video.webp" alt="GPU Test Bench playing a 1080p test pattern video, with tiles showing Playing, 1920×1080, 30 FPS, 0 dropped frames and 'No (CPU)' for hardware decode" loading="lazy" />
<figcaption>The video section: smooth 1080p at 30 FPS with zero dropped frames — decoded by the CPU.</figcaption>
</figure>

When I run it on the laptop itself, a tiny local server adds live graphs of GPU and CPU temperature, CPU load and memory. That's how I watched the clock tests.

**Run it yourself:** [download the bench](/tools/gpu-test-bench/gpu-test-bench.zip) (2.6 MB: the page, a ~130-line Python server, the sample video), unzip it and run:

```bash
python3 serve.py      # then open http://127.0.0.1:8767
```

It needs nothing but Python 3, listens on your own machine only, and reads temperatures from `/sys` and CPU/memory from `/proc`. Nothing is sent anywhere.

<figure class="shot">
<img src="/images/blog/old-nvidia-gpu/test-bench-live-stats.webp" alt="Live system stats: GPU 69°C, CPU 76°C, CPU usage 15%, memory 45%, with small graphs, above a table showing GeForce GT 750M, nouveau, Mesa 26.0.8 and kernel 7.0" loading="lazy" />
<figcaption>Live stats while running at level 0f under load. (Only on the local version — a website can't read your machine's sensors.)</figcaption>
</figure>

## Does this apply to your card?

- **Kepler cards** — GeForce 600 and 700 series, roughly 2012–2014 (GT 640M, GT 750M, GTX 660, GTX 770…) — yes. This is the generation where nouveau's clock control works best.
- **Newer cards** are different. From the GTX 900 series on, NVIDIA locked the firmware nouveau would need to change clocks, and the newest cards (RTX 20 series and up) manage their own clocks through NVIDIA's GSP firmware.
- If your laptop also has Intel graphics with the NVIDIA chip as a second GPU, the NVIDIA one may be powered off most of the time anyway. Check with `lspci` and the `pstate` file first.

Whatever the card: **test with an automatic revert, go in small steps, and watch the temperature.** The worst case is then a frozen screen and a reboot, never a broken machine.
