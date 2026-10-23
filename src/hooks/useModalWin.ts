import { IUseModalWinProps, IUseModalWin } from '@/types/hooks.types';
import { DivClickEvent } from '@/types/general.types';
import { useEffect } from 'react';
import useBodyScrollLock from './useBodyScrollLock';
import useFocusTrap from './useFocusTrap';

const useModalWin = ({
  setModalWinState,
  showModalWin,
}: IUseModalWinProps): IUseModalWin => {
  const modalRoot = document.querySelector('#modal-root');

  // Блокування скролу тепер спільне й рахується. Раніше cleanup цього ефекту
  // безумовно робив document.body.style.overflow = '' — навіть коли модалку
  // не відкривали. А оскільки setModalWinState приходить новою функцією
  // щорендер, ефект перезапускався постійно і скидав блокування, поставлене
  // сусідньою модалкою.
  useBodyScrollLock(showModalWin);
  const dialogRef = useFocusTrap<HTMLDivElement>(showModalWin);

  useEffect(() => {
    if (!showModalWin) {
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        setModalWinState();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setModalWinState, showModalWin]);

  const hideModalWin = (e: DivClickEvent) => {
    if (e.target === e.currentTarget) {
      setModalWinState();
    }
  };

  return { modalRoot, hideModalWin, dialogRef };
};

export default useModalWin;
