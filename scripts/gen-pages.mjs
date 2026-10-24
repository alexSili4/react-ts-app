import fs from 'node:fs';
import path from 'node:path';
import { getPageFile, loadPages, OUT_DIR } from './lib/pages.mjs';

// Статичний HTML кожного маршруту: dist/<шлях>.html — копія зібраного
// index.html з метатегами саме цієї сторінки. Скребачки соцмереж (Facebook,
// Telegram, Viber, LinkedIn) JS не виконують і бачать лише сирий HTML: без
// цього репост будь-якої сторінки показував би загальну картку з index.html.
//
// Теги — ті самі, що ставить PageMeta (значення рахує getPageMetaTags), і
// так само з data-rh="true": після запуску React Helmet їх замінює, а не
// дублює. Сторінки — з src/utils/getPageMetaMap.ts.
//
// dist/404.html — оболонка з метатегами сторінки «не знайдено» (noindex). Її
// віддають Vercel, Netlify, GitHub Pages і nginx з error_page на невідому
// адресу — зі статусом 404, а React однаково відмалює NotFoundPage.

const SHELL_FILE = path.join(OUT_DIR, 'index.html');
const PAGE_META_MARKER = '<!--page-meta-->';

if (!fs.existsSync(SHELL_FILE)) {
  throw new Error(`pages: немає ${SHELL_FILE} — спершу vite build`);
}

const shell = fs.readFileSync(SHELL_FILE, 'utf8');

if (!shell.includes('<div id="root"></div>')) {
  throw new Error(`pages: ${SHELL_FILE} уже оброблено — запусти npm run build заново`);
}

// Загальні теги з index.html: <title> і всі, що перевизначає PageMeta
// (data-rh="true"). На їхнє місце ляже набір тегів сторінки.
const template = shell
  .replace(/<title>[\s\S]*?<\/title>/, PAGE_META_MARKER)
  .replace(/[ \t]*<(meta|link)\b[^>]*\bdata-rh="true"[^>]*>\r?\n?/g, '');

if (!template.includes(PAGE_META_MARKER)) {
  throw new Error(`pages: у ${SHELL_FILE} немає <title>`);
}

const escapeAttr = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const renderMetaTags = ({ title, description, canonical, image, noIndex }) =>
  [
    `<title>${escapeAttr(title)}</title>`,
    noIndex
      ? '<meta data-rh="true" name="robots" content="noindex, follow" />'
      : `<link data-rh="true" rel="canonical" href="${escapeAttr(canonical)}" />`,
    description &&
      `<meta data-rh="true" name="description" content="${escapeAttr(description)}" />`,
    '<meta data-rh="true" property="og:type" content="website" />',
    `<meta data-rh="true" property="og:url" content="${escapeAttr(canonical)}" />`,
    `<meta data-rh="true" property="og:title" content="${escapeAttr(title)}" />`,
    description &&
      `<meta data-rh="true" property="og:description" content="${escapeAttr(description)}" />`,
    `<meta data-rh="true" property="og:image" content="${escapeAttr(image)}" />`,
  ]
    .filter(Boolean)
    .join('\n    ');

const renderPage = (tags) => template.replace(PAGE_META_MARKER, renderMetaTags(tags));

const { pages, notFoundPath } = await loadPages();

for (const { path: pagePath, tags } of pages) {
  const file = getPageFile(pagePath);

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, renderPage(tags));
}

const notFoundPage = pages.find(({ path: pagePath }) => pagePath === notFoundPath);

if (notFoundPage) {
  fs.writeFileSync(path.join(OUT_DIR, '404.html'), renderPage(notFoundPage.tags));
}

console.log(
  `pages: ${pages.length} HTML з метатегами` + (notFoundPage ? ' + 404.html' : '')
);

// Попередження, а не помилка: заглушки свідомо стоять у самому темплейті, і
// його збірка має проходити. У проєкті з ними canonical і og:url ведуть на
// чужий домен, а картка в соцмережах — без картинки.
const placeholderWarnings = new Set();

for (const { tags } of pages) {
  const canonical = new URL(tags.canonical);
  const image = new URL(tags.image);
  const imageFile = path.posix.join('public', decodeURIComponent(image.pathname));

  if (canonical.hostname === 'example.com') {
    placeholderWarnings.add('SITE_URL у src/constants/pagesMeta.ts — досі https://example.com');
  }

  if (image.origin === canonical.origin && !fs.existsSync(imageFile)) {
    placeholderWarnings.add(`немає ${imageFile} — og:image ${tags.image} віддасть 404`);
  }
}

placeholderWarnings.forEach((warning) => console.warn(`pages: увага — ${warning}`));
