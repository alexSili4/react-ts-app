import 'modern-normalize';
import { FC } from 'react';
import { Global, css } from '@emotion/react';
import { ClassNames, theme } from '@/constants';
import { interRegular } from '@/fonts';

const revealTransition = theme.transitionDurationAndFunc.reveal;

const GlobalStyles: FC = () => (
  <Global
    styles={css`
      /*
        Без local(): за імʼям родини браузер підхопив би однойменний шрифт,
        встановлений у системі, — іншої версії чи з іншим набором гліфів.
        Кожне накреслення — окремий @font-face з font-weight; курсив — лише
        справжнім файлом (font-style: italic), без синтезу з Regular.
      */
      @font-face {
        font-family: ${theme.fontFamily.main};
        src: url(${interRegular}) format('woff2');
        font-weight: 400;
        font-display: swap;
      }

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
        font-family:
          ${theme.fontFamily.main},
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          sans-serif;
        color: ${theme.colors.text};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-y: auto;
        overflow-x: hidden;
      }

      code {
        font-family:
          source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
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
        зникає рух, але лишаються кінцеві стани, на які спирається розкладка —
        інакше елементи, що з'являються через animate, залишились би
        невидимими. Для framer-motion те саме робить reducedMotion у main.tsx.
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

      /*
        Проявлення при вході у вʼюпорт без framer-motion: атрибут data-reveal
        на елементі, клас ставить useReveal, затримку окремого елемента задає
        data-reveal-delay (мс).
      */
      [data-reveal] {
        opacity: 0;
        filter: blur(12px);
        transform: translateY(24px);
        transition:
          opacity ${revealTransition},
          filter ${revealTransition},
          transform ${revealTransition};
        will-change: opacity, filter, transform;
      }

      [data-reveal].${ClassNames.revealed} {
        opacity: 1;
        filter: blur(0);
        transform: translateY(0);
      }

      @media (prefers-reduced-motion: reduce) {
        [data-reveal] {
          opacity: 1;
          filter: none;
          transform: none;
          transition: none;
        }
      }

      #root {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 100vh;
        background-color: ${theme.colors.background};
      }
    `}
  />
);

export default GlobalStyles;
