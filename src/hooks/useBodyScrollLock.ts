import { useEffect } from 'react';
import { useLenis } from 'lenis/react';
import {
  getIsBodyScrollLocked,
  lockBodyScroll,
  unlockBodyScroll,
} from '@/utils/bodyScrollLock';

// Єдине місце, де модалки зупиняють прокрутку. Lenis теж рахується через
// лічильник: він глобальний, і start() від першої закритої модалки повернув
// би скрол під тією, що ще відкрита.
const useBodyScrollLock = (isLocked: boolean): void => {
  const lenis = useLenis();

  useEffect(() => {
    if (!isLocked) {
      return;
    }

    lockBodyScroll();
    lenis?.stop();

    return () => {
      unlockBodyScroll();

      if (!getIsBodyScrollLocked()) {
        lenis?.start();
      }
    };
  }, [isLocked, lenis]);
};

export default useBodyScrollLock;
