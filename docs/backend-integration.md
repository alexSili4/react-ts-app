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
└── resources/views/react_app.php    # сторінка: метатеги, прелоадер, #root, #modal-root
```

1. Будь-який URL (catch-all маршрут бекенду) віддає серверний шаблон сторінки.
2. Шаблон містить те, що в темплейті лежить в `index.html`: метатеги з `data-rh="true"`,
   прелоадер із `window.updateLoader`, `#root`, `#modal-root` — і підключає збірку.
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
  тоді метатеги й прелоадер існують в одному місці, і dev не розходиться з продакшном. Кожна
  PHP-вставка мусить мати dev-відповідник — невідома дає помилку, а не тихе видалення.

**Код**

- Адреси файлів із `public/` — лише через `getPublicUrl()`: з `base: '/frontend/'` абсолютний
  `/files/x.json` вже не працює.
- `index.html` лишається тільки точкою входу збірки (`<div id="root">` + `<script>`); метатеги
  й прелоадер — у шаблоні. Залишити в `index.html` коментар, де їх правити.
- `SITE_URL` у `src/utils/pageTitle.ts` і базова адреса canonical у шаблоні мусять збігатися. У
  шаблоні canonical будувати від константи, а не від заголовка `Host` запиту.

## Серверні метатеги й пререндер (за потреби)

Скребачки соцмереж і роботи без JS бачать лише HTML від сервера. У `newsun2` це вирішено так:

- збірка пише `page-meta.json` (шлях → title, description, og:image, JSON-LD) з тих самих даних,
  що й `PageMeta` (плагін `pageMetaJson`), а шаблон підставляє теги сторінки за шляхом запиту;
  неіснуючий шлях — `noindex` і статус 404;
- `scripts/prerender.mjs` знімає готовий HTML кожної сторінки в headless Chrome, і шаблон кладе
  його в `#root` для роботів;
- `scripts/gen-sitemap.mjs` звіряє константи шаблону (домен, загальні title/description) з
  кодом і зупиняє збірку при розбіжності.

Переносити, коли проєкту справді потрібні сторінкові прев'ю в соцмережах або індексація
роботами без JS: це помітно ускладнює збірку.
