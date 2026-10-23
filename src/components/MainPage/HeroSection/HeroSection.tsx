import { FC } from 'react';
import Section from '@CommonComponents/Section';
import PageContainer from '@CommonComponents/PageContainer';
import { IProps } from './HeroSection.types';
import { Content, Subtitle, Title } from './HeroSection.styled';

// Зразок секції: тека з чотирьох файлів (.tsx, .styled.ts, .types.ts,
// index.ts), розмітка тут, стилі — у styled, пропси — у types. Замінити
// першою секцією з макета.
const HeroSection: FC<IProps> = ({ title, subtitle }) => {
  return (
    <Section>
      <PageContainer>
        <Content>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </Content>
      </PageContainer>
    </Section>
  );
};

export default HeroSection;
