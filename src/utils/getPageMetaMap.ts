import PagePaths from '@/constants/pagePaths';
import { IPageMetaData, pagesMeta } from '@/constants/pagesMeta';

// Шлях сторінки «не знайдено» — для dist/404.html (scripts/gen-pages.mjs).
export const NOT_FOUND_PATH: string = PagePaths.notFound;

// Усі адреси сайту з метаданими — для збірки: HTML на кожен маршрут
// (scripts/gen-pages.mjs), пререндер (scripts/prerender.mjs) і sitemap.xml.
// Сайт у браузері її не використовує: сторінки беруть метадані з pagesMeta.
//
// Динамічні сторінки додаються сюди з тих самих даних, з яких їх рендерить
// сайт, — інакше адреса лишиться без власних метатегів, знімка й місця в
// sitemap:
//
//   ...Object.fromEntries(
//     projects.map((project) => [
//       getProjectPath(project.id),
//       getProjectPageMeta(project),
//     ])
//   ),
//
// Модуль виконується в Node (scripts/lib/import-ts.mjs): без звернень до window
// і document. Імпортовані картинки там — порожні рядки, тож og:image — лише
// абсолютна адреса файла з public/ (getAbsoluteUrl('/og/x.jpg')).
const getPageMetaMap = (): Record<string, IPageMetaData> => ({ ...pagesMeta });

export default getPageMetaMap;
