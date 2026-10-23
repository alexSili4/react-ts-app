// Усі шляхи сайту. Рядки в даних (navLinks, хлібні крихти) порівнюються з
// ними напряму — тому правило no-unsafe-enum-comparison вимкнено в .eslintrc.
const enum PagePaths {
  root = '/',
  notFound = '/not-found',
  // Імʼя параметра динамічних сторінок: `${PagePaths.x}/:${PagePaths.dynamicParam}`,
  // читати — useDynamicParam.
  dynamicParam = 'id',
}

export default PagePaths;
