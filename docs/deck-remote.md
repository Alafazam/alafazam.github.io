# Phone remote for slide decks

Any `layout: deck` post can be driven from a phone: swipe left for the next slide, right for the previous one.

## Presenting

1. Open the deck on the laptop connected to the projector.
2. Click the phone icon next to **Full screen**. A QR code appears.
3. Scan it with the phone camera. The phone opens `/remote#<session>`, and once it pairs the QR panel closes on its own.
4. Swipe on the phone, or use its Previous/Next buttons. The phone shows the slide number, the slide title and any speaker notes, and keeps its screen awake while it is connected.

Arrow keys and clickers still work on the laptop, and the phone follows along. Scan the QR code again after you reload the deck page, because each start creates a new session.

## Speaker notes

Put notes inside a slide. They are hidden on the deck and shown on the phone:

```html
<section class="slide">
  <h2>Slide title</h2>
  …
  <aside class="notes">What to say here.</aside>
</section>
```

## How it works

```
Laptop deck ──WebSocket──┐
                         ├── Cloudflare Worker "deck-relay" → one Durable Object per session
Phone remote ──WebSocket─┘     (passes each message to the other side; stores nothing)
```

- The site is static (GitHub Pages). The relay is a small Cloudflare Worker in `relay/`, on the Workers Free plan.
- Both devices make an ordinary outgoing secure WebSocket connection to Cloudflare, so it works on any network, including mobile data with the laptop on home or venue Wi-Fi.
- The Worker accepts only connections from the origins in `relay/wrangler.toml` (`ALLOWED_ORIGINS`), checks the session ID, allows at most 6 sockets per session, and forwards deck → phones and phone → deck. It also tells both sides who is connected ("presence").
- The deck uses a random 16-character session ID, carried only in the QR code.
- Keepalive: clients send `ping` every 15 s, and Cloudflare answers `pong` without waking the object. Both sides reconnect on their own after a drop or a locked screen.
- Free plan cost: incoming WebSocket messages count as 1 request per 20, against a 100,000 requests/day free limit. A one-hour talk uses a few dozen.

| File | Role |
|---|---|
| `src/remote/protocol.ts` | Message shapes, validation, session IDs, swipe rules (pure, shared with the Worker, unit tested) |
| `src/remote/relay.ts` | The only browser code that opens the relay WebSocket; reconnect and keepalive |
| `src/remote/useDeckRemoteHost.ts` | Deck side: joins the relay, pushes state, applies commands |
| `src/components/DeckRemotePanel.tsx` | QR pairing overlay on the deck |
| `src/pages/DeckRemote.tsx` | The phone page at `/remote` |
| `relay/src/rules.ts` | Worker rules: request validation, routing (pure, unit tested) |
| `relay/src/index.ts` | The Worker and the `DeckSession` Durable Object |

## Deploying the relay (one time)

```
cd relay
pnpm install
pnpm exec wrangler login    # opens the browser to sign in to Cloudflare
pnpm run deploy             # prints https://deck-relay.<account>.workers.dev
```

Put that URL in `.env.production` at the repo root as `VITE_RELAY_URL=https://deck-relay.<account>.workers.dev`, then build and deploy the site. The site build reads it; without it, the remote shows "VITE_RELAY_URL is not set".

To allow another site (or a local dev server) to connect, add its origin to `ALLOWED_ORIGINS` in `relay/wrangler.toml` and run `pnpm run deploy` again.

## Testing

- `pnpm test` runs the protocol and relay rule tests.
- End to end, locally: in `relay/`, run `pnpm exec wrangler dev --port 8787 --var ALLOWED_ORIGINS:http://localhost:4173`. Build the site with `VITE_RELAY_URL=http://localhost:8787 pnpm build:preview`, run `pnpm preview --port 4173`, open the deck and pair a second browser window.
