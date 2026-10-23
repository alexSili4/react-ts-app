import { FC } from 'react';
import Main from '@MainPageComponents/Main';
import GeneralMain from '@GeneralComponents/GeneralMain';
import Footer from '@GeneralComponents/Footer';
import { PagePaths } from '@/constants';
import PageMeta from '@GeneralComponents/PageMeta';
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
