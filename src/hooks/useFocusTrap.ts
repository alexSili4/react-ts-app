import { RefObject, useEffect, useRef } from 'react';

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

// Чим користувач працював останнім і що було сфокусоване перед відкриттям.
// document.activeElement на момент відкриття не годиться: кнопки-тригери
// роблять собі blur() (makeBlur), щоб після кліку мишею не лишались
// :focus-стилі, — тож фокус на той момент уже на body.
let lastInteraction: 'keyboard' | 'pointer' = 'pointer';
let lastFocused: HTMLElement | null = null;
let isTracking = false;

const startTracking = () => {
  if (isTracking) return;
  isTracking = true;

  document.addEventListener(
    'keydown',
    () => {
      lastInteraction = 'keyboard';
    },
    true
  );
  document.addEventListener(
    'pointerdown',
    () => {
      lastInteraction = 'pointer';
    },
    true
  );
  document.addEventListener(
    'focusin',
    (e) => {
      lastFocused = e.target instanceof HTMLElement ? e.target : null;
    },
    true
  );
};

// Фокус-трап для модалки: поки isActive, Tab/Shift+Tab ходять лише всередині
// контейнера. При відкритті фокус переходить на сам контейнер (йому потрібен
// tabIndex={-1}) — не на першу кнопку, бо фокус на кнопці закриття вмикає її
// свічення навіть при відкритті мишею. При закритті фокус повертається на
// тригер, але лише для клавіатури: після кліку мишею це повернуло б ті самі
// :focus-стилі, яких тригери позбуваються через makeBlur.
const useFocusTrap = <T extends HTMLElement = HTMLDivElement>(
  isActive: boolean
): RefObject<T> => {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    startTracking();
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const trigger =
      document.activeElement instanceof HTMLElement &&
      document.activeElement !== document.body
        ? document.activeElement
        : lastFocused;

    // Контейнер може зʼявитись кадром пізніше (портал, AnimatePresence).
    const frame = requestAnimationFrame(() => {
      containerRef.current?.focus({ preventScroll: true });
    });

    const onKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;

      if (e.key !== 'Tab' || !container) return;

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

      if (lastInteraction === 'keyboard' && trigger?.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, [isActive]);

  return containerRef;
};

export default useFocusTrap;
