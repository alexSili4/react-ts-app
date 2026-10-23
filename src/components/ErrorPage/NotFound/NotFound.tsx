import { FC } from 'react';
import ErrorScreen from '@ErrorPageComponents/ErrorScreen';
import { PagePaths } from '@/constants';

const NotFound: FC = () => {
  return (
    <ErrorScreen
      title='404 — сторінку не знайдено'
      message='Схоже, такої сторінки немає або її перенесли.'
      actionLabel='На головну'
      actionTo={PagePaths.root}
    />
  );
};

export default NotFound;
