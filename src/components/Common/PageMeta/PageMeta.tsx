import { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';
import { getPageMetaTags } from '@/utils';
import { IProps } from './PageMeta.types';

// Набір тегів тут і в renderMetaTags (scripts/gen-pages.mjs) має збігатися:
// там ті самі теги лягають у сирий HTML з data-rh="true", і Helmet замінює
// лише їх.
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
