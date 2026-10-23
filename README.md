# React App — темплейт фронтенду

Стартовий шаблон для нових проєктів агенції: SPA на **Vite 6 + React 18.3 + TypeScript**,
стилі на **emotion**, анімації на **framer-motion**, плавний скрол **Lenis**, локалізація
**i18next**. Зібраний з фронтенду `newsun2/starter` (Sun Agency): узято загальну частину й
перевірені рішення, а контент і специфіку проєкту прибрано.

Темплейт самодостатній: збирається в `dist/` і віддається будь-яким статичним сервером. Як
вбудувати його в Laravel/Yii, як у `newsun2`, — у [docs/backend-integration.md](docs/backend-integration.md).

- Правила коду для людей і AI-агентів — [AGENTS.md](AGENTS.md).
- Чому стек саме такий і що пропонується змінити — [docs/decisions.md](docs/decisions.md).

## Стек

| Що                | Пакет                                   | Версія   |
| ----------------- | --------------------------------------- | -------- |
| Збірка            | vite, @vitejs/plugin-react              | 6.4, 4.7 |
| UI                | react, react-dom                        | 18.3     |
| Мова              | typescript (strict)                     | 5.4      |
| Роутинг           | react-router (декларативний режим)      | 7.18     |
| Стилі             | @emotion/react, @emotion/styled         | 11       |
| Анімації          | framer-motion                           | 11       |
| Плавний скрол     | lenis                                   | 1.3      |
| Локалізація       | i18next, react-i18next                  | 25, 15   |
| Метатеги          | react-helmet-async                      | 3        |
| HTTP              | axios                                   | 1.20     |
| Іконки            | react-icons, vite-plugin-svgr (SVG → компонент) | 5, 4 |
| Лінтер            | eslint (flat config) + typescript-eslint (типізовані правила), jsx-a11y | 9.39, 8 |

Node — **22** (`.nvmrc`), мінімум 20 (вимога React Router 7).

## Швидкий старт

