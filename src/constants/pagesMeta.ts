import PagePaths from './pagePaths';

// Назва сайту й домен — замінити на старті проєкту. З них будуються title
// сторінок, canonical, og:url і sitemap.xml.
export const SITE_NAME = 'Назва сайту';

// Без завершального слеша: до нього дописується шлях сторінки.
export const SITE_URL = 'https://example.com';

// Метадані сторінок в одному місці. Читають їх PageMeta (метатеги після
// запуску React) і, через src/utils/getPageMetaMap.ts, скрипти збірки:
// HTML кожного маршруту з його метатегами, пререндер і sitemap.xml. Модуль
// свідомо легкий — його імпортують сторінки, а скрипти виконують його в Node.
//
// title — частина до « | SITE_NAME»; разом із суфіксом не довше ~60
// символів, інакше Google обріже кінець. description — 150–160 символів.
// Title і description головної повторюються в index.html (теги для dev).
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
