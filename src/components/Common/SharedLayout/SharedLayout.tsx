import { FC, Suspense } from 'react';
import { Outlet } from 'react-router';
import Loader from '@CommonComponents/Loader';
import Header from '@CommonComponents/Header';
import Footer from '@CommonComponents/Footer';
import ChunkErrorBoundary from '@CommonComponents/ChunkErrorBoundary';
import { Main } from './SharedLayout.styled';

// Межа помилок над усім навмисно: без неї будь-який невдалий import()
// розмотує дерево до кореня, і користувач бачить білу сторінку.
const SharedLayout: FC = () => {
  return (
    <ChunkErrorBoundary>
      <Header />
      <Main>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </Main>
      <Footer />
    </ChunkErrorBoundary>
  );
};

export default SharedLayout;
