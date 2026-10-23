import { useEffect } from 'react';
import { ClassNames } from '@/constants';
import useLoaderFinished from './useLoaderFinished';

const REVEAL_SELECTOR = '[data-reveal]';

const reveal = (el: HTMLElement) => {
  const { revealDelay } = el.dataset;

  if (revealDelay) {
    el.style.transitionDelay = `${revealDelay}ms`;
  }

  el.classList.add(ClassNames.revealed);
};

// Елемент сам по собі та його нащадки з [data-reveal].
const getRevealTargets = (node: Node): HTMLElement[] => {
  if (!(node instanceof HTMLElement)) {
    return [];
  }

  const nested = Array.from(
    node.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
  );

  return node.matches(REVEAL_SELECTOR) ? [node, ...nested] : nested;
};

// Проявлення [data-reveal] при вході у вʼюпорт (правила — у GlobalStyles).
// Один виклик на весь застосунок (App.tsx).
//
// Стартує лише після прелоадера, інакше поява програлася б під ним; і
// підхоплює елементи, змонтовані пізніше, — ліниві маршрути зʼявляються вже
// після першого проходу, тож одного querySelectorAll на старті мало.
const useReveal = (): void => {
  const isLoaderFinished = useLoaderFinished();

  useEffect(() => {
    if (!isLoaderFinished) {
      return;
    }

    // Рух вимкнено — показуємо одразу, без чекання на вʼюпорт.
    const isReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (!isIntersecting) {
            return;
          }

          reveal(target as HTMLElement);
          io.unobserve(target);
        });
      },
      { threshold: 0.01 }
    );

    const track = (el: HTMLElement) => {
      if (el.classList.contains(ClassNames.revealed)) {
        return;
      }

      if (isReducedMotion) {
        reveal(el);
      } else {
        io.observe(el);
      }
    };

    getRevealTargets(document.body).forEach(track);

    const mo = new MutationObserver((records) => {
      records.forEach(({ addedNodes, removedNodes }) => {
        addedNodes.forEach((node) => getRevealTargets(node).forEach(track));
        // Не проявлений і вже прибраний (перехід зі сторінки) — інакше IO
        // тримав би його до кінця сесії.
        removedNodes.forEach((node) =>
          getRevealTargets(node).forEach((el) => io.unobserve(el))
        );
      });
    });

    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [isLoaderFinished]);
};

export default useReveal;
