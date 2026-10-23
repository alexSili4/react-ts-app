import { ComponentType, lazy, LazyExoticComponent } from 'react';

// Прапорець не дає ChunkErrorBoundary перезавантажувати сторінку по колу,
// якщо чанк недоступний насправді, а не через деплой. У sessionStorage, бо
// перезавантаження стирає стан React. sessionStorage кидає SecurityError, коли
// заблоковані cookies, — тоді вважаємо, що спроба вже була.
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

// Чанк приїхав — деплой (якщо був) підхоплено, і на наступний
// автоперезавантаження можна дозволити знову.
export const lazyPage = <T extends ComponentType>(
  load: () => Promise<{ default: T }>
): LazyExoticComponent<T> =>
  lazy(() =>
    load().then((module) => {
      clearChunkReloadAttempt();

      return module;
    })
  );
