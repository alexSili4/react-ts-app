import { FC } from 'react';
import { createPortal } from 'react-dom';
import { useModal } from '@/hooks';
import { IProps } from './ModalWin.types';
import { Backdrop, Dialog } from './ModalWin.styled';

// Модалка: портал у #modal-root (index.html), фон, діалог. Поведінку —
// Escape, клік по фону, блокування скролу, фокус — дає useModal. Вигляд
// вмісту — з макета, через children.
const ModalWin: FC<IProps> = ({ isOpen, onClose, ariaLabel, children }) => {
  const { dialogRef, onBackdropClick } = useModal({ isOpen, onClose });
  const modalRoot = document.getElementById('modal-root');

  if (!isOpen || !modalRoot) {
    return null;
  }

  return createPortal(
    // Фон закривається мишею; з клавіатури — Escape (useModal).
    <Backdrop role='presentation' onClick={onBackdropClick}>
      <Dialog
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-label={ariaLabel}
        tabIndex={-1}
        data-lenis-prevent
      >
        {children}
      </Dialog>
    </Backdrop>,
    modalRoot
  );
};

export default ModalWin;
