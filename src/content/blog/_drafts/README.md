# Blog drafts

Files here are **not published**. The local Vite development server shows them in a clearly labeled “Draft outlines” section at `/blog`, with individual `/blog/drafts/<slug>` preview pages. Production builds omit the draft content and links. Run `pnpm exec vite --host 127.0.0.1 --port 8080` to review them locally; `pnpm build:preview` followed by `node --test tests/blog-drafts.test.mjs` verifies that production output excludes the draft copy.

**To publish a draft:** finish the copy, set a real `date:`, remove the `draft:` line, and move the file up one level into `src/content/blog/`.

Each draft below is an outline, not a finished essay — a thesis, a target reader, section beats, the specific evidence to pull in, and a **Bar check** section (intended non-obvious thesis + the rubric dimension most at risk). Structure it in your own voice, then ship.

## Staged drafts (8)

| # | File | Working title | Angle |
|---|------|---------------|-------|
| 1 | `deterministic-spine-agentic-interior.md` | Deterministic Spine, Agentic Interior | "AI-first" is a UX claim, not a runtime one |
| 2 | `stop-prompting-start-compiling.md` | Stop Prompting, Start Compiling | Load-bearing process rules belong in hooks, not prompts |
| 3 | `anyone-can-copy-a-tool.md` | Anyone Can Copy a Tool; No One Can Sustain One | AI commoditizes features → the moat bar goes up |
| 4 | `fold-dont-multiply.md` | Fold, Don't Multiply | An abstraction with one consumer is a liability |
| 5 | `store-the-decision-derive-the-rest.md` | Store the Decision, Derive the Rest | Store authored decisions; derive (and name) the rest |
| 6 | `strangler-fig-at-scale.md` | The Strangler Fig at Scale | Sequence a migration for reversibility, riskiest change last |
| 7 | `breadth-before-depth.md` | Breadth Before Depth | The AI-era design risk is depth-seduction, not errors |
| 8 | `one-brain-three-ais.md` | One Brain, Three AIs | Keep the brain in files; give each AI tool a shim |

## The Bar (gut-check before publishing)

Full scored rubric (10 dimensions) is canonical in **pm-brain: `meta/writing-rubric.md`**. The at-a-glance version:

**One-question test:** *Would Shreyas Doshi quote-tweet this, AND would Gergely Orosz link it in The Pragmatic Engineer?* If it isn't a clear yes on at least one and not-embarrassing on the other — keep editing.

**Instant-fail flags (any one → rethink the angle, don't polish):**
- The thesis is consensus — the reader agreed before reading.
- The advice could have been written *without* the specific work behind it.
- All hype, no mechanism.
- No stated tradeoff and no "where this breaks."
- Corporate filler / fake strategy.

Source material for all drafts: the ms-planning-brain extraction in pm-brain at `inbox/processed/2026-07-04-ms-planning-brain-extraction.md` (Part 7 lists all 8 original pitches).
