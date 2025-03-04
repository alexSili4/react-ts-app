import { FC } from 'react';
import { Container, Title, Message } from './NotFound.styled';

const NotFound: FC = () => (
  <Container>
    <Title>Not Found</Title>
    <Message>The request URL was not found on this server</Message>
  </Container>
);

export default NotFound;
