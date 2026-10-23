import fs from 'node:fs';
import path from 'node:path';
import importTs from './lib/import-ts.mjs';

// sitemap.xml після збірки: усі шляхи з src/constants/pagesMeta.ts, крім
// noIndex. Домен — SITE_URL з src/utils/pageTitle.ts, той самий, з яким
// canonical ставить PageMeta. Динамічні сторінки (/projects/:id) сюди
// додаються з тих самих даних, з яких їх рендерить сайт, — інакше sitemap
// розʼїдеться з роутами.
//
// lastmod свідомо немає: дата збірки на всіх сторінках однакова, і пошуковики
// швидко перестають зважати на таке поле. Якщо потрібен — брати з git
// (git log -1 --format=%cs -- <файли сторінки>).

const OUT_DIR = process.env.SITEMAP_OUT_DIR || 'dist';

const { SITE_URL } = await importTs('src/utils/pageTitle.ts');
const { pagesMeta } = await importTs('src/constants/pagesMeta.ts');

const paths = Object.entries(pagesMeta)
  .filter(([, meta]) => !meta.noIndex)
  .map(([pagePath]) => pagePath);

const escapeXml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const toLoc = (pagePath) =>
  escapeXml(`${SITE_URL}${pagePath === '/' ? '' : pagePath}`);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((pagePath) => `  <url>
    <loc>${toLoc(pagePath)}</loc>
  </url>`).join('\n')}
</urlset>
`;

if (!fs.existsSync(OUT_DIR)) {
  throw new Error(`sitemap: немає теки ${OUT_DIR} — спершу vite build`);
}

fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${paths.length} URL → ${OUT_DIR}/sitemap.xml`);
