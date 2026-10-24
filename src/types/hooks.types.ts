import { MouseEvent, RefObject } from 'react';

export interface IUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface IUseModal {
  dialogRef: RefObject<HTMLDivElement>;
  // Обидва — на фон: закриває лише клік, що й почався, і закінчився на фоні.
  onBackdropMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
  onBackdropClick: (e: MouseEvent<HTMLDivElement>) => void;
}
