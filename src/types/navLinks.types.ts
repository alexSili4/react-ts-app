import type { ParseKeys } from 'i18next';

export interface INavLink {
  // Ключ перекладу з неймспейсу general — t() перевіряє його на етапі tsc.
  titleKey: ParseKeys<'general'>;
  path: string;
}

export type NavLinks = INavLink[];
