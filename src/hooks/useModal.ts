import { MouseEvent, useEffect, useRef } from 'react';
import { IUseModal, IUseModalProps } from '@/types/hooks.types';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const getFocusable = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0
  );

// Лічильник, а не прапорець: модалки накладаються, і та, що закриється
// першою, не повинна повертати скрол під тією, що ще відкрита. Ширину смуги
// прокрутки не компенсуємо: місце під неї тримає scrollbar-gutter (GlobalStyles).
let lockCount = 0;
let savedOverflow = '';

const useModal = ({ isOpen, onClose }: IUseModalProps): IUseModal => {
  const dialogRef = useRef<HTMLDivElement>(null);
  // Через ref, щоб інлайновий onClose не перезапускав ефект щорендер.
  const onCloseRef = useRef(onClose);

  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    lockCount += 1;

    if (lockCount === 1) {
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    // Фокус — на сам контейнер (tabIndex={-1}), а не на першу кнопку: інакше
    // кнопка закриття світилась би фокусом навіть при відкритті мишею.
    // Кадром пізніше, бо контейнер зʼявляється в порталі після цього ефекту.
    const frame = requestAnimationFrame(() => {
      dialogRef.current?.focus({ preventScroll: true });
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }

      const container = dialogRef.current;

      if (e.key !== 'Tab' || !container) {
        return;
      }

      const items = getFocusable(container);
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (!first) {
        e.preventDefault();
        container.focus({ preventScroll: true });
      } else if (!container.contains(active) || active === container) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus({ preventScroll: true });
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);

      lockCount -= 1;

      if (lockCount === 0) {
        document.body.style.overflow = savedOverflow;
      }

      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const onBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return { dialogRef, onBackdropClick };
};

export default useModal;
