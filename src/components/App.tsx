import { FC } from 'react';
import { Route, Routes } from 'react-router';
import { PagePaths } from '@/constants';
import { lazyPage } from '@/utils';
import SharedLayout from '@CommonComponents/SharedLayout';

const NotFoundPage = lazyPage(() => import('@/pages/NotFoundPage'));
const MainPage = lazyPage(() => import('@/pages/MainPage'));

const App: FC = () => {
  return (
    <Routes>
      <Route path={PagePaths.root} element={<SharedLayout />}>
        <Route index element={<MainPage />} />
        <Route path={PagePaths.notFound} element={<NotFoundPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
