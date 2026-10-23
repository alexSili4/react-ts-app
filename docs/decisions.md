# Рішення і рекомендації

Чому стек темплейту саме такий, що змінено відносно `newsun2/starter` і що пропонується
змінити далі. Стан на **23.10.2026**.

---

## 1. React: лишаємось на 18.3

### Рішення

`react` і `react-dom` — `^18.3.1`. Перехід на 19 — окремою задачею, коли зʼявиться одна з умов
нижче.

### Факти

1. **Фактично проєкти вже на 18.3.1, а не на 18.2.** У `newsun2/starter` записано `^18.2.0`, і npm
   ставить найновішу 18.x — 18.3.1 (квітень 2024). 18.3 — це 18.2 плюс попередження в консолі про
   API, які прибрали в 19. Темплейт фіксує те, що реально працює: `^18.3.1`.
2. **Вразливості React 19 нашого типу проєктів не стосуються — ні на 18, ні на 19.** Критична
   CVE-2025-55182 («React2Shell», CVSS 10, грудень 2025) і наступні за нею (CVE-2025-55183,
   CVE-2025-55184, CVE-2025-67779, CVE-2026-23864, CVE-2026-23869, CVE-2026-23870 — DoS і витік
   коду) — у пакетах `react-server-dom-webpack/parcel/turbopack`, тобто в серверній частині
   React Server Components (Next.js App Router, React Router у RSC-режимі, Waku).
   Самі `react` і `react-dom` у списку вражених не значаться. Команда React пише прямо: якщо
   React-код застосунку не використовує сервер, застосунок не вражений. Наші SPA на Vite
   рендеряться лише в браузері (`react-dom/client`).
3. **React 18 заморожений, але не покинутий.** Останній реліз — 18.3.1 (26.04.2024). Політика
   React: попередні мажорні версії отримують критичні виправлення безпеки. Відомих вразливостей
   у `react`/`react-dom` 18.3.1 немає (`npm audit` по них чистий).
4. **Екосистема досі підтримує 18.** Перевірено `peerDependencies` найновіших версій усього, що ми
   використовуємо або підключаємо опційно: emotion, framer-motion/motion 14, react-router 7,
   react-i18next 17, react-helmet-async 3, react-hook-form 7, lottie-react 2, lenis — усі
   приймають React 18. Жодна бібліотека зараз не змушує переходити.
5. **Що дав би 19 нашим сайтам** — зручності, не можливості: `ref` як звичайний проп (без
   `forwardRef`), атрибут `inert` без латки типів (`src/types/react-inert.d.ts`), `<title>` і
   `<meta>` прямо в компонентах (міг би замінити react-helmet-async), Actions /
   `useActionState` / `useOptimistic` для форм. React Compiler працює і з 18.
6. **Що коштував би перехід:** зміни типів (`useRef` вимагає аргумент, `RefObject<T | null>`,
   глобальний `JSX`), прибрані застарілі API; framer-motion 11 у `peerDependencies` має лише
   `^18` — довелося б одночасно переходити на motion 12+. І головне: компоненти, які ми
   переносимо між проєктами (усі довідкові — на 18), перестали б переноситись без правок.

### Коли переглянути

- нова мажорна версія потрібної нам бібліотеки перестає підтримувати React 18;
- у `react-dom` 18 знаходять вразливість, яку не виправили в гілці 18;
- проєкт із SSR/RSC (Next.js тощо) — там 19 обовʼязковий і його треба тримати на останньому
  патчі;
- планове оновлення стеку разом із пунктами 3.1–3.3 нижче.

Шлях переходу, коли настане час: `npx codemod@latest react/19/migration-recipe` і
`npx types-react-codemod@latest preset-19 ./src`, framer-motion → `motion` 12+, перевірка
консолі на попередження 18.3 ще до оновлення.

