import importTs from './import-ts.mjs';

// Сторінки сайту для скриптів збірки: шлях, метадані з getPageMetaMap і вже
// пораховані значення тегів — ті самі, що ставить PageMeta у браузері.
export const OUT_DIR = 'dist';

export const loadPages = async () => {
  const [{ default: getPageMetaMap, NOT_FOUND_PATH }, { default: getPageMetaTags }] =
    await Promise.all([
      importTs('src/utils/getPageMetaMap.ts'),
      importTs('src/utils/getPageMetaTags.ts'),
    ]);

  const pages = Object.entries(getPageMetaMap()).map(([pagePath, meta]) => ({
    path: pagePath,
    tags: getPageMetaTags(pagePath, meta),
  }));

  return { pages, notFoundPath: NOT_FOUND_PATH };
};

// Файл маршруту в збірці: '/' → dist/index.html, '/about' → dist/about.html,
// '/projects/x' → dist/projects/x.html. Саме <шлях>.html, а не
// <шлях>/index.html: тека змушує nginx, Netlify і GitHub Pages редиректити
// /about → /about/, а canonical у нас без кінцевого слеша. <шлях>.html на
// /about віддають без редиректу nginx (try_files $uri.html), Netlify, GitHub
// Pages, Vercel (cleanUrls) і vite preview.
export const getPageFile = (pagePath) =>
  pagePath === '/'
    ? `${OUT_DIR}/index.html`
    : `${OUT_DIR}${pagePath.replace(/\/+$/, '')}.html`;
