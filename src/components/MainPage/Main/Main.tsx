import { FC } from 'react';
import HeroSection from '@MainPageComponents/HeroSection';

// Порядок секцій головної. Кожна секція — окрема тека в MainPage/.
const Main: FC = () => {
  return (
    <HeroSection
      title='Новий проєкт'
      subtitle='Стартовий екран темплейту. Замініть його першою секцією з макета.'
    />
  );
};

export default Main;
