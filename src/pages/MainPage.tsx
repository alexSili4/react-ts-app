import { FC } from 'react';
import Main from '@MainPageComponents/Main';
import PageMain from '@CommonComponents/PageMain';
import Footer from '@CommonComponents/Footer';
import { PagePaths } from '@/constants';
import PageMeta from '@CommonComponents/PageMeta';
import { pagesMeta } from '@/constants/pagesMeta';

const MainPage: FC = () => {
  return (
    <>
      <PageMeta {...pagesMeta[PagePaths.root]} />
      <PageMain>
        <Main />
      </PageMain>
      <Footer />
    </>
  );
};

export default MainPage;
