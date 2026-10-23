import { FC } from 'react';
import { Container, Dot } from './Loader.styled';

const Loader: FC = () => {
  return (
    <Container role='status' aria-label='Завантаження'>
      <Dot order={0} />
      <Dot order={1} />
      <Dot order={2} />
    </Container>
  );
};

export default Loader;
