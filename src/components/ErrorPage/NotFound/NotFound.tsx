import { FC } from 'react';
import { Section, Container, Title, Message } from './NotFound.styled';
import GeneralContainer from '@GeneralComponents/GeneralContainer';

const NotFound: FC = () => (
  <Section>
    <GeneralContainer>
      <Container>
        <Title>Not Found</Title>
        <Message>The request URL was not found on this server</Message>
      </Container>
    </GeneralContainer>
  </Section>
);

export default NotFound;
