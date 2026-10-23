import { FC } from 'react';
import Main from '@MainPageComponents/Main';
import { PagePaths } from '@/constants';
import PageMeta from '@CommonComponents/PageMeta';
import { pagesMeta } from '@/constants/pagesMeta';

const MainPage: FC = () => {
  return (
    <>
      <PageMeta {...pagesMeta[PagePaths.root]} />
      <Main />
    </>
  );
};

export default MainPage;
