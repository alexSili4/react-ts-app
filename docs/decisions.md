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

Принцип (рішення власника, 23.10.2026, див. 3.9): темплейт — **каркас, що запускається, і по
одному зразку кожного патерну**. Решта структури описана в [ARCHITECTURE.md](../ARCHITECTURE.md) і
створюється з першою потребою; бібліотеки ставляться тоді ж.

**Архітектура**

- **Самостійний SPA замість вбудованого в Laravel.** Проєкти агенції живуть по-різному: у Laravel
  (`newsun2`), у Yii (`atbmarket`, `zh2`), окремо на Vercel (`SUN`). Тому за замовчуванням —
  `index.html` з метатегами, збірка в `dist/`, `base: '/'`. Вбудовування в бекенд —
  [backend-integration.md](backend-integration.md).
- З `vite.config.ts` прибрано Laravel-специфічне: `reactAppViewHtml`, `pageMetaJson`,
  `pruneStaleBuildFiles` + `BUILD_ID`, імена без хеша (`js/index.js`, `css/index.css`),
  `PRELOADED_FONTS`, розкладку ассетів по теках. Лишилось загальне: SVGR з `aria-hidden`,
  вендорні чанки (emotion разом із React, `cjs-helpers` окремо).
- Сторінки для роботів і соцмереж — замість `page-meta.json` + `react_app.php`: збірка пише
  `dist/<шлях>.html` з метатегами кожної сторінки, пререндер (перенесено з newsun2) кладе знімок
  у той самий HTML, sitemap — з того самого переліку сторінок. Див. 3.7.
- Прелоадера немає (3.9): знімок пререндера ховає inline-стиль `index.html`.

**Тека `src` — що перенесено**

- `Common/` (у newsun2 — `General/`, 3.8): `SharedLayout`, `GlobalStyles`, `PageContainer`,
  `PageMain`, `Section`, `PageMeta`, `Loader`, `ChunkErrorBoundary` + `PageReadySignal`,
  `ModalWin` + `AnimatedModalWin`; заготовки `Header` (лого) і `Footer` (копірайт).
- Хуки модалок і скролу: `useModalWin`, `useModalClose`, `useBodyScrollLock`, `useFocusTrap`,
  `useScrollToTop`; утиліти до них.
- `ErrorPage/`: `NotFound` і `ErrorScreen` (простий екран з тим самим API, що `BlackHoleScreen`).
- `constants/`: `theme` (нейтральна заготовка, брейкпоінти 768 / 1024 / 1440 замість
  дизайнерських SUN), `pagePaths`, `pagesMeta`, `index`.
- `styles/`: `typography`, `containerPadding`.
- Зразок секції: `MainPage/HeroSection` (усі чотири файли компонента).

**Що лише описано в ARCHITECTURE.md** (з посиланнями на файли newsun2 і на адаптовані версії в
історії темплейту, `git show 52b324d:<шлях>`): i18n, HTTP-шар, форми, шрифти, картинки, відео,
слайдери, Lottie, біжучий рядок, прелоадер, `useReveal`, `useMediaQuery`, `srOnly`, `gridSpan`,
`cappedVw`, константи навігації, контактів, motion-варіантів.

**Залежності**

- `react`, `react-dom` — `^18.3.1` (див. розділ 1), `@types/react` — `^18.3.3`.
- Погоджено й виконано 23.10.2026 (розділ 3): `vite` 5 → 6.4 (3.1), `react-router-dom` 6 →
  `react-router` 7.18 (3.2), ESLint 8 → 9 з flat config (3.3), `vite-tsconfig-paths` (3.4).
- У `package.json` — лише те, що використовує каркас (3.9). `axios`, `react-hook-form`, i18next,
  `react-icons`, `swiper`, `lottie-react`, `react-fast-marquee` — з першою потребою, перелік і
  версії — ARCHITECTURE.md, розділ 1.

**Конфіги**

- `.prettierrc.json`: `jsxBracketSameLine` → `bracketSameLine` (стару назву Prettier 3 не знає).
- Додано: `.editorconfig` (2 пробіли, LF), `.nvmrc` (22), скрипт `typecheck`, `ARCHITECTURE.md`,
  `AGENTS.md` + `CLAUDE.md`, `.claude/launch.json`.