Джерела: [React — Critical Security Vulnerability in React Server Components](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components),
[GHSA-479c-33wc-g2pg](https://github.com/react/react/security/advisories/GHSA-479c-33wc-g2pg),
[CVE-2026-23870](https://advisories.gitlab.com/npm/react-server-dom-parcel/CVE-2026-23870/),
[endoflife.date/react](https://endoflife.date/react).

---

## 2. Що змінено відносно `newsun2/starter`

**Архітектура**

- **Самостійний SPA замість вбудованого в Laravel.** Проєкти агенції живуть по-різному: у Laravel
  (`newsun2`), у Yii (`atbmarket`, `zh2`), окремо на Vercel (`SUN`). Тому за замовчуванням —
  `index.html` з метатегами й прелоадером, збірка в `dist/`, `base: '/'`. Вбудовування в бекенд —
  [backend-integration.md](backend-integration.md).
- З `vite.config.ts` прибрано Laravel-специфічне: `reactAppViewHtml`, `pageMetaJson`,
  `pruneStaleBuildFiles` + `BUILD_ID`, імена без хеша (`js/index.js`, `css/index.css`),
  `PRELOADED_FONTS`, розкладку ассетів по теках. Лишилось загальне: SVGR з `aria-hidden`,
  вендорні чанки (emotion разом із React, `cjs-helpers` окремо), аліаси, `__DEV__`.
- Прелоадер переїхав із `react_app.php` в `index.html` зі збереженням контракту
  (`window.updateLoader`, клас `loading`, подія `loaderFinished`).
- `scripts/gen-sitemap.mjs` спрощено: шляхи з `pagesMeta`, домен із `SITE_URL`, вихід у `dist/`.
  `scripts/prerender.mjs` не перенесено — він завʼязаний на PHP-шаблон (README → «Опційні
  модулі»).

**Тека `src`**

- Перенесено загальне: `General/` (layout, мета, модалки, лоадер, межа помилок, контейнери, sr-only
  заголовки), хуки модалок, скролу, медіазапитів, мови, прелоадера, `useReveal`, утиліти,
  i18n зі скриптом перевірки, `http.service.ts`, стилі-фрагменти.
- Не перенесено (специфіка Sun Agency): сторінки й компоненти About/Clients/Contacts/Projects/
  Services, дані кейсів, частинки, 404 «чорна діра», пігулки зі світінням, Lottie, слайдери, відео.
- `ErrorPage/ErrorScreen` — простий спільний екран для 404 і `ChunkErrorBoundary` з тим самим
  API, що в `BlackHoleScreen`.
- `Header`, `Footer` — мінімальні заготовки (лого, навігація з `navLinks`, копірайт, соцмережі).
- `theme.ts` — нейтральна заготовка з меншим набором токенів. Брейкпоінти 768 / 1024 / 1440 замість
  дизайнерських SUN (700 / 1024 / 1025 / 1281 / 1440) — на старті проєкту замінюються макетом.
- `navLinks` тримає ключі перекладу (`titleKey`), а не літерали — тексти темплейту одразу в i18n.
- `HttpService` бере адресу бекенду з `VITE_API_URL` (порожньо — той самий домен, як було).

**Залежності**

- `react`, `react-dom` — `^18.3.1` (див. розділ 1), `@types/react` — `^18.3.3`.
- Погоджено й виконано 23.10.2026 (розділ 3): `vite` 5 → 6.4 (3.1), `react-router-dom` 6 →
  `react-router` 7.18 (3.2), ESLint 8 → 9 з flat config (3.3), `vite-tsconfig-paths` (3.4),
  без теки `components/Animated/` (3.5).
- Прибрано опційні: `swiper`, `lottie-react`, `react-hook-form`, `react-fast-marquee`.
- `npm audit fix` без мажорних оновлень: axios 1.19.0 → 1.20.0, react-router 6.30.4 → 6.30.6,
  follow-redirects, brace-expansion, js-yaml, source-map-js — закрито 5 знахідок аудиту.

**Конфіги**

- `.prettierrc.json`: `jsxBracketSameLine` → `bracketSameLine` (стару назву Prettier 3 не знає).
- Додано: `.editorconfig` (2 пробіли, LF), `.nvmrc` (22), `.env.example`, скрипт `typecheck`,
  `AGENTS.md` + `CLAUDE.md`, `.claude/launch.json`.

---

## 3. Рекомендації на розгляд

Порядок — за пріоритетом. 3.1–3.6 погоджено й виконано 23.10.2026; 3.7 вирішується на старті
кожного проєкту.

### 3.1. Vite 5 → 6.4 — ✅ виконано 23.10.2026

**Чому.** Vite 5 офіційно більше не отримує виправлень: за політикою Vite патчі безпеки
отримують лише 6.4, 7.3 і 8.x ([vite.dev/releases](https://vite.dev/releases)). `npm audit` по
Vite 5.4.21 і вбудованому esbuild 0.21 показував вразливості dev-сервера, зокрема дві високої
критичності саме **під Windows**: обхід `server.fs.deny` через альтернативні шляхи і обхід
перевірки існування файла в `launch-editor`. Плюс esbuild GHSA-67mh-4wv8-2f99: будь-який сайт,
відкритий у тому ж браузері, міг читати відповіді dev-сервера. Продакшн-збірку це не зачіпало,
але dev-сервер на Windows працює весь робочий день.

**Що зроблено.** `vite@^6.4.5` (esbuild 0.25). `vite.config.ts` перейшов без змін,
`@vitejs/plugin-react` 4.7 і `vite-plugin-svgr` 4.5 сумісні. Перевірено:
`npm run lint`, `npm run build`, dev-сервер (сторінки, 404, гаряча заміна без перезавантаження),
`vite preview` продакшн-збірки. Склад чанків і `modulepreload` у зібраному `index.html` — ті
самі, що на Vite 5. Знахідки аудиту по Vite й esbuild закриті.

**Далі.** Vite 7/8 (Node 20.19+, Rolldown замість Rollup) — окремим кроком, коли знадобиться.
Перевіряти тоді насамперед `manualChunks` (`getVendorChunk`): він спирається на поведінку Rollup.

**Чинні проєкти** (`newsun2/starter` та інші на Vite 5) — той самий крок: `npm i -D vite@^6.4.5`,
потім збірка й dev. У `newsun2` окремо перевірити власні плагіни `vite.config.ts`
(`reactAppViewHtml` — `transformIndexHtml` і `configureServer`, `pageMetaJson`,
`pruneStaleBuildFiles`).

### 3.2. React Router 6 → 7 — ✅ виконано 23.10.2026

**Чому.** GHSA-wrjc-x8rr-h8h6 (open redirect через `\` у `<Link>` і `useNavigate`, moderate)
виправлено лише у 7.18.0, для гілки 6 виправлення немає. Друга знахідка аудиту
(GHSA-337j-9hxr-rhxg) стосується лише SSR-гідрації — нас не зачіпала.

**Що зроблено.** `react-router-dom@6` → `react-router@^7.18.4` (у v7 `react-router-dom` — лише
реекспорт, імпорти тепер з `react-router`). Декларативний режим (`BrowserRouter` + `Routes`)
лишився. `future`-прапорці v6 прибрано; замість `v7_startTransition: false` — офіційний проп
`<BrowserRouter useTransitions={false}>`: навігація без `startTransition`, тож під час переходу на
ще не завантажену сторінку, як і раніше, видно `Loader`. Перевірено в браузері зі штучною
затримкою чанка 2,5 с: після кліку стара сторінка ховається, видно `Loader`, потім — нова
сторінка. `npm audit` — 0 вразливостей.

**Ціна.** Node 20+ (вимога React Router 7). Чанк `react` виріс із 64,5 до 70,4 КБ gzip — v7
важчий за v6.

### 3.3. ESLint 8 → 9 — ✅ виконано 23.10.2026

**Чому.** ESLint 8 без підтримки з 05.10.2024, `typescript-eslint` 7 — теж. ESLint 10 уже вийшов
(лютий 2026), але `eslint-plugin-react` 7.37 і `eslint-plugin-jsx-a11y` 6.10 його ще не
підтримують, тож ціль — 9.39 (досі отримує патчі).

**Що зроблено.** `.eslintrc.cjs` → `eslint.config.js` (flat config): `eslint` 9.39,
`typescript-eslint` 8 (один пакет замість parser + plugin), `eslint-plugin-react-hooks` 7,
`eslint-plugin-react-refresh` 0.5, `globals`. Правила ті самі. Два уточнення:

- з `eslint-plugin-react-hooks` 7 увімкнено лише `rules-of-hooks` і `exhaustive-deps`, як було.
  Його пресет `recommended` додає правила React Compiler (`refs`, `set-state-in-effect` та ін.) —
  вони зачепили б перевірені патерни з `newsun2` (наприклад, `ref.current = …` під час рендеру в
  `useScrollLock`), тож вмикати їх — окремим рішенням;
- у `typescript-eslint` 8 правило `no-empty-object-type` лаяло б `interface Theme extends ITheme {}`
  у `theme.ts` — штатне розширення типу теми emotion. Дозволено опцією
  `allowInterfaces: 'with-single-extends'`.

Перевірено пробним файлом із порушеннями: правила хуків, типізовані правила TypeScript і
jsx-a11y спрацьовують.

### 3.4. Аліаси — одне джерело — ✅ виконано 23.10.2026

**Чому.** Аліаси були оголошені двічі — `tsconfig.json` і `vite.config.ts`; кожна нова сторінка —
дві правки, розсинхрон — «tsc проходить, Vite не збирає» (або навпаки). У `newsun2` їх 16.

**Що зроблено.** Плагін `vite-tsconfig-paths` 6: Vite читає `paths` із `tsconfig.json`, блок
`resolve.alias` прибрано. Стиль імпортів (`@GeneralComponents/...`) не змінився — компоненти
переносяться між проєктами без правок.

### 3.5. Прибрати дерево `components/Animated/` — ✅ виконано 23.10.2026

**Чому.** Компоненти однієї сторінки жили у двох місцях (`MainPage/X` і `Animated/MainPage/Y`), і
на кожну сторінку був ще один аліас. Межа «анімований чи ні» розмита: на сайтах агенції
анімується майже все.

**Що зроблено.** `AnimatedModalWin` переїхав у `General/`, теку `Animated/` і аліас
`@AnimatedGeneralComponents` прибрано. Правило: анімований компонент лежить у теці своєї сторінки
або в `General/`, префікс `Animated` в імені лишається як позначка. Компоненти з
`newsun2/starter/src/components/Animated/` при перенесенні класти за цим правилом і міняти шлях
імпорту. Чинні проєкти не чіпали.

### 3.6. Темплейт — у git — ✅ виконано 23.10.2026

Темплейт — у [alexSili4/react-ts-app](https://github.com/alexSili4/react-ts-app) (публічний,
Template repository), гілка `main`. Попередня версія темплейту (2024–2025: React 18.2, Vite 5,
`components/common`) лишилась в історії: новий темплейт ліг одним комітом поверх неї, без force.
Нові проєкти — кнопкою «Use this template» або `npx degit alexSili4/react-ts-app <проєкт>`.

### 3.7. Метатеги для соцмереж — рішення на кожен проєкт

У самостійному SPA скребачки соцмереж бачать лише загальні теги з `index.html`: репост будь-якої
сторінки показує ту саму картку. Для сайтів, де репости окремих сторінок важливі (кейси, статті),
потрібні серверні метатеги або пререндер — як у `newsun2` (`page-meta.json` + `react_app.php` +
`scripts/prerender.mjs`). Вирішувати на старті проєкту, бо це впливає на хостинг.
