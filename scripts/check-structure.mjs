import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

// Структура src/ за ARCHITECTURE.md: теки, імена файлів, відповідність теки
// сторінки, файла в pages/ і аліаса. ESLint бачить вміст файлів, а не те, де
// вони лежать, — тому окремий крок npm run lint. Нова тека чи тип файла —
// рішення власника (AGENTS.md): спершу правило в ARCHITECTURE.md, потім тут.

const errors = [];
const report = (file, message) => errors.push(`${file}: ${message}`);

const PASCAL = /^[A-Z][A-Za-z0-9]*$/;
const CAMEL = /^[a-z][A-Za-z0-9]*$/;
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const PAGE = /^[A-Z][A-Za-z0-9]*Page$/;

const list = (dir) =>
  fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : [];
const join = (...parts) => path.posix.join(...parts);
const splitExt = (name) => {
  const dot = name.indexOf('.');
  return dot === -1 ? [name, ''] : [name.slice(0, dot), name.slice(dot + 1)];
};

const checkTop = () => {
  const dirs = new Set([
    'components',
    'pages',
    'constants',
    'styles',
    'hooks',
    'utils',
    'types',
    'icons',
    'images',
    'video',
    'fonts',
    'services',
    'i18n',
  ]);
  const files = new Set(['main.tsx', 'vite-env.d.ts', 'i18next.d.ts']);

  for (const entry of list('src')) {
    const allowed = entry.isDirectory() ? dirs : files;

    if (!allowed.has(entry.name)) {
      report(join('src', entry.name), 'немає в ARCHITECTURE.md (розділ 2)');
    }
  }
};

const getPages = () => {
  const pages = [];

  for (const entry of list('src/pages')) {
    const [name, ext] = splitExt(entry.name);

    if (!entry.isFile() || ext !== 'tsx' || !PAGE.test(name)) {
      report(join('src/pages', entry.name), 'сторінка — файл <Name>Page.tsx (розділ 4)');
      continue;
    }

    pages.push(name);
  }

  return pages;
};

const checkComponent = (dir, name) => {
  const entries = list(dir);
  const allowed = [`${name}.tsx`, `${name}.styled.ts`, `${name}.types.ts`, 'index.ts'];

  for (const entry of entries) {
    if (!entry.isFile() || !allowed.includes(entry.name)) {
      report(join(dir, entry.name), `у теці компонента — лише ${allowed.join(', ')} (розділ 3)`);
    }
  }

  const names = entries.map((entry) => entry.name);

  if (!names.includes('index.ts')) {
    report(dir, 'немає index.ts (розділ 3)');
  }

  // Компонент з одного styled-тегу — без .tsx (Common/PageContainer).
  if (!names.includes(`${name}.tsx`) && !names.includes(`${name}.styled.ts`)) {
    report(dir, `немає ${name}.tsx (розділ 3)`);
  }
};

const checkComponents = (pages) => {
  for (const entry of list('src/components')) {
    const dir = join('src/components', entry.name);

    if (entry.isFile()) {
      if (entry.name !== 'App.tsx') {
        report(dir, 'у components/ — лише App.tsx і теки Common/, <Name>Page/ (розділ 2)');
      }
      continue;
    }

    if (entry.name !== 'Common' && !PAGE.test(entry.name)) {
      report(dir, 'тека групи — Common або <Name>Page (розділ 3)');
      continue;
    }

    if (entry.name !== 'Common' && !pages.includes(entry.name)) {
      report(dir, `немає src/pages/${entry.name}.tsx: тека — точно як сторінка (розділ 2)`);
    }

    for (const component of list(dir)) {
      const componentDir = join(dir, component.name);

      if (!component.isDirectory() || !PASCAL.test(component.name)) {
        report(componentDir, 'компонент — тека PascalCase (розділ 3)');
        continue;
      }

      checkComponent(componentDir, component.name);
    }
  }

  for (const page of pages) {
    if (!fs.existsSync(`src/components/${page}`)) {
      report(`src/pages/${page}.tsx`, `немає теки src/components/${page}/ (розділ 4)`);
    }
  }
};

const checkAliases = (pages) => {
  const { config, error } = ts.readConfigFile('tsconfig.json', ts.sys.readFile);

  if (error) {
    throw new Error(`structure: не прочитав tsconfig.json — ${error.messageText}`);
  }

  const paths = config.compilerOptions?.paths ?? {};
  const expected = {
    '@/*': './src/*',
    '@CommonComponents/*': './src/components/Common/*',
    ...Object.fromEntries(
      pages.map((page) => [`@${page}Components/*`, `./src/components/${page}/*`])
    ),
  };

  for (const [alias, targets] of Object.entries(paths)) {
    if (!(alias in expected)) {
      report('tsconfig.json', `аліас ${alias}: дозволені @/*, @CommonComponents/*, @<Name>PageComponents/* (розділ 2)`);
    } else if (targets.length !== 1 || targets[0] !== expected[alias]) {
      report('tsconfig.json', `аліас ${alias} має вести на ${expected[alias]}`);
    }
  }

  for (const alias of Object.keys(expected)) {
    if (!(alias in paths)) {
      report('tsconfig.json', `немає аліаса ${alias} (розділ 4)`);
    }
  }
};

const checkKebabTree = (dir, extensions, hint) => {
  for (const entry of list(dir)) {
    const file = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!KEBAB.test(entry.name)) {
        report(file, 'підтека — kebab-case (розділ 2)');
      }
      checkKebabTree(file, extensions, hint);
      continue;
    }

    const [name, ext] = splitExt(entry.name);

    if (!KEBAB.test(name) || !extensions.includes(ext)) {
      report(file, hint);
    }
  }
};

