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

- The site is static (GitHub Pages), so there is no backend of our own. [PeerJS](https://peerjs.com) opens a WebRTC data channel straight between the laptop and the phone.
- The free PeerJS cloud server (`0.peerjs.com`) is used only for the handshake. Slide commands travel peer to peer, encrypted (DTLS).
- The deck registers as `alafazam-deck-<16 random chars>`. Only someone holding that session ID, which is in the QR code, can drive it.
- PeerJS and the QR library load only when the remote is started, so pages that don't use it don't download them.

| File | Role |
|---|---|
| `src/remote/protocol.ts` | Message shapes, validation, session IDs, swipe rules (pure, unit tested) |
| `src/remote/peer.ts` | The only place that creates PeerJS peers; signalling config |
| `src/remote/useDeckRemoteHost.ts` | Deck side: registers, accepts phones, pushes state, applies commands |
| `src/components/DeckRemotePanel.tsx` | QR pairing overlay on the deck |
| `src/pages/DeckRemote.tsx` | The phone page at `/remote` |

## Limits

- Very strict venue or corporate networks can block peer-to-peer traffic. That is rare when the phone is on mobile data, but carry a USB clicker as a fallback.
- If the PeerJS cloud is down, the deck shows "The remote could not start" with a **Try again** button.

## Self-hosted signalling (optional)

To use your own [PeerServer](https://github.com/peers/peerjs-server) instead of the PeerJS cloud, set these at build time:

```
VITE_PEER_HOST=peer.example.com VITE_PEER_PORT=443 VITE_PEER_PATH=/ VITE_PEER_SECURE=true pnpm build
```

## Testing

- `pnpm test` runs the protocol unit tests.
- End to end: run a local PeerServer on 127.0.0.1:9000, build with `VITE_PEER_HOST=127.0.0.1 VITE_PEER_PORT=9000`, run `vite preview`, open the deck, and pair a second browser window, or a phone on the same network if you use the laptop's LAN IP.
