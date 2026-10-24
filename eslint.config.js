import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';

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
  }
);
