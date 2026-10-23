import { useTranslation } from 'react-i18next';
import { DEFAULT_LOCALE, Locale, LOCALES } from '@/i18n/languages';
import { IUseLanguage } from '@/types/hooks.types';

// Поточна мова читається прямо з i18n, без другої копії в локальному стані:
// useTranslation і так перемальовує компонент на languageChanged.
//
// resolvedLanguage, а не language: детектор віддає мову браузера як є
// ('en-US'), а resolvedLanguage — уже зведену до наявної в LANGUAGES ('en').
//
// Зміна мови — без перезавантаження й без зміни адреси: i18next довантажує
// переклад (окремий чанк) і перемальовує сторінку, а детектор запам'ятовує
// мову.
const useLanguage = (): IUseLanguage => {
  const { i18n } = useTranslation();

  const currentLang: Locale =
    LOCALES.find((code) => code === i18n.resolvedLanguage) ?? DEFAULT_LOCALE;

  const onLangChange = (lang: Locale) => {
    void i18n.changeLanguage(lang);
  };

  return {
    currentLang,
    onLangChange,
  };
};

export default useLanguage;
