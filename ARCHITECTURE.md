# Архітектура

Як влаштований фронтенд і куди що класти. Документ описує **повну** структуру проєкту, зокрема
теки, яких у темплейті ще немає: темплейт містить лише каркас, а решта створюється з першим
файлом — за правилами нижче. Якщо задачі немає в цьому документі, спершу домовитись, потім
дописати сюди правило.

Команди й деплой — [README.md](README.md). Короткі правила для AI-агентів — [AGENTS.md](AGENTS.md).
Чому рішення саме такі — [docs/decisions.md](docs/decisions.md).

---

## 1. Стек

Встановлене в темплейті:

| Призначення     | Пакет                                                   | Версія |
| --------------- | ------------------------------------------------------- | ------ |
| UI              | `react`, `react-dom`                                    | 18.3   |
| Роутинг         | `react-router` (декларативний режим)                    | 7.18   |
| Стилі           | `@emotion/react`, `@emotion/styled`                     | 11     |
| Метатеги        | `react-helmet-async`                                    | 3      |
| Скидання стилів | `modern-normalize`                                      | 2      |
| Збірка          | `vite`, `@vitejs/plugin-react`, `vite-tsconfig-paths`  | 6.4    |
| Мова            | `typescript` (strict)                                   | 5.4    |
| Лінтер          | `eslint` 9 (flat config), `typescript-eslint` 8, плагіни react, react-hooks, jsx-a11y, react-refresh | 9.39 |

Додається **з першою потребою — саме ці пакети**, не альтернативи:

| Задача            | Пакет                                                                                    |
| ----------------- | ---------------------------------------------------------------------------------------- |
| Анімації          | `framer-motion@^11` + `@emotion/is-prop-valid@^1` (див. 8)                               |
| SVG як компоненти | `vite-plugin-svgr@^4` (dev; див. 9)                                                      |
| Плавний скрол     | `lenis@^1` (див. 8)                                                                      |
| HTTP-запити       | `axios@^1`                                                                               |
| Форми             | `react-hook-form@^7`                                                                     |
| Локалізація       | `i18next@^25`, `react-i18next@^15`, `i18next-browser-languagedetector@^8`, `i18next-resources-to-backend@^1` |
| Іконки з наборів  | `react-icons@^5`                                                                         |
| Слайдери          | `swiper@^11`                                                                             |
| Lottie            | `lottie-react@^2`                                                                        |
| Біжучий рядок     | `react-fast-marquee@^1`                                                                  |

Не використовуємо: Tailwind, CSS Modules, SCSS, styled-components та інший другий CSS-in-JS,
UI-кіти (MUI, Chakra, Ant), бібліотеки стану (Redux, Zustand, MobX) — без окремого рішення.

---

## 2. Структура

```
├── index.html            # метатеги за замовчуванням, #root, #modal-root
├── public/               # файли «як є»: favicon, robots.txt, og-картинки, Lottie JSON
├── scripts/              # кроки збірки: HTML сторінок, пререндер, sitemap
└── src/
    ├── main.tsx          # провайдери й рендер
    ├── vite-env.d.ts     # типи середовища (Vite, змінні .env)
    ├── components/
    │   ├── App.tsx       # маршрути
    │   ├── Common/       # спільне для кількох сторінок
    │   └── <Name>Page/   # компоненти однієї сторінки
    ├── pages/            # <Name>Page.tsx — збірка сторінки
    ├── constants/
    ├── styles/
    ├── hooks/
    ├── utils/
    ├── types/
    ├── icons/            # ┐
    ├── images/           # ├ Common/, <Name>Page/ — як у components/
    ├── video/            # ┘
    ├── fonts/
    ├── services/
    └── i18n/
```

