import { FC, useRef } from 'react';
import { PagePaths } from '@/constants';
import { Route, Routes } from 'react-router';
import SharedLayout from '@CommonComponents/SharedLayout';
import { LenisRef, ReactLenis } from 'lenis/react';
import { lazyPage } from '@/utils';

// Кожна сторінка — окремий лінивий чанк. Нова сторінка: файл у src/pages,
// шлях у PagePaths, метадані в pagesMeta і маршрут нижче.
const NotFoundPage = lazyPage(() => import('@/pages/NotFoundPage'));
const MainPage = lazyPage(() => import('@/pages/MainPage'));

const App: FC = () => {
  const lenisRef = useRef<LenisRef>(null);

  return (
    // Блок із власною прокруткою (список у модалці, горизонтальна стрічка)
    // Lenis не перехоплює, якщо на ньому атрибут data-lenis-prevent.
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        // Коли скрол зупинено або заблоковано (модалка), Lenis викликає
        // preventDefault на touch-подіях. Під час уже запущеного нативного
        // скролу вони не скасовуються, і Chrome сипле в консоль
        // [Intervention]. Такі події скасувати все одно неможливо, тож Lenis їх
        // просто пропускає.
        virtualScroll: ({ event }) => {
          const lenis = lenisRef.current?.lenis;
          const isBlocked = !!lenis && (lenis.isStopped || lenis.isLocked);

          return !(
            isBlocked &&
            event.type.includes('touch') &&
            !event.cancelable
          );
        },
      }}
    >
      <Routes>
        <Route path={PagePaths.root} element={<SharedLayout />}>
          <Route index element={<MainPage />} />
          <Route path={PagePaths.notFound} element={<NotFoundPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ReactLenis>
  );
};

export default App;
