import GeneralContainer from '@GeneralComponents/GeneralContainer';
import NotFound from '@ErrorPageComponents/NotFound';
import Section from '@GeneralComponents/Section';
import { FC } from 'react';

const NotFoundPage: FC = () => (
  <Section>
    <GeneralContainer>
      <NotFound />
    </GeneralContainer>
  </Section>
);

export default NotFoundPage;