| Тека                    | У темплейті                    | Що там                                                    |
| ----------------------- | ------------------------------ | --------------------------------------------------------- |
| `components/Common`     | є                              | layout, хедер, футер, контейнер, мета, модалка, лоадер, межа помилок |
| `components/<Name>Page` | є (`MainPage`, `NotFoundPage`) | компоненти однієї сторінки                                 |
| `pages`                 | є                              | по файлу на сторінку                                       |
| `constants`             | є                              | `theme`, `pagePaths`, `pagesMeta`, `index`                 |
| `hooks`                 | є                              | `useModal`, `index.ts`                                     |
| `utils`                 | є                              | метатеги сторінок, автоперезавантаження після деплою, `index.ts` |
| `types`                 | є                              | `hooks.types.ts`                                           |
| `styles`                | за потреби                     | спільні css-фрагменти                                      |
| `icons`, `images`, `video` | за потреби                  | SVG, растр і відео — по теках сторінок                     |
| `fonts`                 | за потреби                     | шрифти — по теках родин                                    |
| `services`              | за потреби                     | HTTP-шар                                                   |
| `i18n`                  | за потреби                     | переклади                                                  |

### Вміст сторінки — у теці сторінки

Усе, що належить одній сторінці, лежить у теці з її іменем — однаковим у всіх місцях:
компоненти, картинки, іконки, відео. Спільне для двох і більше сторінок — у теці `Common/` там
само.

```
src/
├── components/
│   ├── Common/          Header/, Footer/, …
│   └── AboutPage/       HeroSection/, TeamSection/, …
├── images/
│   ├── Common/          фото для кількох сторінок
│   └── AboutPage/       hero-bg.webp, team/anna.webp, …
├── icons/
│   ├── Common/          logo.svg, arrow.svg
│   └── AboutPage/       values-star.svg
└── video/
    └── AboutPage/       hero-loop.mp4
```

- Імʼя теки — точно як у `components/` і як файл сторінки в `pages/`: `Common`, `MainPage`,
  `NotFoundPage`, `<Name>Page`.
- Ассет, що знадобився на другій сторінці, переїжджає в `Common/` — так само, як компонент.
- Усередині теки сторінки — підтеки секцій, коли файлів багато (`images/AboutPage/team/`).
- Файли ассетів — kebab-case: `hero-bg.webp`, `arrow-right.svg`.
- Шрифти — виняток: вони не належать сторінці, тека — за родиною (`fonts/inter/`).

### Напрям залежностей

```
pages  →  components  →  hooks · styles · utils · constants · types
                └──────→  services · i18n
```

- Сторінки імпортують компоненти, не навпаки.
- `Common/` не імпортує компоненти сторінок. Компонент сторінки може імпортувати `Common/` і
  сусідні компоненти своєї сторінки.
- `utils/`, `constants/` (крім `theme`), `types/`, `services/` — без JSX.
- `constants/` і `utils/`, які імпортує `getPageMetaMap`, — без `window`/`document` на рівні
  модуля: їх виконує Node під час збірки (метатеги, пререндер, sitemap).

### Аліаси

Оголошені **лише** в `paths` у `tsconfig.json`; Vite читає їх звідти (`vite-tsconfig-paths`),
скрипти — теж.

| Аліас                        | Тека                                                       |
| ---------------------------- | ---------------------------------------------------------- |
| `@/*`                        | `src/*`                                                    |
| `@CommonComponents/*`        | `src/components/Common/*`                                  |
| `@<Name>PageComponents/*`    | `src/components/<Name>Page/*` — рядок на кожну сторінку з компонентами |

Відносні імпорти — лише всередині теки компонента (`./Name.styled`).

---

## 3. Компоненти

### Тека компонента

```
HeroSection/
├── HeroSection.tsx         # розмітка й логіка; export default
├── HeroSection.styled.ts   # styled-компоненти
├── HeroSection.types.ts    # IProps, IStyled<Name>Props — лише якщо є пропси
└── index.ts                # export { default } from './HeroSection';
```

