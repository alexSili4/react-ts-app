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

// Стек, а не прапорець: модалки накладаються. Клавіші обробляє лише верхня —
// інакше Escape закрив би всі разом, а пастки фокусу перехоплювали б Tab одна
// в одної. Скрол повертається, лише коли стек спорожнів. Ширину смуги
// прокрутки не компенсуємо: місце під неї тримає scrollbar-gutter (GlobalStyles).
const openModals: object[] = [];
let savedOverflow = '';

const useModal = ({ isOpen, onClose }: IUseModalProps): IUseModal => {
  const dialogRef = useRef<HTMLDivElement>(null);
  // Через ref, щоб інлайновий onClose не перезапускав ефект щорендер.
  const onCloseRef = useRef(onClose);
  const isPressOnBackdropRef = useRef(false);

  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const modal = {};
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    if (openModals.length === 0) {
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    openModals.push(modal);

    // Фокус — на сам контейнер (tabIndex={-1}), а не на першу кнопку: інакше
    // кнопка закриття світилась би фокусом навіть при відкритті мишею.
    // Кадром пізніше, бо контейнер зʼявляється в порталі після цього ефекту.
    const frame = requestAnimationFrame(() => {
      dialogRef.current?.focus({ preventScroll: true });
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (openModals[openModals.length - 1] !== modal) {
        return;
      }

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

      openModals.splice(openModals.indexOf(modal), 1);

      if (openModals.length === 0) {
        document.body.style.overflow = savedOverflow;
      }

      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  // click приходить на спільного предка точок натискання й відпускання: без
  // перевірки mousedown виділення тексту в діалозі, відпущене над фоном,
  // закривало б модалку.
  const onBackdropMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    isPressOnBackdropRef.current = e.target === e.currentTarget;
  };

  const onBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (isPressOnBackdropRef.current && e.target === e.currentTarget) {
      onClose();
    }
  };

  return { dialogRef, onBackdropMouseDown, onBackdropClick };
};

export default useModal;
