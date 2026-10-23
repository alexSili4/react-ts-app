import PagePaths from './pagePaths';

export const SITE_NAME = 'Назва сайту';

// Без завершального слеша: до нього дописується шлях сторінки.
export const SITE_URL = 'https://example.com';

// Модуль імпортують сторінки й виконує Node під час збірки
// (getPageMetaMap), тож він легкий і без звернень до window.
//
// title — частина до « | SITE_NAME»: разом із суфіксом ≤ 60 символів, інакше
// Google обріже кінець; description — 150–160. Title і description головної
// повторюються в index.html.
export interface IPageMetaData {
  title: string;
  description?: string;
  // Абсолютний URL, JPG 1200×630: WebP показують не всі соцмережі.
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
