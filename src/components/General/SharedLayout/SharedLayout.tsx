import { FC, Suspense, useState } from 'react';
import { Outlet } from 'react-router';
import Loader from '@GeneralComponents/Loader';
import Header from '@GeneralComponents/Header';
import PageLoaderSignal from '@GeneralComponents/PageLoaderSignal';
import ChunkErrorBoundary from '@GeneralComponents/ChunkErrorBoundary';
import { HeaderVisibilityContext } from '@/hooks/useHideHeader';

// Межа охоплює і хедер, і Suspense навмисно. Усі сторінки вантажаться ліниво
// (App.tsx), і без межі будь-який невдалий import() розмотує дерево до кореня:
// застосунок знімається, а прелоадер на той момент уже прибрано, тож
// користувач бачить білу сторінку.
//
// Лишати хедер видимим сенсу немає: межа не скидається при зміні роуту, тож
// навігація з фолбеку однаково нікуди б не привела.
//
// Хедер ховає сама сторінка через useHideHeader (404). Сеттер useState
// стабільний, тож провайдер не перемальовує тих, хто його читає.
const SharedLayout: FC = () => {
  const [isHeaderHidden, setIsHeaderHidden] = useState<boolean>(false);

  return (
    <ChunkErrorBoundary>
      <HeaderVisibilityContext.Provider value={setIsHeaderHidden}>
        {!isHeaderHidden && <Header />}
        <Suspense fallback={<Loader />}>
          <PageLoaderSignal />
          <Outlet />
        </Suspense>
      </HeaderVisibilityContext.Provider>
    </ChunkErrorBoundary>
  );
};

export default SharedLayout;
