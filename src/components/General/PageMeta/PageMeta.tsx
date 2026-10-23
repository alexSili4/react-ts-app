import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';
import getPageMetaTags from '@/utils/getPageMetaTags';
import { IProps } from './PageMeta.types';

// Метатеги сторінки: title, description, canonical і og:*. Ставить кожна
// сторінка з даних pagesMeta.
//
// Ті самі теги збірка кладе в сирий HTML кожного маршруту
// (scripts/gen-pages.mjs) — для скребачок соцмереж і роботів, що не виконують
// JS. Значення рахує одна функція, getPageMetaTags, тож HTML і Helmet не
// розходяться. Набір тегів тут і в gen-pages.mjs має збігатися: Helmet
// замінює лише теги з data-rh="true".
const PageMeta: FC<IProps> = (props) => {
  const { pathname } = useLocation();
  const { title, description, canonical, image, noIndex } = getPageMetaTags(
    pathname,
    props
  );

  return (
    <Helmet>
      <title>{title}</title>
      {noIndex ? (
        <meta name='robots' content='noindex, follow' />
      ) : (
        <link rel='canonical' href={canonical} />
      )}

      <meta property='og:type' content='website' />
      <meta property='og:url' content={canonical} />
      <meta property='og:title' content={title} />
      <meta property='og:image' content={image} />

      {description && <meta name='description' content={description} />}
      {description && (
        <meta property='og:description' content={description} />
      )}
    </Helmet>
  );
};

export default PageMeta;