---

## 3. Рекомендації на розгляд

Порядок — за пріоритетом. Усе погоджено й виконано 23.10.2026.

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
`resolve.alias` прибрано. Стиль імпортів через групові аліаси (`@CommonComponents/...`) не
змінився.

### 3.5. Прибрати дерево `components/Animated/` — ✅ виконано 23.10.2026

**Чому.** Компоненти однієї сторінки жили у двох місцях (`MainPage/X` і `Animated/MainPage/Y`), і
на кожну сторінку був ще один аліас. Межа «анімований чи ні» розмита: на сайтах агенції
анімується майже все.

**Що зроблено.** `AnimatedModalWin` переїхав у спільну теку (тепер `Common/`), теку `Animated/` і
аліас `@AnimatedGeneralComponents` прибрано. Правило: анімований компонент лежить у теці своєї
сторінки або в `Common/`, префікс `Animated` в імені лишається як позначка. Компоненти з
`newsun2/starter/src/components/Animated/` при перенесенні класти за цим правилом і міняти шлях
імпорту. Чинні проєкти не чіпали.

### 3.6. Темплейт — у git — ✅ виконано 23.10.2026

Темплейт — у [alexSili4/react-ts-app](https://github.com/alexSili4/react-ts-app) (публічний,
Template repository), гілка `main`. Попередня версія темплейту (2024–2025: React 18.2, Vite 5,
`components/common`) лишилась в історії: новий темплейт ліг одним комітом поверх неї, без force.
Нові проєкти — кнопкою «Use this template» або `npx degit alexSili4/react-ts-app <проєкт>`.

### 3.7. Метатеги й пререндер для кожної сторінки — ✅ виконано 23.10.2026

