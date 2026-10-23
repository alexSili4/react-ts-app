// Назва сайту й домен — замінити на старті проєкту. З них будуються title
// сторінок, canonical, og:url і sitemap.xml (scripts/gen-sitemap.mjs). Модуль
// без імпортів і без звернень до window: його виконує й Node.
export const SITE_NAME = 'Назва сайту';

// Без завершального слеша: до нього дописується pathname.
export const SITE_URL = 'https://example.com';

// Канонічна абсолютна адреса шляху: без кінцевого слеша, головна — голий
// домен.
export const getAbsoluteUrl = (path: string): string =>
  `${SITE_URL}${path.replace(/\/+$/, '')}`;

/**
 * Builds the full page title string.
 *
 * @param title - Page-specific part. Pass empty string to use just the site name.
 *
 * @example
 * buildPageTitle('Контакти') // => "Контакти | Назва сайту"
 * buildPageTitle('')         // => "Назва сайту"
 */
export const buildPageTitle = (title: string): string =>
  title ? `${title} | ${SITE_NAME}` : SITE_NAME;
