import { ReactNode } from 'react';

export interface IProps {
  isOpen: boolean;
  onClose: () => void;
  // Імʼя діалогу для скрінрідера.
  ariaLabel: string;
  children: ReactNode;
}
