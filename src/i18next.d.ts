import { defaultNS } from '@/i18n/i18n';
import type general from '@/i18n/locales/uk/general.json';

// Типи ключів — з типової мови (DEFAULT_LOCALE у languages.ts). Ресурси в
// i18n.ts збираються через import.meta.glob і типів не мають, тож неймспейси
// перелічено тут: новий JSON у locales/uk/ — рядок нижче. Пропуск ловить
// npm run i18n:check.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: {
      general: typeof general;
    };
  }
}
