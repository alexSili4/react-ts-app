// Єдиний перелік мов сайту. Нова мова — рядок тут і тека
// src/i18n/locales/<code>/ з тим самим набором JSON, що в типовій мові.
// Мова з переліку одразу доступна відвідувачам: є в перемикачі й обирається
// за мовою браузера. Тож додавати її сюди — коли переклад готовий.
// Звідси виводяться тип Locale, ресурси i18next і перемикач мов, а
// npm run i18n:check звіряє з цим переліком теки й ключі перекладів.
//
// Модуль свідомо без імпортів і без звернень до window: його виконують не лише
// в браузері, а й скрипти в Node (scripts/check-i18n.mjs).

export interface ILanguageConfig {
  // Код ISO 639-1: тека в locales/, атрибут lang
  code: string;
  // Підпис у перемикачі мов
  label: string;
  // og:locale
  ogLocale: string;
}

export const LANGUAGES = [
  { code: 'uk', label: 'UA', ogLocale: 'uk_UA' },
  //   { code: 'en', label: 'ENG', ogLocale: 'en_US' },
  //   { code: 'de', label: 'DE', ogLocale: 'de_DE' },
  //   { code: 'ro', label: 'RO', ogLocale: 'ro_RO' },
] as const satisfies readonly ILanguageConfig[];

export type Locale = (typeof LANGUAGES)[number]['code'];

export interface ILanguage extends ILanguageConfig {
  code: Locale;
}

// Мова, з якої беруться ключі перекладів (і їхні типи) та запасні тексти
export const DEFAULT_LOCALE: Locale = 'uk';

export const LOCALES: Locale[] = LANGUAGES.map(({ code }) => code);

export const LANGUAGE_BY_CODE = Object.fromEntries(
  LANGUAGES.map((language) => [language.code, language])
) as Record<Locale, ILanguage>;
