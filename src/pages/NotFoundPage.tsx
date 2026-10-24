import { FC } from 'react';
import Main from '@NotFoundPageComponents/Main';
import { PagePaths } from '@/constants';
import PageMeta from '@CommonComponents/PageMeta';
import { pagesMeta } from '@/constants/pagesMeta';

const NotFoundPage: FC = () => {
  return (
    <>
      <PageMeta {...pagesMeta[PagePaths.notFound]} />
      <Main />
    </>
  );
};

export default NotFoundPage;
