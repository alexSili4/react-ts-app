import { FC } from 'react';
import PageContainer from '@CommonComponents/PageContainer';
import { IProps } from './HeroSection.types';
import { Content, Subtitle, Title } from './HeroSection.styled';

// Зразок секції: тека з чотирьох файлів (.tsx, .styled.ts, .types.ts,
// index.ts), розмітка тут, стилі — у styled, пропси — у types. Замінити
// першою секцією з макета.
const HeroSection: FC<IProps> = ({ title, subtitle }) => {
  return (
    <section>
      <PageContainer>
        <Content>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
        </Content>
      </PageContainer>
    </section>
  );
};

export default HeroSection;
