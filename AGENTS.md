# AGENTS.md

Інструкції для AI-агентів (Claude Code, Codex, Cursor, Copilot) і для людей, які працюють із
цим репозиторієм. Опис проєкту й команд для людей — у [README.md](README.md), обґрунтування
рішень — у [docs/decisions.md](docs/decisions.md).

## Проєкт

SPA на Vite 6.4 + React 18.3 + TypeScript (strict), роутинг — React Router 7 у декларативному
режимі. Стилі — emotion (CSS-in-JS), анімації — framer-motion, плавний скрол — Lenis, тексти — i18next, метатеги — react-helmet-async, HTTP —
axios. Збірка — `dist/`; сервер віддає `index.html` на будь-який шлях.

**Мова:** код, коментарі, тексти комітів і звіти — українською. Відповідати користувачу
українською.

## Команди

```bash
npm run dev         # dev-сервер, http://localhost:5173
npm run lint        # eslint 9 (eslint.config.js), 0 попереджень (типізовані правила: ~хвилина)
npm run typecheck   # tsc для src і vite.config.ts
npm run i18n:check  # повнота перекладів
npm run build       # i18n:check → typecheck → vite build → sitemap
```

**Перед тим як сказати «готово»:** `npm run lint` і `npm run build` проходять без помилок. Зміна
вигляду чи поведінки — ще й перевірка в браузері (`npm run dev`) на 375 px і на десктопі.

## Що НЕ робити без явного запиту

- Не додавати залежності. Потрібна бібліотека — спершу спитати; для типових задач є готові
  рішення (README → «Опційні модулі»).
- Не оновлювати мажорні версії: React (лишаємось на 18 — `docs/decisions.md`), Vite, React
  Router, ESLint, TypeScript.
- Не міняти структуру тек, брейкпоінти й імена токенів теми.
- Не ставити тестовий фреймворк, Tailwind, CSS Modules, SCSS, UI-кіти, другий CSS-in-JS.
- Не видаляти закоментований код і файли без живих посилань: це може бути тимчасово вимкнена
  функціональність. Позначити й спитати.
- Не наповнювати сторінки контентом, текстами чи стилями від себе — лише з макета або завдання.
- Не створювати документацію й звіти, якщо про це не просили.

## Структура

```
src/
├── main.tsx              # провайдери; рендер після i18nReady
├── components/
│   ├── App.tsx           # Lenis + маршрути
│   ├── General/          # спільне: SharedLayout, Header, Footer, PageMeta, ModalWin, ...
│   ├── ErrorPage/        # ErrorScreen, NotFound
│   └── <Name>Page/       # компоненти однієї сторінки (MainPage/ — приклад)
├── constants/            # theme, PagePaths, pagesMeta, navLinks, motion, viewport, ...
├── fonts/  icons/  images/
├── hooks/  utils/        # по файлу на хук/функцію + index.ts
├── i18n/                 # languages.ts, i18n.ts, locales/<мова>/<неймспейс>.json
├── pages/                # <Name>Page.tsx — один файл на сторінку
├── services/             # http.service.ts (база) + app.service.ts (методи API)
├── styles/               # css-фрагменти: typography, containerPadding, srOnly, gridSpan, cappedVw
└── types/                # спільні типи
```

Тека `src/video/` зʼявляється лише в проєктах із відео (README → «Опційні модулі»).

## Компоненти

- Компонент — тека `Name/` з файлами `Name.tsx`, `Name.styled.ts`, `Name.types.ts` (лише якщо є
  пропси) і `index.ts` (`export { default } from './Name';`). Імпорт — через теку:
  `import Name from '@GeneralComponents/Name'`.
- `const Name: FC<IProps> = (...) => ...; export default Name;`. Пропси — `interface IProps`,
  пропси styled-компонентів — `interface IStyled<Name>Props`. Булеві пропси — `isX`, `showX`,
  обробники — `onXClick`.
- Компонент, що не додає нічого, крім одного styled-тега, не заводити: віддати styled напряму
  (`General/Section`, `General/GeneralMain`).
- Спільне для кількох сторінок — у `General/`. Компонент однієї сторінки — у `<Name>Page/`, з
  префіксом секції в імені (`HeroSectionTitle`), бо імена тек у різних сторінках збігаються.
- Окремої теки для анімованих компонентів немає: компонент, що існує заради framer-motion, лежить
  поруч з іншими компонентами своєї сторінки (або в `General/`) з префіксом `Animated` в імені
  (`General/AnimatedModalWin`). У старих проєктах (`newsun2`) такі лежать у `components/Animated/` —
  при перенесенні класти за новим правилом.
- Сторінка (`src/pages/<Name>Page.tsx`) лише збирає: `PageMeta` з `pagesMeta`, `GeneralMain`,
  секції, `Footer`. Логіки там немає.
