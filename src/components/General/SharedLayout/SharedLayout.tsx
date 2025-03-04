import { FC, Suspense } from 'react';
import { Main } from './SharedLayout.styled';
import { Outlet } from 'react-router-dom';
import Loader from '@GeneralComponents/Loader';
import Header from '@GeneralComponents/Header';
import Footer from '@GeneralComponents/Footer';

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
