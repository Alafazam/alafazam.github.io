---
title: "The Era of Personal Software Is Here"
date: 2026-10-20
description: "I used Claude to take my TV's home screen apart and rebuild it for my family: no ads, our apps in one row, our photos and the day's prayer times. What changed, how to do it yourself, and the supply-chain risk that comes with it."
tags: [ai, personal-software, android-tv, open-source, security]
---

<!--
Layout pieces (.ps-*) are styled in src/index.css. The before/after slider ([data-compare]) and the copy
button ([data-copy]) are wired up by MarkdownContent. Screenshots live in
public/images/blog/personal-software-tv/ and are taken from the TV itself. The page's only h1 is the post title.
-->

<p class="ps-dek">I used Claude to take my TV's home screen apart and rebuild it for my family: no ads, our apps in one row, photos we chose, and the day's prayer times. This is what changed, how you can do the same, and the risk that comes with it.</p>

<figure class="ps-stage not-prose">
<div class="ps-compare" data-compare>
<img src="/images/blog/personal-software-tv/prayer-home.jpg" alt="After: a mosque photo as wallpaper, the next prayer time in a gold pill under the clock, and eight apps in one row" width="1280" height="720" />
<div class="ps-compare-before"><img src="/images/blog/personal-software-tv/before-stock-home.jpg" alt="Before: the stock Google TV home with a sponsored Hero ad, a Sponsored by JioHotstar row and a PatchWall tile" width="1280" height="720" /></div>
<div class="ps-compare-divider" aria-hidden="true"></div>
<input type="range" min="0" max="100" value="50" aria-label="Drag to compare the TV home screen before and after" />
<div class="ps-compare-knob" aria-hidden="true">⟷</div>
<span class="ps-compare-tag ps-left">Before</span>
<span class="ps-compare-tag ps-right">After</span>
</div>
<figcaption>My Xiaomi MiTV-AXSO2 (Android TV 9). Drag across the screen to compare. Both are screenshots taken from the TV.</figcaption>
</figure>

My TV opened with an advert. Before I could get to Netflix, there was a sponsored banner for a motorbike, a row "Sponsored by JioHotstar", and a Xiaomi home screen I never asked for. The TV is a small Android computer, and like most computers it does what its maker wants first.

So I opened Claude Code on my laptop and asked it to help me take back the home screen. It found the TV on my Wi-Fi, made a backup, and switched off the parts I didn't want. Then we built the parts I did want. It took one evening and one morning, and I wrote almost none of the code myself.

<p class="ps-eyebrow">What we changed, in order</p>

## From a billboard to our TV

<ol class="ps-steps not-prose">
<li><h3>Found the TV and backed it up</h3><p>With USB debugging on, the TV accepts commands over Wi-Fi. Claude found it, saved the list of apps and every setting, and wrote a restore script before touching anything.</p></li>
<li><h3>Switched off 33 apps</h3><p>Tracking, sponsored rows, Xiaomi's PatchWall, partner auto-installs and apps nobody used. They are disabled, not deleted: one command brings them all back.</p></li>
<li><h3>Replaced the home screen</h3><p>The open-source <a href="https://github.com/Gathin23/cleanyourtv">cleanyourtv</a> launcher, set up with our eight apps in one row. Inputs, Wi-Fi and Settings stay one press away.</p></li>
<li><h3>Added wallpapers that change</h3><p>A folder of photos changes behind Home every 30 minutes. A Wallpaper tile opens a picker, so anyone can choose one with the remote.</p></li>
<li><h3>Added prayer times</h3><p>Calculated on the TV, with no internet: Bengaluru, Karachi method, Hanafi Asr, plus the Hijri date. The current and next prayer sit under the clock, a tile opens the full day, and the screensaver shows it over the photos.</p></li>
</ol>

<div class="ps-stats not-prose">
<div class="ps-stat"><b>33</b><span>apps switched off, all reversible</span></div>
<div class="ps-stat"><b>550 → 850</b><span>MB of free memory</span></div>
<div class="ps-stat"><b>0</b><span>sponsored rows or adverts</span></div>
</div>

<div class="ps-gallery not-prose">
<figure><img src="/images/blog/personal-software-tv/picker.jpg" alt="Wallpaper picker with twelve mosque photos, the current one marked Now" width="1280" height="720" loading="lazy" /><figcaption>The Wallpaper picker. The photos are free ones from Unsplash.</figcaption></figure>
<figure><img src="/images/blog/personal-software-tv/prayer-page.jpg" alt="Prayer Times page with six cards from Fajr to Isha, Dhuhr highlighted in green" width="1280" height="720" loading="lazy" /><figcaption>The Prayer Times page, opened from its own tile.</figcaption></figure>
<figure><img src="/images/blog/personal-software-tv/prayer-screensaver.jpg" alt="Screensaver with the clock and six prayer cards over a photo of minarets at sunset" width="1280" height="720" loading="lazy" /><figcaption>The screensaver: clock, prayer times and our photos.</figcaption></figure>
<figure><img src="/images/blog/personal-software-tv/tile.jpg" alt="The app grid under the dock with the Wallpaper tile at the end" width="1280" height="720" loading="lazy" /><figcaption>The rest of the apps, with the Wallpaper tile at the end.</figcaption></figure>
</div>

<p class="ps-eyebrow">Why this matters</p>

## Software for an audience of one

For most of my life, software was something you bought. If a product did something you didn't like, you lived with it, complained, or switched brands. Changing it meant being a developer with a free weekend.

That has changed. I didn't need to know how Android launchers work, or which of 124 packages on my TV were safe to switch off. Claude read the TV's logs, ran the commands, built the app, installed it, and checked every step with a screenshot from the TV. My job was to decide: keep the voice remote, keep casting, show these eight apps, use these photos, calculate prayer times the way my family prays.

