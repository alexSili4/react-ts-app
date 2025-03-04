import GeneralContainer from '@GeneralComponents/GeneralContainer';
import { FC } from 'react';
import { Section } from './HeroSection.styled';

const HeroSection: FC = () => {
  return (
    <Section>
      <GeneralContainer>
        <p>HeroSection</p>
      </GeneralContainer>
    </Section>
  );
};

export default HeroSection;