**Чому.** У чистому SPA скребачки соцмереж бачать лише загальні теги з `index.html` — репост
будь-якої сторінки показує ту саму картку, — а роботи без JS бачать порожній `#root`. Серед них
AI-краулери: за дослідженням Vercel і MERJ ([The rise of the AI crawler](https://vercel.com/blog/the-rise-of-the-ai-crawler))
GPTBot і ClaudeBot JavaScript не виконують.

**Що зроблено.** Два рівні, обидва в `npm run build`:

1. **Метатеги** (`scripts/gen-pages.mjs`): `dist/<шлях>.html` — копія `index.html` з title,
   description, canonical і og:\* сторінки; `dist/404.html` з `noindex`. Значення рахує
   `getPageMetaTags` — спільна функція з `PageMeta`, тож сирий HTML і Helmet не розходяться.
   Файли саме `<шлях>.html`, а не `<шлях>/index.html`: тека змусила б nginx, Netlify й GitHub
   Pages редиректити на адресу зі слешем, а canonical у нас без нього.
2. **Пререндер** (`scripts/prerender.mjs`, перенесено з newsun2 з його налагодженою логікою
   очікування мережі й знімка): headless Chrome кладе текст `#root` кожної сторінки (крім
   `noIndex`) у її HTML. Людина знімка не бачить — його ховає inline-стиль `index.html` (3.9), а
   `createRoot` його замінює. Без Chrome збірка падає; свідомо без пререндера — `SKIP_PRERENDER=1`.

Перелік сторінок — `src/utils/getPageMetaMap.ts` (статичні з `pagesMeta` + динамічні, які
дописує проєкт); з нього ж будується `sitemap.xml`. `import-ts.mjs` навчився підміняти імпорти
картинок/шрифтів/SVG порожнім рядком, щоб Node міг виконувати модулі з даними.

Перевірено на тимчасовій сторінці `/about`: сирий HTML `/about` має свої title, canonical,
description (з екрануванням `"` і `&`) і знімок з `h1`; `/not-found` і `404.html` — `noindex` без
знімка; після запуску React теги не задвоюються, на сторінці один `h1`; переходи між сторінками
працюють. Збірка з пререндером двох сторінок — ~15 с.

**Межі.** Знімок — на момент збірки: дані з API оновляться в ньому лише з новою збіркою.
Каталог на тисячі сторінок так не пререндерити — там потрібен SSR. Деплой: на невідому адресу
сервер має віддавати `404.html` зі статусом 404 (README → «Деплой»).

### 3.8. `General/` → `Common/` — ✅ виконано 23.10.2026

**Чому.** Для теки спільних компонентів у React-проєктах усталені назви `common` або `shared`;
«General» — калька, якої не очікують ні розробник, ні AI-агент. З великої — бо всі теки-групи в
`components/` з великої (`MainPage`, `ErrorPage`, `<Name>Page`), а аліас `@CommonComponents` стає в
один ряд із `@MainPageComponents`. Сумісність із newsun2 свідомо не враховували (рішення власника).

**Що зроблено.** `src/components/General/` → `src/components/Common/`, `@GeneralComponents` →
`@CommonComponents` у коді й документації. Слідом — і компоненти з «General» в імені:
`GeneralContainer` → `PageContainer` (контейнер сітки сторінки), `GeneralMain` → `PageMain`
(`<main>` сторінки). Не `Container` і `Main`: `Container` — звичне імʼя styled-компонента в
`*.styled.ts` тих самих тек, а `Main` — секція головної (`MainPage/Main`).

Компоненти з `newsun2/starter/src/components/General/` класти в `Common/`, імпорт
`@GeneralComponents` → `@CommonComponents`, `GeneralContainer` → `PageContainer`,
`GeneralMain` → `PageMain`.

### 3.9. Мінімальний каркас замість перенесеного набору — ✅ виконано 23.10.2026

**Чому.** Перша версія темплейту перенесла зі starter забагато: півтора десятка спільних
компонентів, дюжину хуків, константи навігації, анімацій, регулярних виразів, i18n, HTTP-шар.
Більшість із цього потрібна не кожному проєкту, а темплейт має задавати архітектуру, а не готовий
набір. Решта — описана, а не перенесена.

**Що вирішено (власник, 23.10.2026).** Кодом лишаються: межа помилок чанків, Lenis, модалки,
SEO-конвеєр (метатеги, пререндер, sitemap), зразок секції, заготовки Header і Footer. Лише в
ARCHITECTURE.md: прелоадер, i18n, HTTP, форми, шрифти й решта модулів. Залежності — з першою
потребою. У `constants/` — `theme` і `index` (+ `pagePaths`, `pagesMeta` для SEO-конвеєра).

**Наслідки.**

- Без прелоадера знімок пререндера ховає inline-стиль `[data-prerender] { visibility: hidden }` в
  `index.html` (там само — колір фону до завантаження JS, щоб перший кадр не був білим).
  Роботи, що не виконують JS, CSS теж не застосовують і читають текст.
- Без i18n тексти — у складі сторінки (`<Name>Page/Main` передає їх секціям пропсами).
- Без власних шрифтів — системні (`theme.fontFamily.main`).
- 404 тепер у загальному layout (з хедером і футером); `useHideHeader` прибрано.
- Lenis без власного класу-винятку: блок із власною прокруткою позначається штатним
  `data-lenis-prevent`.

### 3.10. Вміст сторінки — у теці сторінки — ✅ рішення власника 23.10.2026

**Правило.** Усе, що належить одній сторінці — компоненти, картинки, іконки, відео, — лежить у
теці з її іменем, однаковим у всіх місцях: `components/AboutPage/`, `images/AboutPage/`,
`icons/AboutPage/`, `video/AboutPage/`. Спільне для двох і більше сторінок — у `Common/` там
само. Ассет, що знадобився на другій сторінці, переїжджає в `Common/`, як і компонент.

**Чому.** Так уже було влаштовано для компонентів; ассети тепер підкоряються тому самому
правилу. Видно, що належить сторінці, що спільне, і що можна видалити разом зі сторінкою. У
newsun2 теки ассетів названі інакше (`images/main/`, `icons/about/`, постери — одна тека
`images/posters/`), тож при перенесенні звідти класти за новим правилом.

**Що зроблено.** Правило — в ARCHITECTURE.md (розділ 2, «Вміст сторінки — у теці сторінки», і
розділ 9) та AGENTS.md; `src/icons/logo.svg` → `src/icons/Common/logo.svg`. Постери відео — у
`images/<Сторінка>/posters/`. Шрифти — виняток: тека за родиною.
