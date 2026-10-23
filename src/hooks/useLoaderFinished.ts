import { useSyncExternalStore } from 'react';
import common from '@/constants/common';

// Прелоадер сайту живе в index.html поза React: поки він грає, на body
// висить клас `loading`, а коли завершується — клас знімається і в window
// летить подія `loaderFinished`.
const LOADING_CLASS = 'loading';
const LOADER_FINISHED_EVENT = 'loaderFinished';

const isLoaderGone = () => !document.body.classList.contains(LOADING_CLASS);

// Стан спільний на весь застосунок, а не свій у кожному хуку: усі герої мають
// стартувати одночасно, навіть якщо якийсь змонтувався вже після події.
//
// Якщо лоадера при першому виклику вже нема (перехід між сторінками, сайт без
// прелоадера) — готово одразу, без паузи.
let isReady = isLoaderGone();
const listeners = new Set<() => void>();

if (!isReady) {
  window.addEventListener(
    LOADER_FINISHED_EVENT,
    () => {
      // Пауза після зникнення лоадера, щоб користувач встиг побачити початок
      // анімації, а не її середину.
      setTimeout(() => {
        isReady = true;
        listeners.forEach((listener) => listener());
      }, common.AFTER_LOADER_ANIMATION_DELAY);
    },
    { once: true }
  );
}

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);

  return () => {
    listeners.delete(onChange);
  };
};

const getSnapshot = () => isReady;

// true, коли прелоадер сайту зник і минула пауза AFTER_LOADER_ANIMATION_DELAY.
// Стартові анімації героїв чекають на це замість вгаданого таймера: прелоадер
// триває по-різному, і фіксована затримка від рендера або програвала анімацію
// під ним, або змушувала чекати вже після нього.
//
// Лоадер-три-крапки між сторінками сюди свідомо не входить: це Suspense
// fallback, і контент сторінки монтується лише тоді, коли він уже прибраний.
const useLoaderFinished = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot);

export default useLoaderFinished;