Зразок — `src/components/MainPage/HeroSection`. Імпорт — завжди через теку:
`import HeroSection from '@MainPageComponents/HeroSection'`.

```tsx
const HeroSection: FC<IProps> = ({ title, subtitle }) => { ... };
export default HeroSection;
```

- Пропси — `interface IProps`; пропси styled-компонентів — `interface IStyled<Name>Props`.
- Булеві пропси — `isX`, `showX`; обробники — `onXClick`, `onXChange`.
- Компонент, що є лише одним styled-тегом, — тека з `.styled.ts` і `index.ts`, який віддає
  styled напряму (`Common/PageContainer`). Порожніх обгорток (`styled.section` без стилів) не
  заводити — звичайний тег.
- Класовий компонент — лише для меж помилок (`Common/ChunkErrorBoundary`).

### Куди класти

| Компонент                          | Тека              | Імʼя                                   |
| ---------------------------------- | ----------------- | -------------------------------------- |
| використовується на 2+ сторінках   | `Common/`         | за призначенням: `PillButton`, `Breadcrumbs` |
| секція сторінки                    | `<Name>Page/`     | `<Секція>Section`: `HeroSection`        |
| частина секції                     | `<Name>Page/`     | з префіксом секції: `HeroSectionTitle`  |
| склад сторінки (порядок секцій)    | `<Name>Page/Main` | `Main`                                  |
| існує заради анімації              | там само, що й інші | з префіксом `Animated`: `AnimatedTitle` |

Компонент сторінки, що знадобився на другій сторінці, переїжджає в `Common/`. Префікс секції в
іменах дрібніших компонентів — бо імена тек у різних сторінках збігаються (`HeroSection`).

### Що є в `Common/`

| Компонент            | Призначення                                                                 |
| -------------------- | --------------------------------------------------------------------------- |
| `SharedLayout`       | каркас кожної сторінки: `Header`, `<main>` зі сторінкою (`Suspense` + `Loader`), `Footer`; межа помилок над усім |
| `Header`, `Footer`   | заготовки — наповнити з макета                                              |
| `PageContainer`      | контейнер сітки: `maxWidth` і бічні поля з теми                             |
| `PageMeta`           | метатеги сторінки (Helmet)                                                  |
| `GlobalStyles`       | скидання, базові стилі, `@font-face`, `prefers-reduced-motion`              |
| `Loader`             | індикатор завантаження сторінки                                             |
| `ChunkErrorBoundary` | після деплою відкрита вкладка один раз тихо перезавантажується замість білого екрана |
| `ModalWin`           | модалка: портал у `#modal-root`, фон, діалог; поведінка — `useModal`        |

---

## 4. Сторінки й маршрути

1. Шлях — у `constants/pagePaths.ts` (`const enum PagePaths`). Динамічний параметр —
   `PagePaths.dynamicParam`: маршрут `` `${PagePaths.projects}/:${PagePaths.dynamicParam}` ``.
2. Метадані — у `constants/pagesMeta.ts`: `title` (разом із « | SITE_NAME» ≤ 60 символів),
   `description` (150–160), за потреби `image` (абсолютна адреса з `public/`) і `noIndex`.
3. Файл `src/pages/<Name>Page.tsx` — лише метатеги й склад сторінки; хедер, `<main>` і футер дає
   `SharedLayout`:

   ```tsx
   const AboutPage: FC = () => (
     <>
       <PageMeta {...pagesMeta[PagePaths.about]} />
       <Main />
     </>
   );
   ```

4. Маршрут в `App.tsx`: `lazyPage(() => import('@/pages/<Name>Page'))` (не голий `lazy` — див. 7)
   і `<Route>`.
5. Тека `src/components/<Name>Page/` і аліас `@<Name>PageComponents/*` у `tsconfig.json`.
6. Динамічна сторінка (`/projects/:id`) — ще й запис у `src/utils/getPageMetaMap.ts`, інакше вона
   не отримає метатегів у сирому HTML, знімка й місця в sitemap. Неіснуючий id —
   `<Navigate to={PagePaths.notFound} replace />`.

