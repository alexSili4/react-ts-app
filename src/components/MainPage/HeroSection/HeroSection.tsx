import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Section from '@GeneralComponents/Section';
import GeneralContainer from '@GeneralComponents/GeneralContainer';
import { useLoaderFinished } from '@/hooks';
import { getSlideUpVariants } from '@/constants/motion';
import { Content, Subtitle, Title } from './HeroSection.styled';

// Варіанти framer-motion — на рівні модуля: у тілі компонента вони
// перестворювались би щорендер.
const titleVariants = getSlideUpVariants(0.8, 40);

// Приклад секції: заголовок зʼявляється через framer-motion після прелоадера,
// підзаголовок — через [data-reveal] (CSS-перехід, без JS-анімації).
const HeroSection: FC = () => {
  const { t } = useTranslation();
  const isLoaderFinished = useLoaderFinished();

  return (
    <Section>
      <GeneralContainer>
        <Content>
          <Title
            variants={titleVariants}
            initial='hidden'
            animate={isLoaderFinished ? 'visible' : 'hidden'}
          >
            {t('hero.title')}
          </Title>
          <Subtitle data-reveal data-reveal-delay='200'>
            {t('hero.subtitle')}
          </Subtitle>
        </Content>
      </GeneralContainer>
    </Section>
  );
};

export default HeroSection;
