import useModalWin from './useModalWin';

interface IUseModalClose {
  onClose: () => void;
  isOpen: boolean;
}

export const useModalClose = ({ onClose, isOpen }: IUseModalClose) => {
  const { hideModalWin: onBackdropClick, dialogRef } = useModalWin({
    setModalWinState: onClose,
    showModalWin: isOpen,
  });

  const onCloseBtnClick = () => {
    onClose();
  };

  return { onBackdropClick, onCloseBtnClick, dialogRef };
};
