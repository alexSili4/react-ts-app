import { FC, Suspense } from 'react';
import { Main } from './SharedLayout.styled';
import { Outlet } from 'react-router-dom';
import Loader from '@CommonComponents/Loader';
import Header from '@CommonComponents/Header';
import Footer from '@CommonComponents/Footer';

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