const checkAssets = (pages) => {
  const groups = new Set(['Common', ...pages]);
  const kinds = {
    icons: ['svg'],
    images: ['webp', 'jpg', 'jpeg', 'png'],
    video: ['mp4'],
  };

  for (const [kind, extensions] of Object.entries(kinds)) {
    for (const entry of list(`src/${kind}`)) {
      const dir = join('src', kind, entry.name);

      if (!entry.isDirectory() || !groups.has(entry.name)) {
        report(dir, 'ассети — у теці Common/ або <Name>Page/ наявної сторінки (розділ 2)');
        continue;
      }

      checkKebabTree(dir, extensions, `файл — kebab-case, ${extensions.join('/')} (розділ 9)`);
    }
  }

  for (const entry of list('src/fonts')) {
    const file = join('src/fonts', entry.name);

    if (entry.isFile()) {
      if (entry.name !== 'index.ts') {
        report(file, 'у fonts/ — index.ts і теки родин (розділ 9)');
      }
      continue;
    }

    if (!KEBAB.test(entry.name)) {
      report(file, 'тека родини — kebab-case: fonts/inter/ (розділ 9)');
    }

    checkKebabTree(file, ['woff2'], 'шрифт — лише woff2, kebab-case (розділ 9)');
  }
};

// Файли теки без підтек; барель — кожен модуль експортовано з index.ts.
const checkFlat = (dir, isValid, hint, { barrel = false } = {}) => {
  const entries = list(dir);
  const index = barrel && fs.existsSync(join(dir, 'index.ts'))
    ? fs.readFileSync(join(dir, 'index.ts'), 'utf8')
    : '';

  for (const entry of entries) {
    const file = join(dir, entry.name);

    if (barrel && entry.name === 'index.ts') {
      continue;
    }

    if (!entry.isFile() || !isValid(entry.name)) {
      report(file, hint);
      continue;
    }

    const [name] = splitExt(entry.name);

    if (barrel && !index.includes(`'./${name}'`)) {
      report(file, `не експортовано з ${dir}/index.ts (розділ 7)`);
    }
  }
};

const checkModules = () => {
  checkFlat(
    'src/hooks',
    (name) => /^use[A-Z][A-Za-z0-9]*\.ts$/.test(name),
    'хук — use<Name>.ts (розділ 7)',
    { barrel: true }
  );
  checkFlat(
    'src/utils',
    (name) => splitExt(name)[1] === 'ts' && CAMEL.test(splitExt(name)[0]),
    'утиліта — camelCase.ts без JSX (розділ 7)',
    { barrel: true }
  );
  checkFlat(
    'src/types',
    (name) => /^[a-z][A-Za-z0-9]*\.types\.ts$/.test(name),
    'типи — <domain>.types.ts (розділ 7)'
  );
  checkFlat(
    'src/services',
    (name) => /^[a-z][A-Za-z0-9]*\.service\.ts$/.test(name),
    'сервіс — <name>.service.ts (розділ 11)'
  );
  checkFlat(
    'src/styles',
    (name) => {
      const [base, ext] = splitExt(name);
      return (ext === 'ts' && CAMEL.test(base)) || (ext === 'css' && KEBAB.test(base));
    },
    'фрагмент стилів — camelCase.ts або сторонній kebab-case.css (розділи 6, 11)'
  );

  for (const entry of list('src/constants')) {
    const file = join('src/constants', entry.name);
    const [name, ext] = splitExt(entry.name);

    if (entry.isFile() ? ext !== 'ts' || !CAMEL.test(name) : !CAMEL.test(entry.name)) {
      report(file, 'константи — camelCase.ts без JSX або тека даних <domain>/ (розділ 5)');
      continue;
    }

    if (entry.isDirectory()) {
      checkFlat(
        file,
        (child) => /^[a-z0-9][A-Za-z0-9-]*\.ts$/.test(child),
        'дані — <id>.ts і index.ts (розділ 5)'
      );
    }
  }

  for (const entry of list('src/i18n')) {
    const file = join('src/i18n', entry.name);
    const [name, ext] = splitExt(entry.name);

    if (entry.isDirectory() && entry.name === 'locales') {
      for (const locale of list(file)) {
        const localeDir = join(file, locale.name);

        if (!locale.isDirectory() || !KEBAB.test(locale.name)) {
          report(localeDir, 'мова — тека locales/<мова>/ (розділ 11)');
          continue;
        }

        checkFlat(
          localeDir,
          (child) => /^[a-z][A-Za-z0-9-]*\.json$/.test(child),
          'переклад — <неймспейс>.json (розділ 11)'
        );
      }
    } else if (!entry.isFile() || ext !== 'ts' || !CAMEL.test(name)) {
      report(file, 'у i18n/ — languages.ts, i18n.ts і locales/ (розділ 11)');
    }
  }
};

checkTop();
const pages = getPages();
checkComponents(pages);
checkAliases(pages);
checkAssets(pages);
checkModules();

if (errors.length > 0) {
  console.error(
    `structure: не за ARCHITECTURE.md (${errors.length})\n` +
      errors.map((error) => `  ${error}`).join('\n') +
      '\n\nНова тека чи тип файла — рішення: запропонувати власнику (AGENTS.md, ' +
      '«Погодження рішень»), після погодження — правило в ARCHITECTURE.md і тут.'
  );
  process.exit(1);
}

console.log('structure: ok');
