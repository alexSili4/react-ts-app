// Рядки в даних (навігація, хлібні крихти) порівнюються з PagePaths напряму —
// тому правило no-unsafe-enum-comparison вимкнено в eslint.config.js.
const enum PagePaths {
  root = '/',
  notFound = '/not-found',
  dynamicParam = 'id',
}

export default PagePaths;
