// Прапорець у sessionStorage, а не в стані React: перезавантаження стирає весь
// стан застосунку, тож інакше «спробувати ще раз» не мало б памʼяті й могло
// зациклитись, якщо чанк недоступний насправді, а не через застарілу збірку.
//
// sessionStorage кидає SecurityError, коли в браузері заблоковані всі cookies.
// Запамʼятати спробу тоді нема де, тож вважаємо, що вона вже була: краще одразу
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
