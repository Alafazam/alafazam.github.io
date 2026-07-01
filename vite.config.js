var _a, _b;
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Base path is overridable so we can publish a staging copy under a subfolder,
// e.g. DEPLOY_BASE=/preview/ serves the site at https://alafazam.com/preview/.
// Defaults to the production root.
var base = ((_b = (_a = globalThis
    .process) === null || _a === void 0 ? void 0 : _a.env) === null || _b === void 0 ? void 0 : _b.DEPLOY_BASE) || '/';
var isPreview = base !== '/';
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        {
            // Staging builds must never be indexed — they would compete with the
            // production site in search/answer engines.
            name: 'preview-noindex',
            transformIndexHtml: function (html) {
                if (!isPreview)
                    return html;
                return html.replace('<meta name="robots" content="index, follow" />', '<meta name="robots" content="noindex, nofollow" />');
            },
        },
    ],
    base: base, // Base path for GitHub Pages deployment (root domain by default)
    server: {
        port: 4000,
        strictPort: true, // Throw error if port is already in use instead of incrementing
        host: true, // Make the server accessible from other devices on your network
    },
});
