import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';
import { buildPageTitle, getAbsoluteUrl, SITE_URL } from '@/utils/pageTitle';
import { IProps } from './PageMeta.types';

// Метатеги сторінки: title, description, canonical і og:*. Ставить кожна
// сторінка з даних pagesMeta.
//
// Важливо розуміти межу: сервер віддає одну й ту саму index.html на будь-який
// URL, а ці теги проставляє вже React. Пошуковики, що виконують JS, побачать
// їх; скребачки соцмереж (Facebook, Telegram, LinkedIn) читають сирий HTML і
// побачать загальні теги з index.html. Щоб репост окремої сторінки показував
// саме її, метадані треба віддавати з сервера (docs/backend-integration.md)
// або пререндерити.
const PageMeta: FC<IProps> = ({ title, description, image, noIndex }) => {
  const { pathname } = useLocation();

  const fullTitle = buildPageTitle(title);
  const canonical = getAbsoluteUrl(pathname);
  const imageUrl = image ?? `${SITE_URL}/og-image.jpg`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {noIndex ? (
        <meta name='robots' content='noindex, follow' />
      ) : (
        <link rel='canonical' href={canonical} />
      )}

      <meta property='og:type' content='website' />
      <meta property='og:url' content={canonical} />
      <meta property='og:title' content={fullTitle} />
      <meta property='og:image' content={imageUrl} />

      {description && <meta name='description' content={description} />}
      {description && (
        <meta property='og:description' content={description} />
      )}
    </Helmet>
  );
};

export default PageMeta;
