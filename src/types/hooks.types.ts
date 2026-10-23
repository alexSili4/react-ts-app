import { RefObject } from 'react';
import { Locale } from '@/i18n/languages';
import { ElementOrNull } from './general.types';
import { Func, OnDivClickFunc } from './functions.types';

export interface IUseModalWinProps {
  setModalWinState: Func;
  showModalWin: boolean;
}

export interface IUseModalWin {
  modalRoot: ElementOrNull;
  hideModalWin: OnDivClickFunc;
  // Вішається на контейнер діалогу: фокус-трап і повернення фокусу.
  dialogRef: RefObject<HTMLDivElement>;
}

export interface IUseLanguage {
  currentLang: Locale;
  onLangChange: (lang: Locale) => void;
}
