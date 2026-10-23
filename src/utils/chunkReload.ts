import { ComponentType, lazy, LazyExoticComponent } from 'react';

// Після деплою вкладка, відкрита раніше, просить лінивий чанк за старим
// хешованим імʼям, якого на сервері вже немає. ChunkErrorBoundary тоді один
// раз тихо перезавантажує сторінку; цей прапорець не дає зациклитись, якщо
// чанк недоступний насправді.
//
// Прапорець у sessionStorage, а не в стані React: перезавантаження стирає
// стан застосунку. sessionStorage кидає SecurityError, коли в браузері
// заблоковані cookies, — тоді вважаємо, що спроба вже була: краще одразу
// показати повідомлення, ніж ризикувати нескінченним перезавантаженням.
const RELOAD_ATTEMPT_KEY = 'chunk-reload-attempted';

export const getHasChunkReloadAttempt = (): boolean => {
  try {
    return Boolean(sessionStorage.getItem(RELOAD_ATTEMPT_KEY));
  } catch {
    return true;
  }
};

export const markChunkReloadAttempt = (): void => {
  try {
    sessionStorage.setItem(RELOAD_ATTEMPT_KEY, '1');
  } catch {
    // Недосяжно: без сховища getHasChunkReloadAttempt уже повернув true.
  }
};

export const clearChunkReloadAttempt = (): void => {
  try {
    sessionStorage.removeItem(RELOAD_ATTEMPT_KEY);
  } catch {
    // Без сховища знімати нічого.
  }
};

// lazy() для сторінок: чанк приїхав — отже, деплой (якщо був) уже
// підхоплено, і на наступний автоперезавантаження можна дозволити знову.
export const lazyPage = <T extends ComponentType>(
  load: () => Promise<{ default: T }>
): LazyExoticComponent<T> =>
  lazy(() =>
    load().then((module) => {
      clearChunkReloadAttempt();

      return module;
    })
  );
