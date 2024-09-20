import Container from '@/components/Container';
import NotFound from '@/components/NotFound';
import Section from '@/components/Section';
import { FC } from 'react';

const NotFoundPage: FC = () => (
  <Section>
    <Container>
      <NotFound />
    </Container>
  </Section>
);

export default NotFoundPage;
