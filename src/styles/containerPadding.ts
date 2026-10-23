import { css } from '@emotion/react';
import { theme } from '@/constants';

const { margin } = theme.grid;

// Бічні поля контейнера за сіткою з theme.grid. Єдине місце, де вони задані:
// його бере GeneralContainer, а блоки на всю ширину, яким потрібні ті самі
// поля, підключають цей css напряму.
const containerPadding = css`
  padding-left: ${margin.mobile}px;
  padding-right: ${margin.mobile}px;

  @media (min-width: ${theme.breakpoints.tablet}px) {
    padding-left: ${margin.tablet}px;
    padding-right: ${margin.tablet}px;
  }

  @media (min-width: ${theme.breakpoints.desktop}px) {
    padding-left: ${margin.desktop}px;
    padding-right: ${margin.desktop}px;
  }
`;

export default containerPadding;