Правила сторінки:

- рівно один `<h1>`; якщо видимого немає — візуально прихований (1px + `clip-path`, не
  `scale(0)`);
- рендериться без дій користувача (пререндер не клікає);
- власний `Suspense` усередині сторінки не ставити — `Loader` у `SharedLayout` уже є;
- роутинг — React Router 7, імпорти з `react-router`; `<BrowserRouter useTransitions={false}>` у
  `main.tsx` свідомо: під час переходу видно `Loader`.

---

## 5. Константи

| Файл                      | Є     | Що                                                                    |
| ------------------------- | ----- | --------------------------------------------------------------------- |
| `theme.ts`                | так   | дизайн-токени: кольори, шрифти, брейкпоінти, сітка, радіуси, z-index, тривалості |
| `pagePaths.ts`            | так   | `const enum PagePaths` — усі шляхи                                    |
| `pagesMeta.ts`            | так   | `SITE_NAME`, `SITE_URL` і метадані сторінок                           |
| `index.ts`                | так   | барель легких констант                                                |
| `navLinks.ts`             | ні    | пункти навігації хедера/футера                                        |
| `links.ts`                | ні    | `const enum Links` — зовнішні посилання (соцмережі, документи)        |
| `contacts.ts`             | ні    | телефони, пошта, адреса — одне джерело для хедера й футера            |
| `motion.ts`, `viewport.ts`| ні    | спільні варіанти framer-motion і межі `whileInView` (див. 8)          |
| `formErrorMessages.ts`, `regExp.ts` | ні | тексти помилок і регулярні вирази форм                         |
| `<domain>.ts`, `<domain>/` | ні   | дані: `projects/<id>.ts` + `projects/index.ts`                        |

- Набір рядків — `const enum` з PascalCase-іменем (`PagePaths`, `Links`); обʼєкт — camelCase.
- Барель `index.ts` імпортують майже всі файли, тож у нього — **лише легкі** константи. Дані
  (кейси, каталоги, довгі тексти) імпортувати напряму: `'@/constants/projects'`. Інакше кожен
  файл протягне їх у свій чанк.
- Магічні числа в компонентах — іменовані константи з коментарем «чому саме так».

---

## 6. Стилі

- Лише emotion: `styled` у `Name.styled.ts`, `css` для фрагментів. Значення — **лише з теми**:
  hex/rgba, імена шрифтів, px-брейкпоінти й z-index літералами не писати. Нового значення в темі
  немає — додати токен (спершу в `ITheme`), а не літерал.
- У styled — через пропс: `${({ theme }) => theme.colors.text}`. У `css` з `@emotion/react` —
  імпортом `theme` з `@/constants` (функції-інтерполяції там theme не отримують).
- Mobile-first: `@media (min-width: ${theme.breakpoints.tablet}px)`.
- Відступи — `theme.spacing(n)` (крок 4 px).
- Ховер і фокус — `&:is(:hover, :focus-visible)`, не `:focus`.
- Вендорні префікси не писати — їх додає emotion.
- Кастомні пропси на `styled(Component)` (`styled(Link)`) доходять до DOM — фільтрувати через
  `shouldForwardProp`.

**Типографіка** — у темі: `theme.fontSize` (шкала з макета, імена як у Figma) і
`theme.lineHeight`. Компонент пише `font-size: ${({ theme }) => theme.fontSize.h1}`, ручних px
немає. Новий кегль — новий ключ у шкалі.

**`styles/`** (за потреби) — css-фрагменти, що повторюються в кількох компонентах:
`styles/<name>.ts` з `` export const <name> = css`...` ``, підключення — `${srOnly}`. Кандидати:
візуально прихований текст (1px + `clip-path`), ширина в колонках сітки, набір стилів
кнопки. Один компонент — фрагмент лишається в його `.styled.ts`.

