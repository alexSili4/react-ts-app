import { IPageMetaData } from '@/types/pageMeta.types';
import PagePaths from './pagePaths';

export const SITE_NAME = 'Назва сайту';

// Без завершального слеша: до нього дописується шлях сторінки.
export const SITE_URL = 'https://example.com';

// Модуль імпортують сторінки й виконує Node під час збірки
// (getPageMetaMap), тож він легкий і без звернень до window. Title і
// description головної повторюються в index.html.
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
