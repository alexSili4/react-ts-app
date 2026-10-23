import fs from 'node:fs';
import path from 'node:path';
import importTs from './lib/import-ts.mjs';

// Повнота перекладів. Пропущений ключ сам по собі нічого не ламає: i18next
// тихо підставляє текст типової мови, і помітно це стає лише на сайті. Тож
// перевіряємо до збірки (скрипт стоїть першим у npm run build):
//
// - для кожної мови з LANGUAGES у languages.ts є тека в src/i18n/locales.
//   Тека без мови в LANGUAGES — не помилка: так мову вимикають на час, і її
//   переклад не перевіряється;
// - у кожній мові ті самі файли й ключі, що в типовій;
// - немає порожніх значень: мова з LANGUAGES одразу доступна відвідувачам;
// - плейсхолдери {{…}} у перекладі ті самі, що в типовій мові;
// - i18n.ts і i18next.d.ts знають про типову мову й усі її неймспейси.

const LOCALES_DIR = 'src/i18n/locales';

const { LANGUAGES, DEFAULT_LOCALE } = await importTs('src/i18n/languages.ts');

const errors = [];

const readJsonFiles = (dir) =>
  Object.fromEntries(
    fs
      .readdirSync(dir)
      .filter((file) => file.endsWith('.json'))
      .map((file) => [
        path.basename(file, '.json'),
        JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')),
      ])
  );

// { a: { b: 'x' } } → { 'a.b': 'x' }
const flatten = (value, prefix = '') =>
  value !== null && typeof value === 'object'
    ? Object.entries(value).reduce(
        (acc, [key, nested]) => ({
          ...acc,
          ...flatten(nested, prefix ? `${prefix}.${key}` : key),
        }),
        {}
      )
    : { [prefix]: value };

const getPlaceholders = (value) =>
  [...String(value).matchAll(/{{\s*([^}\s]+)\s*}}/g)]
    .map((match) => match[1])
    .sort()
    .join(',');

const configCodes = LANGUAGES.map(({ code }) => code);
const localeDirs = fs
  .readdirSync(LOCALES_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map(({ name }) => name);

for (const code of configCodes) {
  if (!localeDirs.includes(code)) {
    errors.push(`${code}: мова є в LANGUAGES, але теки ${LOCALES_DIR}/${code} немає`);
  }
}

const disabledDirs = localeDirs.filter((dir) => !configCodes.includes(dir));

if (!configCodes.includes(DEFAULT_LOCALE)) {
  throw new Error(`check-i18n: DEFAULT_LOCALE «${DEFAULT_LOCALE}» немає в LANGUAGES`);
}

const defaultFiles = readJsonFiles(path.join(LOCALES_DIR, DEFAULT_LOCALE));
const defaultKeys = Object.fromEntries(
  Object.entries(defaultFiles).map(([namespace, data]) => [namespace, flatten(data)])
);

for (const { code } of LANGUAGES) {
  if (code === DEFAULT_LOCALE || !localeDirs.includes(code)) {
    continue;
  }

  const files = readJsonFiles(path.join(LOCALES_DIR, code));

  for (const namespace of Object.keys(files)) {
    if (!defaultKeys[namespace]) {
      errors.push(`${code}/${namespace}.json: файла немає в типовій мові (${DEFAULT_LOCALE})`);
    }
  }

  for (const [namespace, expected] of Object.entries(defaultKeys)) {
    if (!files[namespace]) {
      errors.push(`${code}/${namespace}.json: файла немає`);
      continue;
    }

    const actual = flatten(files[namespace]);

    for (const key of Object.keys(expected)) {
      if (!(key in actual)) {
        errors.push(`${code}/${namespace}.json: немає ключа «${key}»`);
      }
    }

    for (const [key, value] of Object.entries(actual)) {
      if (!(key in expected)) {
        errors.push(`${code}/${namespace}.json: зайвий ключ «${key}» (немає в ${DEFAULT_LOCALE})`);
        continue;
      }

      if (value === '') {
        errors.push(`${code}/${namespace}.json: порожній «${key}»`);
        continue;
      }

      if (getPlaceholders(value) !== getPlaceholders(expected[key])) {
        errors.push(
          `${code}/${namespace}.json: «${key}» — плейсхолдери не ті, що в ${DEFAULT_LOCALE}`
        );
      }
    }
  }
}

// import.meta.glob приймає лише літерал, тож типова мова записана в i18n.ts ще
// раз — і має збігатися з DEFAULT_LOCALE.
const i18nSource = fs.readFileSync('src/i18n/i18n.ts', 'utf8');

for (const pattern of [`'./locales/${DEFAULT_LOCALE}/*.json'`, `'!./locales/${DEFAULT_LOCALE}/*.json'`]) {
  if (!i18nSource.includes(pattern)) {
    errors.push(`src/i18n/i18n.ts: очікується ${pattern} — типова мова в glob має бути DEFAULT_LOCALE`);
  }
}

// Неймспейси в i18next.d.ts перелічено руками — інакше t() не знав би ключів.
const typesSource = fs.readFileSync('src/i18next.d.ts', 'utf8');

for (const namespace of Object.keys(defaultFiles)) {
  if (!typesSource.includes(`locales/${DEFAULT_LOCALE}/${namespace}.json`)) {
    errors.push(`src/i18next.d.ts: немає неймспейсу «${namespace}» — додай його в resources`);
  }
}

if (errors.length) {
  console.error(`i18n:check — помилок: ${errors.length}\n${errors.map((error) => `  ${error}`).join('\n')}`);
  process.exit(1);
}

console.log(
  `i18n:check: ${configCodes.length} мов, ${Object.keys(defaultFiles).length} неймспейсів, ` +
    `${Object.values(defaultKeys).reduce((sum, keys) => sum + Object.keys(keys).length, 0)} ключів — ок` +
    (disabledDirs.length
      ? `\n  не в LANGUAGES, не перевірялись: ${disabledDirs.join(', ')}`
      : '')
);
