import { IPageMetaData, SITE_NAME, SITE_URL } from '@/constants/pagesMeta';

export interface IPageMetaTags {
  title: string;
  description?: string;
  canonical: string;
  image: string;
  noIndex: boolean;
}

// Одна функція для PageMeta (браузер) і scripts/gen-pages.mjs (сирий HTML):
// якщо теги в них розійдуться, пошуковик бачить два різні canonical і не
// вірить жодному.
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
