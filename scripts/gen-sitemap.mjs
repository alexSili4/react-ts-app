import fs from 'node:fs';
import path from 'node:path';
import { loadPages, OUT_DIR } from './lib/pages.mjs';

// sitemap.xml після збірки: усі сторінки з src/utils/getPageMetaMap.ts, крім
// noIndex. Адреса — canonical сторінки, той самий, що в її HTML і в PageMeta.
//
// lastmod свідомо немає: дата збірки на всіх сторінках однакова, і пошуковики
// швидко перестають зважати на таке поле. Якщо потрібен — брати з git
// (git log -1 --format=%cs -- <файли сторінки>).

const escapeXml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const { pages } = await loadPages();
const indexed = pages.filter(({ tags }) => !tags.noIndex);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexed.map(({ tags }) => `  <url>
    <loc>${escapeXml(tags.canonical)}</loc>
  </url>`).join('\n')}
</urlset>
`;

if (!fs.existsSync(OUT_DIR)) {
  throw new Error(`sitemap: немає теки ${OUT_DIR} — спершу vite build`);
}

fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${indexed.length} URL`);
