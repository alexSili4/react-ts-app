import NotFound from '@ErrorPageComponents/NotFound';
import { FC } from 'react';
import PageMain from '@CommonComponents/PageMain';
import Footer from '@CommonComponents/Footer';
import { PagePaths } from '@/constants';
import PageMeta from '@CommonComponents/PageMeta';
import { pagesMeta } from '@/constants/pagesMeta';

const NotFoundPage: FC = () => {
  return (
    <>
      <PageMeta {...pagesMeta[PagePaths.notFound]} />
      <PageMain>
        <NotFound />
      </PageMain>
      <Footer />
    </>
  );
};

export default NotFoundPage;
