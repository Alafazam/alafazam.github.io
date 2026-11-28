/// <reference types="vite/client" />

// Base URL of the deck relay Worker (relay/), e.g. https://deck-relay.<account>.workers.dev
interface ImportMetaEnv {
  readonly VITE_RELAY_URL?: string;
}
