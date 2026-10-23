import { FC } from 'react';
import { Container, Dot } from './Loader.styled';

// Раніше це був ThreeDots із react-loader-spinner. Заради трьох крапок пакет
// тягнув у головний чанк цілий другий рушій CSS-in-JS — styled-components
// поруч із Emotion, — а з ним і postcss з високою вразливістю, яку інакше не
// закрити: react-loader-spinner оновлень не має.
//
// Той самий вигляд на Emotion — це кілька рядків keyframes, нуль нових
// залежностей і на одну вразливість менше.
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
