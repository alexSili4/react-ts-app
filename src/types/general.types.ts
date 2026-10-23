import { MotionValue } from 'framer-motion';
import { ChangeEvent, CSSProperties, MouseEvent, RefObject } from 'react';

// events
export type DivClickEvent = MouseEvent<HTMLDivElement>;

export type BtnClickEvent = MouseEvent<HTMLButtonElement>;

export type InputChangeEvent = ChangeEvent<HTMLInputElement>;

export type AnchorClickEvent = MouseEvent<HTMLAnchorElement>;

// refs
export type RefDivObject = RefObject<HTMLDivElement>;

// other
export type ElementOrNull = Element | null;

export type Strings = string[];

export type Numbers = number[];

export type MotionValueNumber = MotionValue<number>;

export type StringOrNull = string | null;

export type NumberOrNull = number | null;

export type NumberOrUndefined = number | undefined;

export type InputType = 'text' | 'email' | 'tel';

export interface IRegExp {
  email: RegExp;
  phone: RegExp;
}

// Інлайновий style з CSS-змінними: style={{ '--offset': '12px' }}
export type CSSVars = CSSProperties & Record<`--${string}`, string | number>;
