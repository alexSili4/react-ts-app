import { IPageMetaData, SITE_NAME, SITE_URL } from '@/constants/pagesMeta';

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
//
// canonical — без кінцевого слеша, головна — голий домен; порожній title дає
// саму назву сайту.
const getPageMetaTags = (
  pathname: string,
  { title, description, image, noIndex }: IPageMetaData
): IPageMetaTags => ({
  title: title ? `${title} | ${SITE_NAME}` : SITE_NAME,
  description,
  canonical: `${SITE_URL}${pathname.replace(/\/+$/, '')}`,
  image: image ?? `${SITE_URL}/og-image.jpg`,
  noIndex: Boolean(noIndex),
});

export default getPageMetaTags;
