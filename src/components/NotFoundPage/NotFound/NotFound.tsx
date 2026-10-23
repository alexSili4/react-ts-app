import { FC } from 'react';
import { PagePaths } from '@/constants';
import PageContainer from '@CommonComponents/PageContainer';
import { Content, HomeLink, Message, Title } from './NotFound.styled';

const NotFound: FC = () => {
  return (
    <PageContainer>
      <Content>
        <Title>404 — сторінку не знайдено</Title>
        <Message>Схоже, такої сторінки немає або її перенесли.</Message>
        <HomeLink to={PagePaths.root}>На головну</HomeLink>
      </Content>
    </PageContainer>
  );
};

export default NotFound;
