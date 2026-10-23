import { MouseEvent, RefObject } from 'react';

export interface IUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface IUseModal {
  dialogRef: RefObject<HTMLDivElement>;
  // Лише клік по самому фону, не по діалогу.
  onBackdropClick: (e: MouseEvent<HTMLDivElement>) => void;
}
