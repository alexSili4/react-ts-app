import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router';
import { useLenis } from 'lenis/react';

const useScrollToTop = () => {
  const { pathname } = useLocation();
  const lenis = useLenis();

  // На «назад/вперед» браузер сам відновлює прокрутку збереженого запису —
  // уже після popstate, коли роутер відрендерив сторінку і ми прокрутили її
  // вгору. Тож вона відкривалась там, де її колись покинули, і то не завжди:
  // якщо чанк сторінки ще вантажився, під лоадером відновлювати не було куди.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // До відмалювання, щоб нова сторінка не мигнула кадром на старій позиції.
  useLayoutEffect(() => {
    // Нативно — завжди: Lenis пропускає scrollTo, якщо вважає, що вже нагорі,
    // а його внутрішня позиція може розійтися з реальною.
    window.scrollTo(0, 0);
    // force — бо зупинений (модалка, пауза доскролу) чи заблокований
    // (lock-анімація доскролу) Lenis ігнорує виклик, і незавершена анімація
    // докрутила б уже нову сторінку.
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname, lenis]);
};

export default useScrollToTop;
