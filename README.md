# React App — темплейт фронтенду

Стартовий шаблон для нових проєктів агенції: SPA на **Vite 6 + React 18.3 + TypeScript**, стилі на
**emotion**. У темплейті — лише базовий каркас, що запускається. Решта структури описана в
архітектурі й створюється з першою потребою.

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — структура, куди що класти, як оформлювати код, стек і
  модулі, які додаються за потреби. Читати першим.
- [AGENTS.md](AGENTS.md) — правила для AI-агентів (Claude Code читає його через `CLAUDE.md`).
- [docs/decisions.md](docs/decisions.md) — чому рішення саме такі.

Node — **22** (`.nvmrc`), мінімум 20. Для збірки потрібен Google Chrome (пререндер).

## Швидкий старт

Темплейт — на GitHub: [alexSili4/react-ts-app](https://github.com/alexSili4/react-ts-app)
(Template repository). Новий проєкт — кнопкою **Use this template** або локально:

```powershell
# 1. Отримати темплейт без історії git
npx degit alexSili4/react-ts-app <проєкт>

# 2. Встановити залежності точно за lock-файлом
cd <проєкт>
npm ci

# 3. Запустити
npm run dev
```

Зміни самого темплейту — комітами в `main` цього репозиторію; уже створені проєкти вони не
змінюють.

## Чекліст нового проєкту

1. `package.json` → `name`.
2. `src/constants/pagesMeta.ts` → `SITE_NAME`, `SITE_URL` (з них title, canonical, og:url, sitemap).
3. `index.html` → title, description, og:\* (як у головної в `src/constants/pagesMeta.ts`),
   `theme-color` і колір фону в inline-стилі (= `theme.colors.background`).
4. `src/constants/theme.ts` → кольори, брейкпоінти, сітка, радіуси, шрифти з макета.
5. `src/styles/typography.ts` → типографічна шкала з макета.
6. Шрифти проєкту → `src/fonts/` за ARCHITECTURE.md, розділ 9.
7. `public/` → `favicon.svg` (+ `favicon.ico`, `apple-touch-icon.png`), `og-image.jpg` 1200×630,
   домен у `robots.txt`.
8. `Header`, `Footer` (`src/components/Common/`) → з макета.
9. Замінити зразок `MainPage/HeroSection` першою секцією макета.

## Команди

```bash
npm run dev         # dev-сервер Vite, http://localhost:5173
npm run build       # typecheck → vite build → pages → prerender → sitemap; результат у dist/
npm run preview     # локально віддати dist/
npm run lint        # eslint з типізованими правилами, 0 попереджень
npm run typecheck   # tsc для src і для vite.config.ts
```

`npm run lint` і `npm run build` мають проходити без помилок перед кожним комітом. Збірка без
пререндера (немає Chrome; не для деплою): `$env:SKIP_PRERENDER=1; npm run build`.

## Що в темплейті

```
src/
├── main.tsx                 # провайдери: Helmet, Router, тема
├── components/
│   ├── App.tsx              # Lenis + маршрути
│   ├── Common/              # SharedLayout, Header, Footer, PageContainer, PageMeta,
│   │                        # GlobalStyles, Loader, ChunkErrorBoundary, ModalWin
│   ├── MainPage/            # Main + зразок секції HeroSection
│   └── NotFoundPage/        # NotFound
├── pages/                   # MainPage, NotFoundPage
├── constants/               # theme, pagePaths, pagesMeta, index
├── styles/                  # typography
├── hooks/                   # useScrollToTop, useModal
├── utils/                   # метатеги сторінок, автоперезавантаження після деплою
├── types/                   # hooks.types
└── icons/Common/logo.svg    # ассети — по теках сторінок, як компоненти
scripts/                     # gen-pages, prerender, gen-sitemap
```

## Сторінки для роботів і соцмереж

Збірка кладе в `dist/` окремий HTML на кожну сторінку з `src/utils/getPageMetaMap.ts`:

1. **Метатеги** — `dist/about.html` з title, description, canonical і og:\* саме цієї сторінки:
   своє прев'ю в Telegram, Facebook, Viber, LinkedIn.
2. **Пререндер** — headless Chrome кладе текст сторінки в її HTML: контент для AI-краулерів
   (GPTBot, ClaudeBot не виконують JS), Bing і швидшої індексації в Google. Людям знімок не видно,
   React одразу замінює його справжньою сторінкою.

Деталі й вимоги до сторінок — ARCHITECTURE.md, розділи 4 і 10.

## Деплой

`npm run build` → вміст `dist/` на сервер. Сервер має віддавати на `/about` файл `about.html`, а на
невідому адресу — `404.html` зі статусом 404 (React відмалює сторінку «не знайдено»):

```nginx
location / {
  try_files $uri $uri.html =404;
  error_page 404 /404.html;
}

# Файли з хешем в імені не змінюються ніколи
location /assets/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}
```

- **Netlify, GitHub Pages** — так поводяться за замовчуванням.
- **Vercel** — `vercel.json`: `{ "cleanUrls": true }`.
- Строгий 404 вимагає, щоб **кожна** адреса сайту була в `getPageMetaMap`. Якщо частину адрес не
  перелічити (кабінет, адреси з параметрами за логіном), замість `=404` — SPA-фолбек
  `try_files $uri $uri.html /index.html;` (Vercel / Netlify — rewrite на `/index.html`). Ціна:
  невідома адреса віддає 200 і HTML головної — пошуковик бачить «м'який» 404.

HTML-файли (`index.html`, `<шлях>.html`) не кешувати надовго: саме вони підтягують нові чанки після
деплою. Вкладки, відкриті до деплою, при переході на новий маршрут один раз тихо
перезавантажаться (`ChunkErrorBoundary`).

## Версії

React лишається на 18.3: вразливості React 19, через які були побоювання, стосуються лише
серверних React Server Components, а не SPA в браузері. Vite 6.4, React Router 7, ESLint 9 —
гілки, що отримують патчі безпеки. Мажорні версії не оновлювати «заодно» з фічею — окремою
задачею. Обґрунтування — [docs/decisions.md](docs/decisions.md).
