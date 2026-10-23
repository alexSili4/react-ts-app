import { FC } from 'react';
import { createPortal } from 'react-dom';
import { useModal } from '@/hooks';
import { IProps } from './ModalWin.types';
import { Backdrop, Dialog } from './ModalWin.styled';

const ModalWin: FC<IProps> = ({ isOpen, onClose, ariaLabel, children }) => {
  const { dialogRef, onBackdropClick } = useModal({ isOpen, onClose });
  const modalRoot = document.getElementById('modal-root');

  if (!isOpen || !modalRoot) {
    return null;
  }

  return createPortal(
    // Фон закривається лише мишею; з клавіатури — Escape (useModal), тому
    // role='presentation', а не кнопка.
    <Backdrop role='presentation' onClick={onBackdropClick}>
      <Dialog
        ref={dialogRef}
        role='dialog'
        aria-modal='true'
        aria-label={ariaLabel}
        tabIndex={-1}
      >
        {children}
      </Dialog>
    </Backdrop>,
    modalRoot
  );
};

export default ModalWin;
