import { FC } from 'react';
import PageContainer from '@CommonComponents/PageContainer';
import { IProps } from './HeroSection.types';
import { Content, Subtitle, Title } from './HeroSection.styled';

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
