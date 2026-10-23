import { ElementOrNull } from '@/types/general.types';
import { ReactNode } from 'react';

export interface IProps {
  children: ReactNode;
  modalRoot: ElementOrNull;
}
