import PagePaths from './pagePaths';

// Метадані сторінок в одному місці. Читають їх PageMeta (метатеги після
// запуску React) і scripts/gen-sitemap.mjs (sitemap.xml: усі шляхи звідси,
// крім noIndex). Модуль свідомо легкий — його імпортують сторінки, а скрипт
// виконує його в Node.
//
// title — частина до « | <SITE_NAME>»; разом із суфіксом не довше ~60
// символів, інакше Google обріже кінець. description — 150–160 символів.
// Title і description головної повторюються в index.html.
export interface IPageMetaData {
  title: string;
  description?: string;
  // Абсолютний URL картинки для прев'ю в соцмережах (og:image), JPG 1200×630
  image?: string;
  noIndex?: boolean;
}

export const pagesMeta = {
  [PagePaths.root]: {
    title: '',
    description: 'Опис сайту, 150–160 символів.',
  },
  [PagePaths.notFound]: {
    title: 'Сторінку не знайдено',
    noIndex: true,
  },
} satisfies Record<string, IPageMetaData>;
