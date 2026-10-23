import i18n, { Resource, ResourceKey } from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { DEFAULT_LOCALE, LOCALES } from './languages';

export const defaultNS = 'general';

// Мови й неймспейси знаходяться самі: файл ./locales/<мова>/<неймспейс>.json.
// Перелік мов — у languages.ts, відповідність тек йому перевіряє
// npm run i18n:check.
const parseLocalePath = (path: string): [string, string] => {
  const [, language, namespace] =
    path.match(/^\.\/locales\/([^/]+)\/([^/]+)\.json$/) ?? [];

  return [language, namespace];
};

// Типова мова — у бандлі: перший рендер не чекає на мережу. import.meta.glob
// приймає лише літерал, тож 'uk' тут записано ще раз — i18n:check звіряє його з
// DEFAULT_LOCALE.
const defaultLocaleFiles = import.meta.glob<ResourceKey>('./locales/uk/*.json', {
  eager: true,
  import: 'default',
});

// Решта мов — окремими чанками, лише коли мову справді обрано. Без
// виключення типової Vite отримав би той самий файл і статично, і динамічно.
const lazyLocaleFiles = import.meta.glob<ResourceKey>(
  ['./locales/*/*.json', '!./locales/uk/*.json'],
  { import: 'default' }
);

const resources: Resource = { [DEFAULT_LOCALE]: {} };

for (const [path, data] of Object.entries(defaultLocaleFiles)) {
  const [, namespace] = parseLocalePath(path);

  resources[DEFAULT_LOCALE][namespace] = data;
}

// Офіційний плагін i18next для бандлерів: переклад приходить чанком Vite з
// хешем в імені, тож після деплою браузер не візьме старий JSON із кешу.
// i18next-http-backend вантажив би незмінні /locales/<мова>/<неймспейс>.json,
// які ще й треба копіювати в збірку.
const lazyLocalesBackend = resourcesToBackend(
  (language: string, namespace: string) => {
    const loadFile = lazyLocaleFiles[`./locales/${language}/${namespace}.json`];

    return loadFile
      ? loadFile()
      : Promise.reject(new Error(`i18n: немає ${language}/${namespace}.json`));
  }
);

// Атрибут lang — за мовою вмісту: від нього залежать читалки екрана,
// перенесення слів і автопереклад браузера. resolvedLanguage, бо language —
// мова браузера як є ('en-US', а то й 'ru' без перекладу)
i18n.on('languageChanged', () => {
  document.documentElement.lang = i18n.resolvedLanguage ?? DEFAULT_LOCALE;
});

// main.tsx рендерить сайт, коли мову визначено і її переклади завантажено
export const i18nReady = i18n
  .use(lazyLocalesBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: LOCALES,
    // Браузер віддає мову з регіоном ('en-US') — вантажимо лише 'en'
    load: 'languageOnly',
    // Спершу збережена мова (детектор сам пише її в localStorage при кожній
    // зміні), потім налаштування браузера. Без querystring, що стоїть першим
    // за замовчуванням: мова не в адресі.
    detection: {
      order: ['localStorage', 'navigator'],
    },
    ns: Object.keys(resources[DEFAULT_LOCALE]),
    defaultNS,
    resources,
    // Без цього i18next, отримавши resources, не звертався б до бекенду взагалі
    partialBundledLanguages: true,
    debug: __DEV__,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
