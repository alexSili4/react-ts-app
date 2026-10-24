import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';

// Правила ARCHITECTURE.md, які ловить лінтер, а не памʼять людини чи агента.
// Виняток — окремим блоком нижче з поясненням, а не eslint-disable у файлі.
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

const restrictImports = (paths) => [
  'error',
  {
    paths,
    patterns: [
      {
        regex: '^\\.\\./',
        message:
          'Між теками — через аліаси; відносні імпорти лише всередині теки компонента.',
      },
    ],
  },
];

const BODY_STYLE = {
  selector:
    "MemberExpression[object.object.name='document'][object.property.name='body'][property.name='style']",
  message: 'Скрол сторінки блокує лише useModal (стек модалок).',
};

// Ловить літерали в незмінних частинах шаблонів styled/css і в рядках;
// значення з ${theme…} між ними сюди не потрапляють.
const THEME_COLOR = [
  {
    selector: 'TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b|rgba?\\(|hsla?\\(/]',
    message: 'Колір — з theme.colors (ARCHITECTURE.md, розділ 6).',
  },
  {
    selector: 'Literal[value=/^(#[0-9a-fA-F]{3,8}|(rgba?|hsla?)\\(.*\\))$/]',
    message: 'Колір — з theme.colors (ARCHITECTURE.md, розділ 6).',
  },
];

const THEME_TOKENS = [
  {
    selector: 'TemplateElement[value.raw=/@media[^{]*\\d+px/]',
    message: 'Брейкпоінт — з theme.breakpoints.',
  },
  {
    selector: 'TemplateElement[value.raw=/z-index:\\s*-?\\d/]',
    message: 'z-index — з theme.zIndex.',
  },
  {
    selector: 'TemplateElement[value.raw=/font-family:\\s*[^\\s;]/]',
    message: 'Шрифт — з theme.fontFamily.',
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
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictImports(RESTRICTED_IMPORT_PATHS),
      'no-restricted-syntax': ['error', BODY_STYLE],
    },
  },
  {
    files: ['src/components/**/*.{ts,tsx}'],
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
    files: ['src/pages/**/*.tsx'],
    rules: {
      'no-restricted-imports': restrictImports([
        ...RESTRICTED_IMPORT_PATHS,
        {
          name: 'react',
          importNames: ['Suspense'],
          message: 'Suspense з Loader уже дає SharedLayout.',
        },
      ]),
    },
  },
  {
    files: ['src/utils/chunkReload.ts'],
    rules: {
      'no-restricted-imports': restrictImports(
        RESTRICTED_IMPORT_PATHS.filter(
          ({ importNames }) => !importNames?.includes('lazy')
        )
      ),
    },
  },
  {
    files: ['src/hooks/useModal.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  }
);
