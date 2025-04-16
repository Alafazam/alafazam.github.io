import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/', // Base path for GitHub Pages deployment (root domain)
    server: {
        port: 4000,
        strictPort: true, // Throw error if port is already in use instead of incrementing
        host: true, // Make the server accessible from other devices on your network
    },
});
