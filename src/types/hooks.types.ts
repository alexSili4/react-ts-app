import { MouseEvent, RefObject } from 'react';

export interface IUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface IUseModal {
  // Вішається на контейнер діалогу: фокус-трап і повернення фокусу.
  dialogRef: RefObject<HTMLDivElement>;
  // Закриває модалку кліком по фону, але не по самому діалогу.
  onBackdropClick: (e: MouseEvent<HTMLDivElement>) => void;
}