Темплейт живе на GitHub: [alexSili4/react-ts-app](https://github.com/alexSili4/react-ts-app)
(Template repository). Новий проєкт — кнопкою **Use this template** на GitHub (одразу новий
репозиторій) або локально:

```powershell
# 1. Отримати темплейт без історії git
npx degit alexSili4/react-ts-app <проєкт>

# 2. Встановити залежності точно за lock-файлом
cd <проєкт>
npm ci

# 3. Запустити
npm run dev
```

Зміни самого темплейту — комітами в `main` цього репозиторію; нові проєкти беруть його поточний
стан, уже створені проєкти він не змінює.

Якщо проєкт живе всередині бекенд-репозиторію (як `newsun2/starter`), копіювати в його підтеку
й далі — за [docs/backend-integration.md](docs/backend-integration.md).

## Чекліст нового проєкту

1. `package.json` → `name`.
2. `src/utils/pageTitle.ts` → `SITE_NAME`, `SITE_URL` (з них title, canonical, og:url, sitemap).
3. `index.html` → title, description, og:\* (тексти — як у головної в `src/constants/pagesMeta.ts`),
   `theme-color`, колір фону й вигляд прелоадера.
4. `src/constants/theme.ts` → кольори, брейкпоінти, сітка, радіуси з макета.
5. `src/fonts/` + `GlobalStyles` + `theme.fontFamily` → шрифти проєкту (Inter — лише приклад).
6. `src/styles/typography.ts` → типографічна шкала з макета.
7. `public/` → `favicon.svg` (+ `favicon.ico`, `apple-touch-icon.png`), `og-image.jpg` 1200×630,
   домен у `robots.txt`.
8. `src/i18n/languages.ts` → мови сайту; тексти — у `src/i18n/locales/<мова>/*.json`.
9. `src/constants/links.ts` → соцмережі; `navLinks.ts` → пункти меню.
10. `.env.example` → `.env`, якщо бекенд на іншому домені (`VITE_API_URL`).
11. Прибрати демо-вміст: `MainPage/HeroSection`, ключі `hero.*` у локалях.

## Команди

```bash
npm run dev         # dev-сервер Vite, http://localhost:5173
npm run build       # i18n:check → typecheck → vite build → pages → prerender → sitemap
npm run preview     # локально віддати dist/
npm run lint        # eslint з типізованими правилами, 0 попереджень
npm run typecheck   # tsc для src і для vite.config.ts
npm run i18n:check  # повнота перекладів: ті самі файли, ключі й плейсхолдери в усіх мовах
npm run pages       # dist/<шлях>.html з метатегами кожної сторінки + dist/404.html
npm run prerender   # знімок контенту кожної сторінки в її HTML (headless Chrome)
npm run sitemap     # dist/sitemap.xml
```

`pages`, `prerender` і `sitemap` входять у `build` і окремо потрібні хіба для налагодження.
Збірці потрібен Google Chrome (стандартний шлях або `CHROME_PATH`); збірка без пререндера —
`SKIP_PRERENDER=1` (PowerShell: `$env:SKIP_PRERENDER=1; npm run build`).

`npm run lint` і `npm run build` мають проходити без помилок перед кожним комітом.

## Сторінки для роботів і соцмереж

SPA віддає роботам порожній `#root`, а скребачкам соцмереж — однакові метатеги на всіх
адресах. Тому збірка кладе в `dist/` окремий HTML на кожну сторінку:

1. **Метатеги** (`scripts/gen-pages.mjs`): `dist/about.html` — копія `index.html` з title,
   description, canonical і og:\* саме цієї сторінки. Прев'ю в Telegram, Facebook, Viber,
   LinkedIn — своє для кожної сторінки. Значення рахує `getPageMetaTags` — та сама функція, що в
   `PageMeta`, тож сирий HTML і теги після запуску React не розходяться.
2. **Пререндер** (`scripts/prerender.mjs`): headless Chrome відкриває кожну сторінку, чекає
   рендеру й кладе текст `#root` у її HTML. Це контент для AI-краулерів (GPTBot, ClaudeBot не
   виконують JS), Bing і швидшої індексації в Google. Людина знімка не бачить: він під
   прелоадером, і React одразу замінює його справжньою сторінкою.

Перелік сторінок — `src/utils/getPageMetaMap.ts`: статичні з `pagesMeta` плюс динамічні, які
треба дописати туди самим (`/projects/:id` тощо). Сторінка, якої там немає, не отримає ні
метатегів, ні знімка, ні місця в sitemap. Сторінки з `noIndex` отримують HTML з `noindex`, але
без знімка.

Вимоги до сторінки, щоб пререндер спрацював: рендериться без дій користувача, має `<main>` і
рівно один `h1` (інакше збірка зупиниться з помилкою), og:image — абсолютна адреса файла з
`public/`.

## Структура

```
├── .claude/launch.json        # dev/preview-сервер для Claude Code (desktop)
├── docs/                      # рішення, інтеграція з бекендом
├── public/                    # копіюється в збірку як є: favicon, robots.txt, og-image.jpg
├── scripts/
│   ├── check-i18n.mjs         # перевірка перекладів (перший крок build)
│   ├── gen-pages.mjs          # dist/<шлях>.html з метатегами сторінки + 404.html
│   ├── prerender.mjs          # знімок контенту сторінок у їхній HTML (headless Chrome)
│   ├── gen-sitemap.mjs        # dist/sitemap.xml
│   └── lib/                   # import-ts (TS-модуль із src у Node), pages (перелік сторінок)
├── src/
│   ├── main.tsx               # провайдери; рендер після готовності i18n
│   ├── components/
│   │   ├── App.tsx            # Lenis + маршрути з лінивими сторінками
│   │   ├── General/           # спільне для всіх сторінок: layout, хедер, футер, мета, модалки
│   │   ├── ErrorPage/         # 404 і екран помилки
│   │   └── MainPage/          # компоненти головної — тека на кожну сторінку
│   ├── constants/             # тема, шляхи, метадані сторінок, навігація, motion-варіанти
│   ├── fonts/                 # woff2 по теках родин + index.ts
│   ├── hooks/                 # хуки + index.ts
│   ├── i18n/                  # мови, ініціалізація, locales/<мова>/<неймспейс>.json
│   ├── icons/                 # SVG, імпорт як компонент: '@/icons/x.svg?react'
│   ├── images/                # растр (webp/jpg/png), імпорт — Vite додає хеш
│   ├── pages/                 # сторінка = один файл: PageMeta + секції + Footer
│   ├── services/              # HTTP-шар: http.service (axios) + app.service (методи API)
│   ├── styles/                # css-фрагменти emotion: типографіка, поля, sr-only, сітка
│   ├── types/                 # спільні типи (типи пропсів — поруч із компонентом)
│   └── utils/                 # чисті функції + index.ts
├── index.html                 # метатеги за замовчуванням, прелоадер, #root, #modal-root
├── vite.config.ts             # SVGR, вендорні чанки, аліаси з tsconfig (vite-tsconfig-paths)
├── tsconfig.json              # strict; paths — єдине місце, де оголошені аліаси
└── eslint.config.js           # ESLint 9, flat config
```

Компонент — тека з чотирма файлами:

```
HeroSection/
├── HeroSection.tsx         # розмітка й логіка, export default
├── HeroSection.styled.ts   # styled-компоненти emotion
├── HeroSection.types.ts    # IProps (лише якщо є пропси)
└── index.ts                # export { default } from './HeroSection';
```

Тека `video/` у темплейт свідомо не входить: відео потрібне не кожному проєкту. Як додати —
нижче, в «Опційних модулях».

## Типові задачі

**Нова сторінка.** Шлях у `PagePaths` (`constants/pagePaths.ts`) → метадані в `pagesMeta` →
файл `src/pages/<Name>Page.tsx` (за зразком `MainPage.tsx`) → `lazy(() => import(...))` і `<Route>`
в `App.tsx` → тека компонентів `src/components/<Name>Page/` і аліас `@<Name>PageComponents` у
`paths` (`tsconfig.json`; Vite підхопить сам). Пункт меню — у `navLinks.ts`, підпис — у локалях.
Статичну сторінку HTML, пререндер і sitemap підхоплять із `pagesMeta` самі; динамічну
(`/projects/:id`) — дописати в `src/utils/getPageMetaMap.ts`.

**Новий текст.** Ключ у `src/i18n/locales/uk/general.json` (або новий неймспейс — файл поруч і рядок
у `src/i18next.d.ts`), у компоненті — `const { t } = useTranslation(); t('section.key')`. Ключі
типізовані: неіснуючий ключ — помилка `tsc`.

**Нова мова.** Тека `src/i18n/locales/<код>/` з тими самими JSON → рядок у `LANGUAGES`
(`src/i18n/languages.ts`) → `npm run i18n:check`. Перемикач мов — `useLanguage()`.

**Модалка.** `ModalWin` (портал у `#modal-root`) + `AnimatedModalWin` (AnimatePresence) +
`useModalClose` / `useModalWin`: блокування скролу, Escape, фокус-трап. Контейнеру діалогу —
`ref={dialogRef}`, `role='dialog'`, `aria-modal`, `aria-label`, `tabIndex={-1}`.

**Метод API.** Метод у класі `AppService` (`src/services/app.service.ts`) через `this.get/post/...`,
типи запиту й відповіді — у `src/types/<домен>.types.ts`.

**Анімація появи.** Простий fade/slide при вході у вʼюпорт — атрибут `data-reveal` (і
`data-reveal-delay`), без JS-коду. Складніше — framer-motion з варіантами з `constants/motion.ts`.

## Опційні модулі

Не кожному проєкту потрібні, тому в темплейті їх немає. Перевірені реалізації лежать у
`D:\work\sunAgency\newsun2\starter` — переносити звідти разом із правилами з коментарів.

| Модуль              | Коли                         | Встановити                     | Що взяти з `newsun2/starter`                                                              |
| ------------------- | ---------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------- |
| Відео               | фонові й декоративні відео   | —                              | тека `src/video/`, `General/AutoplayVideo`, `hooks/useVideo.ts`, постери `src/images/posters/` |
| Слайдер             | каруселі                     | `npm i swiper@^11`             | `src/styles/swiper.css` (`@layer swiper`), `General/SwiperNavButtons`, `hooks/useSwiperEdges.ts` |
| Lottie              | анімації з After Effects     | `npm i lottie-react@^2`        | `General/InViewLottie`, `hooks/useLazyLottie.ts`, `useLottieData.ts`, аліас `lottie-web` → `lottie_svg` у `vite.config.ts` |
| Форма               | зворотний звʼязок            | `npm i react-hook-form@^7`     | `ContactsPage/HeroSectionContactsForm*`, `constants/formErrorMessages.ts`, `utils/phoneFormatter.ts`, `services/app.service.ts` |
| Біжучий рядок       | стрічка логотипів            | `npm i react-fast-marquee@^1`  | `MainPage/ClientsSectionMarquee`                                                          |
| Перемикач мов       | дві й більше мов             | —                              | `General/LangsMenu` (`useLanguage` уже є)                                                 |
| Вбудовування в бекенд | Laravel / Yii              | —                              | [docs/backend-integration.md](docs/backend-integration.md)                                |

Lottie — лише `fetch` JSON із `public/`, не `import('*.json')`: великі анімації інакше осідають
у бандлі.

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

## Версії та оновлення

- **React лишається на 18.3** — нема вагомих причин переходити на 19, а вразливості, через які були
  побоювання, React-у в браузері не стосуються. Обґрунтування й умови, за яких варто
  переглянути рішення, — у [docs/decisions.md](docs/decisions.md).
- Мажорні версії (React, Vite, React Router, ESLint) не оновлювати «заодно» з фічею — окремою
  задачею, з перевіркою збірки й ключових сторінок.
- **Vite 6.4, React Router 7, ESLint 9** — гілки, що отримують патчі безпеки (оновлено
  23.10.2026). Vite 7/8 (Node 20.19+, Rolldown) — окремою задачею.
- Там же — що змінено відносно `newsun2/starter` і рекомендації, які ще чекають рішення.