I think this is what personal software means. You can open almost anything you own, keep the parts you like, and replace the rest with something made only for you. Nobody would sell a launcher with Hanafi Asr times for Bengaluru on the screensaver. Now nobody has to.

<p class="ps-eyebrow">Do it yourself</p>

## All you need is this

You need an Android TV or Google TV, a computer on the same Wi-Fi, and [Claude Code](https://claude.com/claude-code).

<ol class="ps-steps not-prose">
<li><h3>Turn on USB debugging on the TV</h3><p>Settings → Device Preferences → About → press OK on <b>Build</b> seven times. Go back to Developer options and turn on <b>USB debugging</b>.</p></li>
<li><h3>Open Claude Code in an empty folder</h3><p>On your computer, on the same Wi-Fi as the TV.</p></li>
<li><h3>Paste the prompt below, with your TV model</h3><p>Claude asks before it changes anything you might use.</p></li>
<li><h3>Accept "Allow USB debugging?" on the TV</h3><p>Tick "Always allow from this computer", then answer Claude's questions about your apps.</p></li>
<li><h3>Turn USB debugging off when you're done</h3><p>The new home screen keeps working without it.</p></li>
</ol>

<div class="ps-prompt not-prose">
<button type="button" class="ps-copy" data-copy="ps-prompt-text">Copy</button>
<pre id="ps-prompt-text">My TV model is: &lt;YOUR TV MODEL&gt;. It is on my Wi-Fi with USB debugging on.
Find it over ADB, back up its app list and settings, and write a restore script first.
List the installed apps, and ask me before you switch off anything I might use.
Disable the maker's tracking, sponsored rows and preinstalled apps I don't want:
only disable, never uninstall system apps.
Then build me a small, simple home screen with my favourite apps in one row,
and check every change with a screenshot from the TV.</pre>
</div>

You don't have to copy anyone's launcher: Claude can build one from scratch with exactly the settings you want. Starting from [cleanyourtv](https://github.com/Gathin23/cleanyourtv) and its [full prompt](https://github.com/Gathin23/cleanyourtv/blob/main/PROMPT.md) gets you more for free: bug fixes, translations, and app lists that other people have tested on 66 TV models.

<p class="ps-eyebrow">Everyone is doing this</p>

## 763 forks in three days

The cleanyourtv repo went up on 17 October 2026. Three days later it had about 6,400 stars and 763 forks. When I looked through the forks, 92 of them had changed the launcher in their own way:

<ul class="ps-forks not-prose">
<li><a href="https://github.com/manojm321/jain-tv-launcher">manojm321/jain-tv-launcher</a><span>A Jain calendar on the home screen, calculated offline</span></li>
<li><a href="https://github.com/majnioui/CleanXiaomiTV">majnioui/CleanXiaomiTV</a><span>A Prayer Times screen with the Hijri date, the idea behind mine</span></li>
<li><a href="https://github.com/gpokhark/cleanyourtv">gpokhark/cleanyourtv</a><span>A "Last on YouTube" row of recently watched videos</span></li>
<li><a href="https://github.com/wevbert/cleanyourtv">wevbert/cleanyourtv</a><span>A Netflix data limiter and a PlayStation tile</span></li>
<li><a href="https://github.com/briansilah/tv-vibehack">briansilah/tv-vibehack</a><span>A frosted "liquid glass" dock with cover art</span></li>
<li><a href="https://github.com/amineio/google-tv-apps">amineio/google-tv-apps</a><span>A bedtime clock with viewing limits for kids</span></li>
</ul>

Each one is somebody's TV, made for their house. That is the part I find exciting.

<p class="ps-eyebrow">The catch</p>

## The same superpower works for attackers

AI made it cheap to fork a project, change it and send the change back. That is why one small repo has hundreds of forks and a steady stream of contributions. It also makes the supply chain wider than anyone can read.

The home screen is the first app your TV runs, every time. Mine can read the photos folder and knows which Wi-Fi it's on. If someone slips harmful code into a popular repo, everyone who pulls the latest version and installs it puts that code on their TV. I merged 83 commits from the original repo without reading every line before I stopped to think about this.

<div class="ps-risk not-prose">
<h3>What I do now</h3>
<ul>
<li><b>Build from my own fork.</b> Nothing updates on its own; the TV only changes when I build and install.</li>
<li><b>Don't sync blindly.</b> If I want something new from the original, I read that change, or ask Claude to review it, and copy only that part.</li>
<li><b>Check permissions.</b> My launcher has no internet permission, so it can't send data out by itself.</li>
<li><b>Keep changes small.</b> A focused change is easy to read; a big merge is not.</li>
<li><b>Close the door afterwards.</b> USB debugging goes off when I'm done.</li>
</ul>
</div>

<p class="ps-eyebrow">Credits</p>

## Built on other people's work

The launcher, the prompt and the tools come from [cleanyourtv](https://github.com/Gathin23/cleanyourtv) by Gathin (MIT licence). The prayer-times screen was inspired by [CleanXiaomiTV](https://github.com/majnioui/CleanXiaomiTV) by majnioui. The wallpapers are free photos from [Unsplash](https://unsplash.com); the photographers are listed in my fork's notes.

My changes are open source at [github.com/Alafazam/cleanyourtv](https://github.com/Alafazam/cleanyourtv). I sent back what fit the original: my TV's app list, a [showcase entry](https://github.com/Gathin23/cleanyourtv/pull/204) (merged) and a [bug report](https://github.com/Gathin23/cleanyourtv/issues/207).
