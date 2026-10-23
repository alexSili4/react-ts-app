import { IPageMetaData } from '@/constants/pagesMeta';
import { buildPageTitle, getAbsoluteUrl, SITE_URL } from './pageTitle';

export interface IPageMetaTags {
  title: string;
  description?: string;
  canonical: string;
  image: string;
  noIndex: boolean;
}

// Значення метатегів сторінки. Одна функція на двох споживачів: PageMeta
// (Helmet у браузері) і scripts/gen-pages.mjs (статичний HTML кожного
// маршруту). Якщо теги в сирому HTML і після запуску React розійдуться,
// пошуковик бачить два різні canonical і не вірить жодному.
const getPageMetaTags = (
  pathname: string,
  { title, description, image, noIndex }: IPageMetaData
): IPageMetaTags => ({
  title: buildPageTitle(title),
  description,
  canonical: getAbsoluteUrl(pathname),
  image: image ?? `${SITE_URL}/og-image.jpg`,
  noIndex: Boolean(noIndex),
});

export default getPageMetaTags;
