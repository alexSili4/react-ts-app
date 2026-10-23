import { FC } from 'react';
import NotFound from '@NotFoundPageComponents/NotFound';
import { PagePaths } from '@/constants';
import PageMeta from '@CommonComponents/PageMeta';
import { pagesMeta } from '@/constants/pagesMeta';

const NotFoundPage: FC = () => {
  return (
    <>
      <PageMeta {...pagesMeta[PagePaths.notFound]} />
      <NotFound />
    </>
  );
};

export default NotFoundPage;
