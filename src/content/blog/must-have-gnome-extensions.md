---
title: "15 Must-Have GNOME Extensions for Anyone Switching to Linux"
date: 2026-10-06
description: "Moving to Ubuntu, Fedora or any GNOME-based distro? These 15 extensions fill the gaps on day one — with a bias toward making Linux feel like a Mac."
tags: [linux, gnome, productivity, macos]
---

Switching to a GNOME-based distro — Ubuntu, Fedora, Pop!_OS, Debian — from Windows or macOS? Stock GNOME is clean and fast, but within an hour you'll reach for something that isn't there: a clipboard history, snap layouts, a hot corner that shows your windows, dark mode that follows the sun.

These 15 extensions fill those gaps. The list leans toward a **Mac-like feel**, because I use a Mac at work and wanted my Linux machine to work the same way. I could have installed Zorin OS, which ships a Mac-style layout out of the box, but I went with Ubuntu for its faster updates and much bigger community. A handful of extensions closes the gap anyway.

<div class="story-lede">
<p class="story-lede-label">Before the list: try Handy</p>
<p>If you install one app (not an extension) on Linux, make it <a href="https://github.com/cjpais/handy">Handy</a> — free, open-source voice-to-text that runs entirely offline. Press a shortcut, talk, and the text lands in whatever app you're typing in.</p>
<p class="story-lede-turn">This whole post was dictated with Handy.</p>
</div>

## TL;DR

