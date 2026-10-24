import fs from 'node:fs';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';

// Правила ARCHITECTURE.md, які ловить лінтер, а не памʼять людини чи агента.
// Виняток — окремим блоком нижче з поясненням: коментарі eslint-disable у
// файлах не діють (noInlineConfig), а правка цього конфіга — рішення
// власника (AGENTS.md, «Погодження рішень»).

// Теки сторінок — для правил імпортів між сторінками. Що тека, файл у
// pages/ і аліас збігаються, перевіряє scripts/check-structure.mjs.
const PAGE_DIRS = fs
  .readdirSync(new URL('./src/components', import.meta.url), {
    withFileTypes: true,
  })
  .filter((entry) => entry.isDirectory() && /^[A-Z]\w*Page$/.test(entry.name))
  .map(({ name }) => name);

const RESTRICTED_IMPORT_PATHS = [
  {
    name: 'react-router-dom',
    message: 'Імпорти роутера — з react-router.',
  },
  {
    name: 'react',
    importNames: ['lazy'],
    message:
      'Маршрут — через lazyPage з @/utils: голий lazy не знімає прапорець автоперезавантаження ChunkErrorBoundary.',
  },
  {
    name: 'react-dom/client',
    importNames: ['hydrateRoot'],
    message:
      'Знімок пререндера — не для гідрації: код не готовий до SSR (ARCHITECTURE.md, розділ 10).',
  },
];

const SUSPENSE_IMPORT = {
  name: 'react',
  importNames: ['Suspense'],
  message: 'Suspense з Loader уже дає SharedLayout.',
};

const RELATIVE_PARENT = {
  regex: '^\\.\\./',
  message:
    'Між теками — через аліаси; відносні імпорти лише всередині теки компонента.',
};

const PAGES_IMPORT = {
  regex: '^@/pages/',
  message:
    'Сторінки імпортує лише App.tsx: напрям залежностей — pages → components (ARCHITECTURE.md, розділ 2).',
};

const COMPONENTS_BY_PATH = {
  regex: '^@/components/',
  message:
    'Компоненти — через аліас групи: @CommonComponents/…, @<Name>PageComponents/….',
};

const PAGE_COMPONENTS = {
  regex: '^@\\w+PageComponents/',
  message:
    'Common/ не імпортує компоненти сторінок: потрібне кільком сторінкам переїжджає в Common/.',
};

const getOtherPageComponents = (page) => ({
  regex: `^@(?!${page}Components/)\\w+PageComponents/`,
  message:
    'Компоненти іншої сторінки — ні: потрібне кільком сторінкам переїжджає в Common/.',
});

const ANY_COMPONENTS = {
  regex: '^@(/components/|/pages/|\\w+Components/)',
  message:
    'hooks, utils, constants, types, styles, services, i18n не імпортують компоненти й сторінки (ARCHITECTURE.md, розділ 2).',
};

const restrictImports = ({
  paths = RESTRICTED_IMPORT_PATHS,
  patterns = [],
} = {}) => ['error', { paths, patterns: [RELATIVE_PARENT, ...patterns] }];

const BODY_STYLE = {
  selector:
    "MemberExpression[object.object.name='document'][object.property.name='body'][property.name='style']",
  message: 'Скрол сторінки блокує лише useModal (стек модалок).',
};

const CSS_NAMED_COLORS = `aliceblue antiquewhite aqua aquamarine azure beige bisque black
  blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate
  coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod
  darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange
  darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray
  darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey
  dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold
  goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory
  khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral
  lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink
  lightsalmon lightseagreen lightskyblue lightslategray lightslategrey
  lightsteelblue lightyellow lime limegreen linen magenta maroon
  mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen
  mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue
  mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange
  orangered orchid palegoldenrod palegreen paleturquoise palevioletred
  papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red
  rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna
  silver skyblue slateblue slategray slategrey snow springgreen steelblue tan
  teal thistle tomato turquoise violet wheat white whitesmoke yellow
  yellowgreen`
  .split(/\s+/)
  .join('|');

const COLOR_MESSAGE = 'Колір — з theme.colors (ARCHITECTURE.md, розділ 6).';

// Ловить літерали в незмінних частинах шаблонів styled/css, у рядках і в
// обʼєктах style; значення з ${theme…} між ними сюди не потрапляють. Колір,
// схований у змінну, лінтер не бачить.
const THEME_COLOR = [
  {
    selector: 'TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b|rgba?\\(|hsla?\\(/]',
    message: COLOR_MESSAGE,
  },
  {
    selector: 'Literal[value=/^(#[0-9a-fA-F]{3,8}|(rgba?|hsla?)\\(.*\\))$/]',
    message: COLOR_MESSAGE,
  },
  {
    selector: `TemplateElement[value.raw=/:[^;{}]*?(?<![\\w-])(${CSS_NAMED_COLORS})(?![\\w-])/i]`,
    message: COLOR_MESSAGE,
  },
  {
    selector: `Property[key.name=/[cC]olor$|^(background|fill|stroke)$/][value.value=/^(${CSS_NAMED_COLORS})$/i]`,
    message: COLOR_MESSAGE,
  },
];