---

## 7. Хуки, утиліти, типи

**Хуки** — `src/hooks/use<Name>.ts`, по хуку на файл, `export default`, експорт із барелю
`hooks/index.ts`. Типи параметрів і результату — `types/hooks.types.ts`
(`IUse<Name>Props`, `IUse<Name>`). Є:

- `useModal` — усе для модалки: Escape, клік по фону, блокування скролу, фокус
  усередині діалогу й повернення фокусу після закриття.

**Утиліти** — `src/utils/<name>.ts`: функція або тісно повʼязана група функцій на файл, без
React-компонентів, експорт із барелю `utils/index.ts`. Імена — дієсловом: `get…`, `is…`,
`format…`. Скрипти збірки (Node) імпортують файли напряму, не барель. Є:

- `getPageMetaTags`, `getPageMetaMap` — метатеги й перелік сторінок (див. 10);
- `chunkReload` — `lazyPage` і прапорець для `ChunkErrorBoundary`: після деплою вкладка, відкрита
  раніше, один раз тихо перезавантажується замість білого екрана.

У хуках і утилітах з барелів виклик на рівні модуля (`createContext`, `new Map`) — з
`/* @__PURE__ */`, інакше модуль осідає у вхідному чанку.

**Типи** — `src/types/<domain>.types.ts`: доменні типи (`projects.types.ts`), типи хуків
(`hooks.types.ts`). Типи пропсів — поруч із компонентом (`Name.types.ts`). Інтерфейси — з
префіксом `I`, обʼєднання й аліаси — `type`.

**Стан.** Стан сторінки — у компонентах і хуках. Спільний для кількох гілок дерева — React
Context: провайдер у `Common/<Name>Provider`, хук доступу `use<Name>` у `hooks/`.

---

## 8. Анімації, скрол, модалки

**CSS.** Переходи й `@keyframes` — з тривалостями й easing із `theme.transitionDurationAndFunc`.
`prefers-reduced-motion` обробляється глобально в `GlobalStyles` — не дублювати. Виняток —
нескінченна анімація, яка після глобального правила застигла б у непридатному стані (`Loader`).

**framer-motion** (коли знадобиться складна анімація). Разом із ним — `<MotionConfig
isValidProp={isPropValid} reducedMotion='user'>` у `main.tsx`: без `isValidProp` кастомні пропси
`styled(motion.*)` доходять до DOM, без `reducedMotion` анімації ігнорують системне «зменшити
рух». `Variants` і `Transition` — на рівні модуля, не в тілі компонента (інакше
перестворюються щорендер); спільні — у `constants/motion.ts`. Інлайнових
`animate={{...}}` / `transition={{...}}` не писати. Межі `useInView` / `whileInView` — у
відсотках і лише по вертикалі (`constants/viewport.ts`): піксельні `margin` ламаються на вузьких
екранах.

**Скрол.** Нативний. Блокувати прокрутку сторінки — лише через `useModal` (стек модалок), не
`document.body.style` напряму.

