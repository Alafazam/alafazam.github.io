// Router base so the app works whether served from the production root ("/")
// or a staging subfolder ("/preview/"). Vite injects BASE_URL from `base`.
// Lives outside App.tsx so that module exports only components (fast refresh).
export const routerBasename = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/';
