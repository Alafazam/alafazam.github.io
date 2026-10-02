// ESLint 8 config (the version pinned in package.json), following Vite's
// React + TypeScript template.
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', 'dist-ssr', 'public'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
  overrides: [
    {
      // Build scripts run in Node, not the browser.
      files: ['scripts/**/*.mjs', 'postcss.config.js', 'tailwind.config.js'],
      env: { node: true, browser: false },
    },
  ],
};
