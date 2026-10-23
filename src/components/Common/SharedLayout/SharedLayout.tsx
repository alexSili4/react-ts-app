import { FC, Suspense } from 'react';
import { Outlet } from 'react-router';
import Loader from '@CommonComponents/Loader';
import Header from '@CommonComponents/Header';
import ChunkErrorBoundary from '@CommonComponents/ChunkErrorBoundary';
import PageReadySignal from '@CommonComponents/PageReadySignal';

// Межа охоплює і хедер, і Suspense навмисно. Усі сторінки вантажаться ліниво
// (App.tsx), і без межі будь-який невдалий import() розмотує дерево до кореня:
// застосунок знімається, і користувач бачить білу сторінку.
//
// Лишати хедер видимим сенсу немає: межа не скидається при зміні роуту, тож
// навігація з фолбеку однаково нікуди б не привела.
const SharedLayout: FC = () => {
  return (
    <ChunkErrorBoundary>
      <Header />
      <Suspense fallback={<Loader />}>
        <PageReadySignal />
        <Outlet />
      </Suspense>
    </ChunkErrorBoundary>
  );
};

export default SharedLayout;
