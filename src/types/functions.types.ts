import {
  AnchorClickEvent,
  BtnClickEvent,
  DivClickEvent,
  InputChangeEvent,
} from './general.types';

export type Func = () => void;

export type OnDivClickFunc = (e: DivClickEvent) => void;

export type OnInputChangeFunc = (e: InputChangeEvent) => void;

export type OnAnchorClickFunc = (e: AnchorClickEvent) => void;

export type OnBtnClickFunc = (e: BtnClickEvent) => void;

export type SetBooleanFunc = (data: boolean) => void;

export interface ISmoothScrollProps {
  id: string;
  block?: 'nearest' | 'start' | 'center';
}
