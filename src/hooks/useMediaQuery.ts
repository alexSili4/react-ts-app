import { useCallback, useMemo, useSyncExternalStore } from 'react';

// Приймає готовий media-запит, а не лише брейкпоінт: крім min-width потрібні
// ще й запити на кшталт prefers-reduced-motion.
//
// MediaQueryList створюємо один раз на запит, а subscribe і getSnapshot
// тримаємо стабільними. Раніше обидві функції створювались наново щорендер,
// і useSyncExternalStore, який порівнює subscribe за посиланням, відписувався
// та підписувався на кожен рендер компонента — а всередині ще й будував новий
// MediaQueryList.
const useMediaQuery = (query: string): boolean => {
  const mediaQueryList = useMemo(() => window.matchMedia(query), [query]);

  const subscribe = useCallback(
    (onChange: () => void) => {
      mediaQueryList.addEventListener('change', onChange);

      return () => mediaQueryList.removeEventListener('change', onChange);
    },
    [mediaQueryList]
  );

  const getSnapshot = useCallback(() => mediaQueryList.matches, [
    mediaQueryList,
  ]);

  return useSyncExternalStore(subscribe, getSnapshot);
};

export default useMediaQuery;