- Класовий компонент — лише для меж помилок (`ChunkErrorBoundary`).

## Аліаси

`@/` → `src/`, а також по аліасу на групу компонентів: `@GeneralComponents`,
`@ErrorPageComponents`, `@MainPageComponents`. Аліаси оголошені **лише** в `paths` у
`tsconfig.json`: Vite читає їх звідти (`vite-tsconfig-paths`), скрипти — теж (esbuild). У
`vite.config.ts` `resolve.alias` для шляхів проєкту не заводити. Нова тека сторінки → рядок
`@<Name>PageComponents/*` у `paths`. Відносні імпорти — лише всередині теки компонента
(`./Name.styled`).

## Стилі (emotion)

- Усі кольори, шрифти, брейкпоінти, сітка, радіуси, z-index і тривалості — з `theme`
  (`src/constants/theme.ts`). Hex/rgba-літерали, імена шрифтів і px-брейкпоінти в компонентах
  заборонені. Нового значення в темі немає — додати токен (спершу в `ITheme`), не літерал.
- У styled — через пропс: `${({ theme }) => theme.colors.text}`. У `css` з `@emotion/react` —
  імпортом `theme` з `@/constants` (функції-інтерполяції там theme не отримують).
- Mobile-first: `@media (min-width: ${theme.breakpoints.tablet}px)`.
- Типографіка — лише фрагменти з `src/styles/typography.ts` (`${h1}`), не ручні font-size.
- Бічні поля — `GeneralContainer` або `styles/containerPadding.ts`; ширини в колонках —
  `styles/gridSpan.ts`; ширини у `vw`, що не мають рости за `maxWidth`, — `styles/cappedVw.ts`.
- Візуально прихований текст — лише `styles/srOnly.ts` (1px + clip-path, не `scale(0)`).
- Кастомні пропси на `styled(Component)` (`styled(Link)`, `styled(motion.div)`) доходять до
  DOM — фільтрувати через `shouldForwardProp: excludeProps('isActive', ...)` з `@/utils`.
  Для `styled.div` і `styled(motion.*)` цього не треба: працює `isPropValid` з `main.tsx`.
- Вендорні префікси (`-webkit-backdrop-filter` тощо) не писати — їх додає emotion.

## Анімації

- framer-motion: `Variants` і `Transition` — **на рівні модуля** або з хелперів
  `constants/motion.ts` (`getSlideUpVariants`, `getStaggerVariants`, `getEaseTransition` —
  кешують результат). У тілі компонента чи хука не оголошувати, інлайнових
  `animate={{...}}` / `transition={{...}}` не писати.
- Межі `useInView` / `whileInView` — лише з `constants/viewport.ts` (відсотки, лише вертикаль).
  Піксельні `margin: '-250px'` ламаються на вузьких екранах.
- Простий fade/slide при вході у вʼюпорт — атрибут `data-reveal` (+ `data-reveal-delay` у мс)
  без JS: стилі в `GlobalStyles`, клас ставить `useReveal`.
- Стартові анімації першого екрана — після прелоадера: `useLoaderFinished()`.
- `prefers-reduced-motion` обробляється глобально (`GlobalStyles` + `reducedMotion='user'` у
  `main.tsx`) — не вимикати й не дублювати.
- Пружина з рядковими відсотками (`y: '100%'`) і затримкою дає `NaN%`: анімувати числом, одиницю
  додавати в `transformTemplate`.

## Скрол і модалки

- Скрол керує Lenis (`App.tsx`). Блок із власною прокруткою — клас `ClassNames.noneLenisScroll`.
- Блокувати прокрутку — лише `useBodyScrollLock` (лічильник + зупинка Lenis). Не писати в
  `document.body.style` напряму.
- Нова модалка — `ModalWin` + `AnimatedModalWin` + `useModalClose`/`useModalWin`; на
  контейнері: `ref={dialogRef}`, `role='dialog'`, `aria-modal='true'`, `aria-label`,
  `tabIndex={-1}`.

## Роутинг і SEO

- React Router 7, декларативний режим (`BrowserRouter` + `Routes`). Імпорти — з `react-router`
  (пакет `react-router-dom` у v7 лише реекспорт, його не ставимо).
- `<BrowserRouter useTransitions={false}>` — свідомо: під час переходу на ще не завантажену
  сторінку має бути видно `Loader` (Suspense у `SharedLayout`). Не прибирати без рішення власника.
- Шляхи — лише `PagePaths` (`constants/pagePaths.ts`); динамічний параметр —
  `PagePaths.dynamicParam`, читати `useDynamicParam()`. Неіснуючий id —
  `<Navigate to={PagePaths.notFound} replace />`.
- Сторінки ліниві (`lazy` в `App.tsx`). Власний `Suspense` усередині сторінки не ставити —
  `PageLoaderSignal` має спрацювати, коли сторінка відрендерилась повністю.
