# AGENTS.md

Інструкції для AI-агентів (Claude Code, Codex, Cursor, Copilot) і для людей, які працюють із
цим репозиторієм.

**Перед будь-якою зміною прочитати [ARCHITECTURE.md](ARCHITECTURE.md)** — там структура, куди що
класти, як оформлювати компоненти, сторінки, стилі, хуки й модулі, яких ще немає. Нова тека чи
файл — за його правилами; задачі немає в ARCHITECTURE.md — спершу спитати.

## Проєкт

SPA на Vite 6.4 + React 18.3 + TypeScript (strict), React Router 7 (декларативний режим),
emotion, framer-motion, Lenis, react-helmet-async. Збірка — `dist/` з окремим HTML і знімком
контенту на кожну сторінку.

**Мова:** код, коментарі, тексти комітів і звіти — українською. Відповідати користувачу
українською.

## Команди

```bash
npm run dev         # dev-сервер, http://localhost:5173
npm run lint        # eslint 9 (eslint.config.js), 0 попереджень
npm run typecheck   # tsc для src і vite.config.ts
npm run build       # typecheck → vite build → pages → prerender → sitemap
```

Збірці потрібен Google Chrome (пререндер). Немає Chrome — `SKIP_PRERENDER=1` для перевірки
збірки, але не для деплою.

**Перед тим як сказати «готово»:** `npm run lint` і `npm run build` проходять без помилок. Зміна
вигляду чи поведінки — ще й перевірка в браузері (`npm run dev`) на 375 px і на десктопі.

## Що НЕ робити без явного запиту

- Не додавати залежності. Дозволений перелік і версії — ARCHITECTURE.md, розділ 1; навіть із
  нього пакет ставиться, лише коли задача його потребує.
- Не створювати теки й файли «про запас»: тека зʼявляється з першим справжнім файлом.
- Не оновлювати мажорні версії (React лишається на 18 — `docs/decisions.md`), Vite, React Router,
  ESLint, TypeScript.
- Не міняти структуру тек, аліаси, брейкпоінти й імена токенів теми.
- Не ставити тестовий фреймворк, Tailwind, CSS Modules, SCSS, UI-кіти, другий CSS-in-JS,
  бібліотеки стану.
- Не видаляти закоментований код і файли без живих посилань: це може бути тимчасово вимкнена
  функціональність. Позначити й спитати.
- Не наповнювати сторінки контентом, текстами чи стилями від себе — лише з макета або завдання.

## Інваріанти, які легко зламати

- Кольори, шрифти, брейкпоінти, z-index, тривалості — лише з `theme`; літералів у компонентах
  немає.
- Аліаси — лише в `paths` у `tsconfig.json`; `resolve.alias` у `vite.config.ts` для шляхів проєкту
  не заводити.
- Варіанти framer-motion — на рівні модуля, не в тілі компонента; інлайнових
  `animate={{...}}` / `transition={{...}}` немає.
- Блокування скролу — лише `useBodyScrollLock`; блок із власною прокруткою —
  `data-lenis-prevent`.
- Кожна сторінка: `PageMeta` з `pagesMeta`, рівно один `h1`, рендер без дій користувача. Динамічна
  сторінка — запис у `src/utils/getPageMetaMap.ts`.
- Значення метатегів — лише через `getPageMetaTags`; новий тег у `PageMeta` — той самий тег у
  `scripts/gen-pages.mjs`.
- `<BrowserRouter useTransitions={false}>` — свідомо (видно `Loader` під час переходу). Імпорти
  роутера — з `react-router`.
- Вендорні чанки (`getVendorChunk` у `vite.config.ts`): emotion в одному чанку з React,
  `commonjsHelpers` — окремим листовим. Розділення дає «Cannot access … before initialization»
  ще до рендеру. Загального vendor-чанка не заводити.
- Барель `@/constants` — лише легкі константи; дані імпортувати напряму.
- Модулі, які виконує Node під час збірки (`utils/`, дані в `constants/`), — без `window` і
  `document` на рівні модуля; og:image — абсолютна адреса файла з `public/`.

## Код

- TypeScript strict, без `any` і `// @ts-ignore`. `eslint-disable` — лише точково, з поясненням.
- Коментарі пояснюють **чому**, а не що робить код. Без коментарів-наративів («додав…», «тепер…»).
- Перенесення з `newsun2`: там тека `General/` (`@GeneralComponents`), `GeneralContainer`,
  `GeneralMain`; тут — `Common/` (`@CommonComponents`), `PageContainer`, `PageMain`.
