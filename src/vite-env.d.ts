/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare const __DEV__: boolean;

interface ImportMetaEnv {
  // Адреса бекенду без кінцевого слеша (.env.example). Порожньо — той самий домен.
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  // Прелоадер з index.html: 100 — сторінка готова, прелоадер можна знімати.
  updateLoader: (percent: number) => void;
}