- Кожна сторінка рендерить `<PageMeta {...pagesMeta[PagePaths.x]} />`. Title разом із
  « | SITE_NAME» ≤ 60 символів, description 150–160. Сторінки поза індексом — `noIndex: true`.
- Рівно один `h1` на сторінку; якщо видимого немає — `HiddenPageTitle`. Секція без видимого
  заголовка — `HiddenSectionTitle`.
- `index.html`: статичний тег, який перевизначає `PageMeta`, має `data-rh="true"`; тег, якого
  `PageMeta` не рендерить, — не має (інакше Helmet його видалить).
- `sitemap.xml` будується з `pagesMeta` (крім `noIndex`) — окремо його не правити.

## Тексти (i18n)

- Текст інтерфейсу — у `src/i18n/locales/<мова>/<неймспейс>.json`, у компоненті `t('a.b')`.
  Ключі типізовані з типової мови (`uk`): неіснуючий ключ — помилка `tsc`.
- Новий неймспейс — JSON у кожній мові + рядок у `src/i18next.d.ts`.
- Мова в `LANGUAGES` одразу доступна відвідувачам — додавати, коли переклад готовий.
  `npm run i18n:check` перевіряє файли, ключі, порожні значення й плейсхолдери `{{…}}`.
- Літерали лишаються лише там, де хуків немає (класовий `ChunkErrorBoundary`).

## Доступність

- SVG з `@/icons/*.svg?react` і іконки react-icons — `aria-hidden` за замовчуванням (налаштовано
  в `vite.config.ts` і `main.tsx`). Імʼя дає посилання/кнопка: `aria-label`. Змістовна іконка —
  `role='img'` + `aria-label` точково.
- Контентні зображення — змістовний `alt`; декор — `alt=''`. Головне зображення першого екрана —
  `<img>`/`<picture>` з `fetchpriority='high'`, не `background-image`.
- Кнопка — `<button type='button'>`, перехід — `Link`/`<a>`. Після кліку мишею фокус-стилі
  прибирає `makeBlur(e.currentTarget)`.
- Один і той самий інлайновий SVG з `id` двічі на сторінці — id через `useId`.

## API

- Методи — у класі `AppService` (`services/app.service.ts`) через `this.get/post/put/patch/delete`
  базового `HttpService`. Другий аргумент `withAuth` — `false` для публічних ендпоінтів.
- Адреса бекенду — `VITE_API_URL` у `.env` (порожньо — той самий домен). Секретів у `VITE_*` не
  тримати: вони потрапляють у бандл.
- Типи запитів і відповідей — `src/types/<домен>.types.ts`. Помилки валідації (422) —
  перетворювати на помилки полів форми в сервісі, а не в компоненті.

## Код

- TypeScript strict, без `any` і без `// @ts-ignore`. `eslint-disable` — лише точково, з
  поясненням.
- Хуки й утиліти — по одній на файл, `export default`, експорт із барелю `index.ts`. Виклик на
  рівні модуля в такому файлі (createContext, new Map) — з `/* @__PURE__ */`, інакше модуль
  осяде у вхідному чанку.
- Барель `@/constants` імпортує майже весь проєкт — у нього лише легкі константи. Важкі дані
  (кейси, каталоги) — окремими модулями з прямим імпортом.
- Константи-набори — `const enum` (`PagePaths`, `ClassNames`, `Links`); магічні числа — іменовані
  константи з поясненням.
- Коментарі пояснюють **чому**, а не що робить код. Без коментарів-наративів («додав…», «тепер…»).

## Шрифти

- Лише `woff2`, у `src/fonts/<родина>/`, експорт у `src/fonts/index.ts`, `@font-face` у
  `GlobalStyles` (без `local()`, з `font-display: swap`), імʼя родини — `theme.fontFamily`.
- Сабсет — під мови сайту, з кирилицею й латиницею (Basic Latin, Latin-1, Latin Extended-A, а для
  румунської ще Latin Extended-B). Перед обрізанням перевірити, що всі символи текстів сайту
  входять у діапазон.
- Курсив — лише справжнім файлом (`font-style: italic`), без синтезу з Regular.

## Збірка

- Вендорні чанки (`getVendorChunk` у `vite.config.ts`): emotion свідомо в одному чанку з React, а
  `commonjsHelpers` — окремим листовим чанком. Розділення ламає граф імпортів («Cannot access …
  before initialization» ще до рендеру). Загального vendor-чанка не заводити.
- Lottie JSON — у `public/` і через `fetch(getPublicUrl(...))`, не `import('*.json')`: інакше
  мегабайти анімації осідають у бандлі. Картинки, відео й шрифти — у `src/` імпортом (Vite додає
  хеш в імʼя, кеш не залипає).
