import NotFound from '@ErrorPageComponents/NotFound';
import { FC } from 'react';
import GeneralMain from '@GeneralComponents/GeneralMain';
import { PagePaths } from '@/constants';
import PageMeta from '@GeneralComponents/PageMeta';
import { pagesMeta } from '@/constants/pagesMeta';
import { useHideHeader } from '@/hooks';

// 404 — без хедера й футера: сторінка-тупик веде лише на головну. Якщо дизайн
// 404 з хедером — прибрати useHideHeader і додати Footer.
const NotFoundPage: FC = () => {
  useHideHeader();

  return (
    <>
      <PageMeta {...pagesMeta[PagePaths.notFound]} />
      <GeneralMain>
        <NotFound />
      </GeneralMain>
    </>
  );
};

export default NotFoundPage;
