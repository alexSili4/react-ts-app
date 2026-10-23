import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorScreen from '@ErrorPageComponents/ErrorScreen';
import { PagePaths } from '@/constants';

const NotFound: FC = () => {
  const { t } = useTranslation();

  return (
    <ErrorScreen
      title={t('notFound.title')}
      message={t('notFound.message')}
      actionLabel={t('notFound.action')}
      actionTo={PagePaths.root}
    />
  );
};

export default NotFound;
