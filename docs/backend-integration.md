# Вбудовування в бекенд (Laravel, Yii)

За замовчуванням темплейт — самостійний SPA: `index.html` + `dist/`. Коли фронтенд живе всередині
бекенд-репозиторію і сторінку віддає бекенд (як у `newsun2`), схема інша. Робоча реалізація для
Laravel — `D:\work\sunAgency\newsun2`: `starter/vite.config.ts`, `resources/views/react_app.php`,
`routes/web.php`, `starter/scripts/`. Усі нестандартні рішення там прокоментовані — читати перед
тим, як переносити.

## Схема

```
<бекенд>/
├── starter/                         # цей темплейт
├── public/frontend/                 # збірка (outDir), комітиться разом із кодом
└── resources/views/react_app.php    # сторінка: метатеги, #root, #modal-root
```

1. Будь-який URL (catch-all маршрут бекенду) віддає серверний шаблон сторінки.
2. Шаблон містить те, що в темплейті лежить в `index.html`: метатеги з `data-rh="true"`,
   inline-стиль (фон і `[data-prerender]`), `#root`, `#modal-root` — і підключає збірку. За
   потреби — прелоадер, як у newsun2.
3. React стартує й далі працює як звичайно.

## Що змінити в темплейті

**`vite.config.ts`**

- `base: '/frontend/'` у продакшні (`process.env.NODE_ENV === 'production' ? '/frontend/' : '/'`).
- `build.outDir: '../public/frontend'`.
- Точка входу з фіксованим іменем, бо шаблон не знає хешів:
  `rollupOptions.output.entryFileNames: 'js/[name].js'` і `index.css` без хеша в
  `assetFileNames`. Решта чанків і ассетів — з хешем.
- `build.manifest: true` — з `.vite/manifest.json` шаблон бере імена статичних чанків для
  `<link rel="modulepreload">`.
- Чанки кожної збірки — в окрему теку (`builds/<BUILD_ID>/`), `emptyOutDir: false` і чистка тек,
  старших за кілька днів (`pruneStaleBuildFiles`). Інакше вкладка, відкрита до деплою, впаде з
  «Failed to fetch dynamically imported module»: старий `index.js` просить чанки, яких уже немає.
  Копії з `public/` з чистки виключати — на Windows вони зберігають дату оригіналу.
- Dev-сервер може віддавати сам серверний шаблон замість `index.html` (плагін `reactAppViewHtml`):
  тоді метатеги існують в одному місці, і dev не розходиться з продакшном. Кожна
  PHP-вставка мусить мати dev-відповідник — невідома дає помилку, а не тихе видалення.

**Код**

- Адреси файлів із `public/` — лише через `getPublicUrl()`: з `base: '/frontend/'` абсолютний
  `/files/x.json` вже не працює.
- `index.html` лишається тільки точкою входу збірки (`<div id="root">` + `<script>`); метатеги
  — у шаблоні. Залишити в `index.html` коментар, де їх правити.
- `SITE_URL` у `src/utils/pageTitle.ts` і базова адреса canonical у шаблоні мусять збігатися. У
  шаблоні canonical будувати від константи, а не від заголовка `Host` запиту.

## Серверні метатеги й пререндер

У самостійному режимі темплейт робить це сам: `dist/<шлях>.html` з метатегами сторінки
(`scripts/gen-pages.mjs`) і знімком контенту (`scripts/prerender.mjs`). Коли сторінку віддає
бекенд, ці файли він не роздає — потрібен шаблон, який підставляє те саме. Як у `newsun2`:

- збірка пише `page-meta.json` (шлях → title, description, canonical, og:image) — у темплейті
  джерело вже є: `src/utils/getPageMetaMap.ts` + `getPageMetaTags` (через
  `scripts/lib/pages.mjs`), лишається записати їх у JSON замість HTML;
- шаблон бере теги сторінки за шляхом запиту; шляху немає в мапі — `noindex` і статус 404;
- знімки пререндера — окремими файлами (`prerender/<шлях>.html`), шаблон кладе знімок у `#root`.
  `prerender.mjs` тоді обслуговує збірку з `base` (`/frontend/`) і пише знімки в окрему теку
  замість HTML маршрутів — так зроблено в `newsun2/starter/scripts/prerender.mjs`;
- `scripts/gen-sitemap.mjs` у `newsun2` ще й звіряє константи шаблону (домен, загальні
  title/description) з кодом і зупиняє збірку при розбіжності — варто зробити так само.
