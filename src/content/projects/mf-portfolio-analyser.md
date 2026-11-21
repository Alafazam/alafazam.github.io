---
name: MF Portfolio Analyser
tagline: Which of your mutual funds earn their place?
category: Builds
status: Active
impact: Open source Claude Code plugin
icon: chart
order: 0
link: https://alafazam.com/mf-portfolio-analyser/
tags: [Personal finance, Claude Code, India]
---

A free, open-source Claude Code plugin that reviews a whole Indian mutual fund portfolio from your CAS statement: every fund against its benchmark and against every other fund in its category, duplicates, and a year-by-year plan for switches that keeps the gains inside the ₹1.25L tax-free room. It runs on your computer, and Claude never sees the statement.

**Educational sample, not advice.** I built it to review my own portfolio and am sharing it as an example. It is not investment, tax or legal advice, and I'm not a SEBI-registered adviser.

## Why I built it

Fund pages tell you how one fund did. The questions I actually had were about the whole set: which funds lag their index, which ones overlap, where the money should go instead, and what moving it costs in tax. Answering that by hand meant spreadsheets, NAV downloads and a lot of date arithmetic on purchase lots. So I wrote the rules down and turned them into a tool.

## What it does

- **Scorecard:** each fund against its category index over 3 years, for its direct and regular plan, plotted on a return-vs-volatility 2×2
- **Whole-market screen:** every open-ended direct-growth fund in your categories from AMFI's list, scored 0–100 within its category
- **Consolidation plan:** one fund per job, with a case-for-change score and break-even time for every move, and the index fund always an option
- **Tax calendar on real purchase lots:** oldest units first, only long-term and unlocked lots, within each year's ₹1.25L room after gains already booked
- **SIP review, falls and recoveries, peer check,** and one offline HTML report

## Privacy by design

The statement holds your name, PAN, address and phone number, so only a local script reads it. It writes a redacted summary, deletes the raw text even when a run fails, keeps every file owner-only, and never puts the PDF password on a command line. The report it produces makes no network requests.

## Rules, not a model

Every score, flag and plan rule is written down and versioned, and the plugin ships with a sample report on a made-up investor holding real funds. It went through an adversarial review round before release, and that review, with what was done about each finding, is in the repo's spec.

[Open the sample report](https://alafazam.com/mf-portfolio-analyser/sample-report.html) · [Source on GitHub](https://github.com/Alafazam/mf-portfolio-analyser)