const THEME_TOKENS = [
  {
    selector: 'TemplateElement[value.raw=/@media[^{]*\\d+px/]',
    message: 'Брейкпоінт — з theme.breakpoints.',
  },
  {
    selector: 'TemplateElement[value.raw=/@media[^{]*max-width/]',
    message:
      'Mobile-first: @media (min-width: ${theme.breakpoints…}px) (ARCHITECTURE.md, розділ 6).',
  },
  {
    selector: 'TemplateElement[value.raw=/z-index:\\s*-?\\d/]',
    message: 'z-index — з theme.zIndex.',
  },
  {
    selector: "Property[key.name='zIndex'][value.type='Literal']",
    message: 'z-index — з theme.zIndex.',
  },
  {
    selector: 'TemplateElement[value.raw=/font-family:\\s*[^\\s;]/]',
    message: 'Шрифт — з theme.fontFamily.',
  },
  {
    selector:
      'TemplateElement[value.raw=/font-size:\\s*(?!inherit|initial|unset|revert)[^\\s;]/]',
    message: 'Кегль — з theme.fontSize (ARCHITECTURE.md, розділ 6).',
  },
  {
    selector: 'TemplateElement[value.raw=/:focus(?![\\w-])/]',
    message:
      'Фокус — :focus-visible: &:is(:hover, :focus-visible) (ARCHITECTURE.md, розділ 6).',
  },
];

const THEME_DURATION = {
  selector:
    'TemplateElement[value.raw=/(transition|animation)(-duration)?:[^;]*\\d+m?s\\b/]',
  message: 'Тривалість — з theme.transitionDurationAndFunc.',
};

export default tseslint.config(
  // Лінтимо лише TypeScript: JS у проєкті — службові скрипти й цей конфіг.
  // .claude/worktrees — повні копії репозиторію від Claude Code: їхні файли не
  // входять у tsconfig, і типізований парсер падав би на кожному.
  { ignores: ['dist', '.claude', '**/*.{js,mjs,cjs}'] },
  { linterOptions: { noInlineConfig: true } },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Лише два класичні правила хуків. Пресет recommended у
      // eslint-plugin-react-hooks 7 додає правила React Compiler (refs,
      // set-state-in-effect тощо) — вмикати їх свідомо, окремим рішенням.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // PagePaths — рядковий const enum, і шляхи в даних (navLinks, крихти)
      // свідомо лежать звичайними рядками. Порівняння path === PagePaths.root —
      // це порівняння двох рядків, а не двох різних enum, від чого правило береже.
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      // React ігнорує значення, яке повертає обробник події, тож async-обробник
      // в onClick/onSubmit — звичайна річ (handleSubmit з react-hook-form саме
      // такий). Решту перевірок правила лишаємо.
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      // `interface Theme extends ITheme {}` — штатний спосіб розширити тип
      // теми emotion (declaration merging), тип-аліас тут не спрацює.
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],
      // Пресет пропускає @ts-expect-error з описом, а він так само вимикає
      // перевірку типів, як @ts-ignore.
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-expect-error': true, 'ts-ignore': true, 'ts-nocheck': true },
      ],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // no-restricted-imports і no-restricted-syntax з пізнішого блока
  // замінюють, а не доповнюють ранішні, тож кожен блок перелічує повний набір.
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictImports(),
      'no-restricted-syntax': ['error', BODY_STYLE],
    },
  },
  {
    files: [
      'src/{hooks,utils,constants,types,styles,services,i18n}/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': restrictImports({ patterns: [ANY_COMPONENTS] }),
    },
  },
  {
    files: ['src/components/Common/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictImports({
        patterns: [COMPONENTS_BY_PATH, PAGES_IMPORT, PAGE_COMPONENTS],
      }),
    },
  },
  {
    files: ['src/pages/**/*.tsx'],
    rules: {
      'no-restricted-imports': restrictImports({
        paths: [...RESTRICTED_IMPORT_PATHS, SUSPENSE_IMPORT],
      }),
    },
  },
  ...PAGE_DIRS.map((page) => ({
    files: [`src/components/${page}/**/*.{ts,tsx}`, `src/pages/${page}.tsx`],
    rules: {
      'no-restricted-imports': restrictImports({
        paths: [...RESTRICTED_IMPORT_PATHS, SUSPENSE_IMPORT],
        patterns: [
          COMPONENTS_BY_PATH,
          PAGES_IMPORT,
          getOtherPageComponents(page),
        ],
      }),
    },
  })),
  {
    files: ['src/utils/chunkReload.ts'],
    rules: {
      'no-restricted-imports': restrictImports({
        paths: RESTRICTED_IMPORT_PATHS.filter(
          ({ importNames }) => !importNames?.includes('lazy')
        ),
        patterns: [ANY_COMPONENTS],
      }),
    },
  },
  {
    files: ['src/components/**/*.{ts,tsx}', 'src/styles/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        BODY_STYLE,
        ...THEME_COLOR,
        ...THEME_TOKENS,
        THEME_DURATION,
      ],
    },
  },
  {
    // prefers-reduced-motion стискає всі анімації до 0.01ms — це не
    // тривалість дизайну, токена для неї немає.
    files: ['src/components/Common/GlobalStyles/GlobalStyles.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        BODY_STYLE,
        ...THEME_COLOR,
        ...THEME_TOKENS,
      ],
    },
  },
  {
    files: ['src/hooks/useModal.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  }
);