| # | Extension | What it does |
|---|---|---|
| 1 | [User Themes](https://extensions.gnome.org/extension/19/user-themes/) | Load a custom shell theme (e.g. a macOS look) |
| 2 | [Logo Menu](https://extensions.gnome.org/extension/4451/logo-menu/) | Apple-style menu in the top-left corner |
| 3 | [Transparent Top Bar](https://extensions.gnome.org/extension/1708/transparent-top-bar/) | See-through top bar until a window touches it |
| 4 | [Notification Banner Position](https://extensions.gnome.org/extension/4105/notification-banner-position/) | Notifications in the top-right, like macOS |
| 5 | [Night Theme Switcher](https://extensions.gnome.org/extension/2236/night-theme-switcher/) | Light by day, dark by night, automatically |
| 6 | [Tiling Shell](https://extensions.gnome.org/extension/7065/tiling-shell/) | Snap layouts, like Rectangle or Magnet |
| 7 | [AATWS](https://extensions.gnome.org/extension/4412/advanced-alttab-window-switcher/) | A far better Alt+Tab, with search |
| 8 | [Custom Hot Corners – Extended](https://extensions.gnome.org/extension/4167/custom-hot-corners-extended/) | Any action on any screen corner |
| 9 | [Space Bar](https://extensions.gnome.org/extension/5090/space-bar/) | Named workspaces in the top bar |
| 10 | [Clipboard Indicator](https://extensions.gnome.org/extension/779/clipboard-indicator/) | Clipboard history, like Maccy |
| 11 | [Caffeine](https://extensions.gnome.org/extension/517/caffeine/) | Keep the screen awake on demand |
| 12 | [Vitals](https://extensions.gnome.org/extension/1460/vitals/) | CPU, temperature and RAM in the top bar |
| 13 | [SSH Search Provider Reborn](https://extensions.gnome.org/extension/1714/ssh-search-provider-reborn/) | Type a host name, land in an SSH session |
| 14 | [GSConnect](https://extensions.gnome.org/extension/1319/gsconnect/) | Phone ↔ PC: clipboard, files, notifications |
| 15 | [Just Perfection](https://extensions.gnome.org/extension/3843/just-perfection/) | Tweak the shell and speed up animations |

## How to install them

Install **Extension Manager**, search for the name, click Install. On Ubuntu it's `sudo apt install gnome-shell-extension-manager`; on Fedora and everywhere else, get it from Flathub (`flatpak install flathub com.mattjakeman.ExtensionManager`). Each name above also links to its page on [extensions.gnome.org](https://extensions.gnome.org).

## Make it look and behave like macOS

**1. [User Themes](https://extensions.gnome.org/extension/19/user-themes/)** — lets GNOME Shell load a custom theme. Pair it with the [WhiteSur](https://github.com/vinceliuice/WhiteSur-gtk-theme) macOS theme for the top bar, menus and app windows. On older hardware, pick the solid (non-transparent) variant.

**2. [Logo Menu](https://extensions.gnome.org/extension/4451/logo-menu/)** — an Apple-style menu in the top-left corner: About My System, Terminal, Force Quit App, Sleep, Restart, Log Out. Muscle memory, restored.

<figure class="shot">
<img src="/images/blog/gnome-extensions/logo-menu.webp" alt="Logo Menu open from the top-left corner, showing About My System, Terminal, Force Quit App and Log Out" loading="lazy" />
<figcaption>Logo Menu. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>

**3. [Transparent Top Bar](https://extensions.gnome.org/extension/1708/transparent-top-bar/)** — the top bar is see-through on an empty desktop and turns solid the moment a window touches it, just like the macOS menu bar. It's a plain tint, not blur, so it costs almost nothing.

**4. [Notification Banner Position](https://extensions.gnome.org/extension/4105/notification-banner-position/)** — GNOME shows notifications at the top-center; this moves them to the top-right, where Mac eyes look for them. Hide its extra top-bar icon in the settings.

<figure class="shot">
<img src="/images/blog/gnome-extensions/notification-banner-position.webp" alt="A notification banner in the top-right corner with the position menu open" loading="lazy" />
<figcaption>Notification Banner Position. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>

**5. [Night Theme Switcher](https://extensions.gnome.org/extension/2236/night-theme-switcher/)** — the equivalent of macOS "Auto" appearance: light theme at sunrise, dark at sunset. It can also run your own commands at each switch, so third-party themes like WhiteSur flip too.

<figure class="shot">
<img src="/images/blog/gnome-extensions/night-theme-switcher.webp" alt="Night Theme Switcher settings with Day and Night tabs, accent color and background" loading="lazy" />
<figcaption>Night Theme Switcher. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>

## Windows and workspaces

**6. [Tiling Shell](https://extensions.gnome.org/extension/7065/tiling-shell/)** — Rectangle/Magnet-style snap layouts: drag a window and drop it into a zone, or build your own layouts. Two gotchas on Ubuntu: turn off the built-in Tiling Assistant (the two fight over edge snapping), and turn off Tiling Shell's own Alt+Tab override, or it clashes with the next extension.

<figure class="shot">
<img src="/images/blog/gnome-extensions/tiling-shell.webp" alt="Tiling Shell features: tiling system, snap assistant, layout editor and multiple layouts" loading="lazy" />
<figcaption>Tiling Shell. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>

**7. [AATWS — Advanced Alt-Tab Window Switcher](https://extensions.gnome.org/extension/4412/advanced-alttab-window-switcher/)** — a much better Alt+Tab: type to filter, group by app, preview windows. It can also be triggered from a hot corner (see the next one).

<figure class="shot">
<img src="/images/blog/gnome-extensions/aatws.webp" alt="AATWS switcher showing window thumbnails with a search field" loading="lazy" />
<figcaption>AATWS. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>

**8. [Custom Hot Corners — Extended](https://extensions.gnome.org/extension/4167/custom-hot-corners-extended/)** — put any action on any corner. Mine: top-left opens the overview, top-right opens the AATWS switcher grouped by app. That top-right corner is the closest thing to Mission Control I've found.

<figure class="shot">
<img src="/images/blog/gnome-extensions/custom-hot-corners.webp" alt="Custom Hot Corners Extended settings listing actions per corner" loading="lazy" />
<figcaption>Custom Hot Corners – Extended. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>

**9. [Space Bar](https://extensions.gnome.org/extension/5090/space-bar/)** — replaces the "Activities" button with your workspaces, by name. Right-click to rename. "Mail · Code · Docs" beats remembering which number is which.

<figure class="shot">
<img src="/images/blog/gnome-extensions/space-bar.webp" alt="Space Bar showing named workspaces Main and Dev in the top bar, with its settings" loading="lazy" />
<figcaption>Space Bar. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>

## Small utilities you'll miss within an hour

**10. [Clipboard Indicator](https://extensions.gnome.org/extension/779/clipboard-indicator/)** — the Maccy replacement. Set a shortcut (I use Ctrl+Shift+H), turn on "open at cursor" and "paste on select", and the history pops up at the mouse and pastes straight into the app.

<figure class="shot">
<img src="/images/blog/gnome-extensions/clipboard-indicator.webp" alt="Clipboard Indicator menu with search, clipboard history and private mode" loading="lazy" />
<figcaption>Clipboard Indicator. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>

**11. [Caffeine](https://extensions.gnome.org/extension/517/caffeine/)** — Amphetamine for Linux. A Quick Settings toggle that stops the screen from sleeping during long reads, downloads or presentations.

**12. [Vitals](https://extensions.gnome.org/extension/1460/vitals/)** — CPU, temperature, RAM and network speed in the top bar. Pick only the two or three numbers you care about.

<figure class="shot">
<img src="/images/blog/gnome-extensions/vitals.webp" alt="Vitals readings for CPU and memory in the top bar" loading="lazy" />
<figcaption>Vitals. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>

**13. [SSH Search Provider Reborn](https://extensions.gnome.org/extension/1714/ssh-search-provider-reborn/)** — press Super, type a host from `~/.ssh/config`, hit Enter, and a terminal opens already connected. Spotlight for servers.

<figure class="shot">
<img src="/images/blog/gnome-extensions/ssh-search-provider.webp" alt="GNOME search results listing SSH hosts" loading="lazy" />
<figcaption>SSH Search Provider Reborn. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>

**14. [GSConnect](https://extensions.gnome.org/extension/1319/gsconnect/)** — the closest thing to Apple's Continuity for an Android phone: shared clipboard, phone notifications on the desktop, files both ways, even replying to SMS. Pair it with the KDE Connect app on the phone.

<figure class="shot">
<img src="/images/blog/gnome-extensions/gsconnect.webp" alt="GSConnect windows showing a paired phone, notifications and file sharing" loading="lazy" />
<figcaption>GSConnect. Screenshot from its extensions.gnome.org page.</figcaption>
</figure>

## Speed

**15. [Just Perfection](https://extensions.gnome.org/extension/3843/just-perfection/)** — dozens of shell tweaks (hide or show any top-bar element, and more), but the one I'd install it for is animation speed. Set it to "faster" and the whole desktop feels snappier, without anything looking rushed.

## What I left out, on purpose

- **Blur effects.** Beautiful, and expensive — on older or integrated GPUs they cost frames. A solid theme plus a tinted top bar looks nearly as good.
- **A dock extension.** Ubuntu already ships Ubuntu Dock; move it to the bottom and set it to auto-hide in Settings. On Fedora and other distros without a dock, add [Dash to Dock](https://extensions.gnome.org/extension/307/dash-to-dock/).
- **Anything you wouldn't notice was gone.** Every extension is one more thing that can break on the next GNOME release. If you can't name the habit an extension serves, skip it.

Start with the TL;DR table, install the five that match your oldest habits, and add the rest when you miss them.
