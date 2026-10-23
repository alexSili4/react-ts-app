import { FC } from 'react';
import Main from '@MainPageComponents/Main';
import GeneralMain from '@CommonComponents/GeneralMain';
import Footer from '@CommonComponents/Footer';
import { PagePaths } from '@/constants';
import PageMeta from '@CommonComponents/PageMeta';
import { pagesMeta } from '@/constants/pagesMeta';

const MainPage: FC = () => {
  return (
    <>
      <PageMeta {...pagesMeta[PagePaths.root]} />
      <GeneralMain>
        <Main />
      </GeneralMain>
      <Footer />
    </>
  );
};

export default MainPage;
