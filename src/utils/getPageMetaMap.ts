import PagePaths from '@/constants/pagePaths';
import { pagesMeta } from '@/constants/pagesMeta';
import { IPageMetaData } from '@/types/pageMeta.types';

export const NOT_FOUND_PATH: string = PagePaths.notFound;

// Динамічні сторінки треба додати сюди з тих самих даних, з яких їх рендерить
// сайт, — інакше адреса лишиться без метатегів у HTML, знімка й місця в
// sitemap:
//
//   ...Object.fromEntries(
//     projects.map((project) => [
//       getProjectPath(project.id),
//       getProjectPageMeta(project),
//     ])
//   ),
//
// Модуль виконує Node під час збірки: без window і document, а імпортовані
// картинки там — порожні рядки, тож og:image — лише адреса файла з public/.
const getPageMetaMap = (): Record<string, IPageMetaData> => ({ ...pagesMeta });

export default getPageMetaMap;
