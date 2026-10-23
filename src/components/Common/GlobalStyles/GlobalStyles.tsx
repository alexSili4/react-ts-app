import 'modern-normalize';
import { FC } from 'react';
import { Global, css } from '@emotion/react';
import { theme } from '@/constants';

// Базові стилі документа. Власні шрифти (@font-face) — теж сюди, по одному
// блоку на накреслення (ARCHITECTURE.md → «Шрифти»).
const GlobalStyles: FC = () => (
  <Global
    styles={css`
      /*
        Місце під смугу прокрутки зарезервоване завжди: коли модалка блокує
        сторінку (overflow: hidden), смуга зникає, але вʼюпорт не
        розширюється — і не смикається ні потік, ні fixed-хедер. Фон тут — бо
        в зарезервованій смузі видно полотно, яке інакше було б білим.
      */
      html {
        scrollbar-gutter: stable;
        background-color: ${theme.colors.background};
      }

      body {
        font-family: ${theme.fontFamily.main};
        color: ${theme.colors.text};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-y: auto;
        overflow-x: hidden;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      p {
        margin: 0;
      }

      ul,
      ol {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      img {
        display: block;
        max-width: 100%;
        height: auto;
      }

      button {
        padding: 0;
        color: inherit;
        background-color: transparent;
        border: none;
        cursor: pointer;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      /*
        Для тих, кому рух завдає дискомфорту (вестибулярні розлади, мігрень),
        анімації не вимикаємо повністю, а стискаємо до майже миттєвих: так
        зникає рух, але лишаються кінцеві стани, на які спирається розкладка.
        Для framer-motion (коли його додадуть) — reducedMotion у MotionConfig.
      */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }

      #root {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
    `}
  />
);

export default GlobalStyles;
