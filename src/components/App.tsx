import { FC, lazy, useRef } from 'react';
import { ClassNames, PagePaths } from '@/constants';
import { Route, Routes } from 'react-router';
import SharedLayout from '@GeneralComponents/SharedLayout';
import { LenisRef, ReactLenis } from 'lenis/react';
import { useReveal, useScrollToTop } from '@/hooks';

// Кожна сторінка — окремий лінивий чанк. Нова сторінка: файл у src/pages,
// шлях у PagePaths, метадані в pagesMeta і маршрут нижче.
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const MainPage = lazy(() => import('@/pages/MainPage'));

const App: FC = () => {
  useScrollToTop();
  useReveal();

  const lenisRef = useRef<LenisRef>(null);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        // Блоки з власною прокруткою (список у модалці, горизонтальна стрічка)
        // позначаються класом noneLenisScroll — їх Lenis не перехоплює.
        prevent: (node) => node.classList.contains(ClassNames.noneLenisScroll),
        // Коли скрол зупинено або заблоковано (модалка, доскрол), Lenis
        // викликає preventDefault на touch-подіях. Під час вже запущеного
        // нативного скролу вони не скасовуються, і Chrome сипле в консоль
        // [Intervention]. Такі події скасувати все одно неможливо, тож Lenis
        // їх просто пропускає.
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
      <div className='main-wrapper'>
        <Routes>
          <Route path={PagePaths.root} element={<SharedLayout />}>
            <Route index element={<MainPage />} />
            <Route path={PagePaths.notFound} element={<NotFoundPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Route>
        </Routes>
      </div>
    </ReactLenis>
  );
};

export default App;