Прокрутки вгору при переході між сторінками в каркасі немає: браузер лишає позицію
попередньої сторінки. Коли знадобиться — хук `useScrollToTop` з викликом в `App.tsx`:
`history.scrollRestoration = 'manual'` один раз і `window.scrollTo(0, 0)` у `useLayoutEffect` на
зміну `pathname` ([useScrollToTop.ts](https://github.com/alexSili4/react-ts-app/blob/0516229/src/hooks/useScrollToTop.ts)).

**Плавний скрол (Lenis)** — коли його вимагає дизайн. Точки інтеграції (робоча версія —
[App.tsx](https://github.com/alexSili4/react-ts-app/blob/02c93ac/src/components/App.tsx) і [useModal.ts](https://github.com/alexSili4/react-ts-app/blob/02c93ac/src/hooks/useModal.ts)
з Lenis; `useModal` там ще з лічильником замість стека):

- `App.tsx`: усе дерево в `<ReactLenis root ref={lenisRef} options={{ virtualScroll }}>`;
  `virtualScroll` пропускає touch-події з `cancelable: false`, поки Lenis зупинений, — інакше Chrome
  сипле в консоль `[Intervention]`;
- `useModal`: `lenis.stop()` разом із блокуванням скролу й `lenis.start()`, коли стек модалок
  спорожнів (`useLenis()` з `lenis/react`);
- блок із власною прокруткою (діалог модалки, горизонтальна стрічка) — атрибут
  `data-lenis-prevent`;
- `useScrollToTop` — ще й `lenis.scrollTo(0, { immediate: true, force: true })`: зупинений чи
  заблокований Lenis без `force` виклик ігнорує.

**Модалки.** `<ModalWin isOpen onClose ariaLabel>{вміст}</ModalWin>` — портал, фон, діалог з
`role='dialog'`, `aria-modal`, фокусом і закриттям. Модалка з власною розміткою (меню на весь
екран) — свій компонент на `useModal` з тими самими атрибутами діалогу.

---

## 9. Ассети

| Що              | Де                          | Як                                                                  |
| --------------- | --------------------------- | ------------------------------------------------------------------- |
| SVG-іконки      | `src/icons/<Сторінка>/`     | `import Icon from '@/icons/AboutPage/star.svg?react'` (SVGR, див. нижче); змістовній — `role='img'` + `aria-label` |
| Картинки        | `src/images/<Сторінка>/`    | webp/jpg/png імпортом (Vite додає хеш); контентним — змістовний `alt`, декору — `alt=''` |
| Відео           | `src/video/<Сторінка>/`     | mp4 імпортом; постер — перший кадр, `.webp` з тим самим імʼям у `src/images/<Сторінка>/posters/` |
| Шрифти          | `src/fonts/<родина>/`       | лише `woff2`; експорт у `fonts/index.ts`, `@font-face` у `GlobalStyles` (без `local()`, `font-display: swap`), імʼя родини — `theme.fontFamily` |
| Файли «як є»    | `public/`                   | favicon, `robots.txt`, og-картинки (JPG 1200×630), Lottie JSON — через `fetch`, не `import` |

- Головне зображення першого екрана — `<img>`/`<picture>` з `fetchpriority='high'`, не
  `background-image`.
- Шрифти — сабсет під мови сайту (кирилиця + Basic Latin, Latin-1, Latin Extended-A); перед
  обрізанням перевірити, що всі символи текстів входять у діапазон. Курсив — лише справжнім
  файлом, без синтезу.
- Один інлайновий SVG з `id` двічі на сторінці — id через `useId`.

**SVG як компоненти** (перша іконка в проєкті): `npm i -D vite-plugin-svgr@^4`, у
`vite.config.ts` — `svgr({ svgrOptions: { svgProps: { 'aria-hidden': 'true' } } })` після
`react()`, у `vite-env.d.ts` — `/// <reference types="vite-plugin-svgr/client" />`. `aria-hidden`
за замовчуванням — бо іконки здебільшого декор або всередині вже названих посилань і кнопок;
без нього Chrome віддає кожну окремим безіменним «зображенням».

---

## 10. Метатеги, пререндер, sitemap

- Перелік сторінок для збірки — `src/utils/getPageMetaMap.ts` (статичні з `pagesMeta` +
  динамічні).
- Значення тегів рахує лише `getPageMetaTags`: її беруть і `PageMeta` (у браузері), і
  `scripts/gen-pages.mjs` (сирий HTML). Новий тег у `PageMeta` — той самий тег у `renderMetaTags`
  у `gen-pages.mjs`.
- Збірка: `vite build` → `gen-pages` (`dist/<шлях>.html` з метатегами сторінки + `404.html`) →
  `prerender` (headless Chrome кладе текст сторінки в обгортку `[data-prerender]`, яку
  inline-стиль `index.html` ховає від людей) → `sitemap`.
- Знімок — лише для роботів, `createRoot` його замінює. Не перетворювати на гідрацію
  (`hydrateRoot`) без окремого рішення: код не готовий до SSR.

---

## 11. Модулі за потреби

Перевірені реалізації — у `newsun2/starter` (локальна копія власника,
`D:\work\sunAgency\newsun2\starter`; у репозиторії проєкту її немає — нема доступу, спитати, а
не відтворювати з памʼяті). Там спільна тека зветься
`General/` (аліас `@GeneralComponents`), `PageContainer` — `GeneralContainer`, ассети лежать
інакше (`images/main/`, постери — одна тека `images/posters/`): при перенесенні класти за
правилами цього документа й міняти імпорти. Частина файлів, уже адаптованих під темплейт, — в
історії репозиторію темплейту: `https://github.com/alexSili4/react-ts-app/blob/52b324d/<шлях>` (у проєкті, створеному з
темплейту, цієї історії немає — лише за посиланням).

### Дані з API

`axios` → `src/services/http.service.ts` (базовий клас: адреса, версія API, токен) +
`src/services/app.service.ts` (`class AppService extends HttpService` з методами API). Адреса —
`VITE_API_URL` у `.env` (+ `.env.example` і тип у `vite-env.d.ts`); у `VITE_*` — жодних
секретів. Типи запитів і відповідей — `types/<домен>.types.ts`; помилки валідації (422)
перетворювати на помилки полів у сервісі. Адаптований файл:
[http.service.ts](https://github.com/alexSili4/react-ts-app/blob/52b324d/src/services/http.service.ts).

### Форми

`react-hook-form`. Тексти помилок — `constants/formErrorMessages.ts`, регулярні вирази —
`constants/regExp.ts`. Зразок — `newsun2`: `ContactsPage/HeroSectionContactsForm*`,
`utils/phoneFormatter.ts`.

### Тексти й локалізація

Без i18n тексти лежать у складі сторінки (`<Name>Page/Main` передає їх секціям пропсами) або,
якщо їх багато, у `constants/<сторінка>.ts`. Літерали глибоко в дрібних компонентах — ні.

З i18n (дві й більше мов або план на них):

```
src/i18n/
├── languages.ts            # LANGUAGES, DEFAULT_LOCALE, тип Locale
├── i18n.ts                 # ініціалізація; типова мова в бандлі, решта — лінивими чанками
└── locales/<мова>/<неймспейс>.json
src/i18next.d.ts            # типи ключів з типової мови
scripts/check-i18n.mjs      # повнота перекладів — перший крок npm run build
```

`main.tsx` рендерить після `i18nReady`; у компонентах — `t('a.b')`, ключі типізовані. Мову
додавати в `LANGUAGES`, коли переклад готовий. Адаптовані файли — [i18n.ts](https://github.com/alexSili4/react-ts-app/blob/52b324d/src/i18n/i18n.ts),
[languages.ts](https://github.com/alexSili4/react-ts-app/blob/52b324d/src/i18n/languages.ts), [i18next.d.ts](https://github.com/alexSili4/react-ts-app/blob/52b324d/src/i18next.d.ts),
[check-i18n.mjs](https://github.com/alexSili4/react-ts-app/blob/52b324d/scripts/check-i18n.mjs), перемикач — `newsun2`:
`General/LangsMenu`, `hooks/useLanguage.ts`.

### Інше з `newsun2/starter`

| Модуль              | Пакет                  | Файли                                                                    |
| ------------------- | ---------------------- | ------------------------------------------------------------------------ |
| Відео з автоплеєм   | —                      | `General/AutoplayVideo`, `hooks/useVideo.ts`; `import.meta.glob` постерів у `AutoplayVideo` змінити на `images/*/posters/*.webp` |
| Слайдер             | `swiper`               | `src/styles/swiper.css` (`@layer swiper`), `General/SwiperNavButtons`, `hooks/useSwiperEdges.ts` |
| Lottie              | `lottie-react`         | `General/InViewLottie`, `hooks/useLazyLottie.ts`, `hooks/useLottieData.ts`; аліас `lottie-web` → `lottie-web/build/player/lottie_svg` у `vite.config.ts` |
| Біжучий рядок       | `react-fast-marquee`   | `MainPage/ClientsSectionMarquee`                                         |
| Прокрутка вгору при переході | —             | див. 8, «Скрол»                                                          |
| Медіазапити в JS    | —                      | `hooks/useMediaQuery.ts`                                                 |
| Поява у вʼюпорті без JS-анімацій | —         | `hooks/useReveal.ts` + блок `[data-reveal]` у `GlobalStyles`             |
| Прелоадер           | —                      | розмітка — `newsun2/resources/views/react_app.php`, сигнал готовності — `hooks/useLoaderFinished.ts` |

Іконки з `react-icons` — з `<IconContext.Provider value={{ attr: { 'aria-hidden': true } }}>` у
`main.tsx`, як SVG з `icons/`.

---

## 12. Іменування — зведення

| Що                              | Як                                   | Приклад                        |
| ------------------------------- | ------------------------------------ | ------------------------------ |
| Тека й файл компонента          | PascalCase                           | `HeroSection/HeroSection.tsx`  |
| Тека групи компонентів          | PascalCase, як файл сторінки         | `Common/`, `MainPage/`         |
| Тека ассетів сторінки           | як група компонентів                 | `images/MainPage/`, `icons/Common/` |
| Файл ассета                     | kebab-case                           | `hero-bg.webp`, `arrow-right.svg` |
| Сторінка                        | `<Name>Page.tsx`                     | `ContactsPage.tsx`             |
| Хук                             | `use<Name>.ts`                       | `useModal.ts`                  |
| Утиліта                         | camelCase, дієслово                  | `getPageMetaTags.ts`           |
| Константи                       | camelCase-файл                       | `pagesMeta.ts`                 |
| Набір рядків                    | `const enum`, PascalCase             | `PagePaths.root`               |
| Типи                            | `<domain>.types.ts`, `I<Name>`       | `IProps`, `IPageMetaData`      |
| styled-компонент                | за роллю                             | `Title`, `Content`, `StyledHeader` (коли збігається з HTML-тегом) |
| Булевий проп / стан             | `is…`, `show…`, `has…`               | `isOpen`, `showMenu`           |
| Обробник                        | `on<Що><Подія>`                      | `onCloseBtnClick`              |

Код, коментарі й тексти — українською.

---

## 13. Коментарі

Коментуємо **лише неочевидне**. Коментар до очевидного заборонений.

Коментар потрібен, коли читач коду сам не здогадається:

- **чому** зроблено саме так, а не простішим способом (`useTransitions={false}`, стек замість
  прапорця в `useModal`);
- про обмеження й пастки, які не видно з коду (модуль виконує Node під час збірки; без цього
  атрибута Helmet задвоїть теги);
- про звʼязок між файлами, який треба тримати синхронно (`PageMeta` ↔ `gen-pages.mjs`);
- звідки взялось магічне число.

Заборонено:

- переказувати, що робить код, чи повторювати імʼя функції, компонента, змінної;
- «заготовка», «зразок», «тут буде…» — для цього є ARCHITECTURE.md і README;
- історія змін: «раніше було…», «додав…», «тепер…» — для цього є git;
- розділові й декоративні коментарі; закоментований код, якщо він не вимкнений свідомо (тоді —
  з поясненням, чому й до коли).

Якщо без коментаря незрозуміло, **що** робить код, — спершу перейменувати або спростити код.
Коментар коротший за код, який пояснює; документаційний текст — у ARCHITECTURE.md, не в коді.
