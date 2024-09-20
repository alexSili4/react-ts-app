import { FC, Suspense } from 'react';
import { Main } from './SharedLayout.styled';
import { Outlet } from 'react-router-dom';
import Loader from '@/components/Loader';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SharedLayout: FC = () => {
  return (
    <>
      <Header />
      <Main>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </Main>
      <Footer />
    </>
  );
};

export default SharedLayout;
