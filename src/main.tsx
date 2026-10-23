import React from 'react';
import ReactDOM from 'react-dom/client';
import { theme } from '@/constants';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { MotionConfig } from 'framer-motion';
import isPropValid from '@emotion/is-prop-valid';
import GlobalStyles from '@CommonComponents/GlobalStyles';
import App from '@/components/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      {/*
        useTransitions={false} — свідомо: під час переходу на ще не
        завантажену сторінку має бути видно Loader (Suspense у SharedLayout).
        За замовчуванням React Router 7 загортає навігацію в startTransition, і
        тоді React тримав би на екрані попередню сторінку, доки не приїде чанк
        нової, — без жодного індикатора.
      */}
      <BrowserRouter useTransitions={false}>
        <ThemeProvider theme={theme}>
          {/*
            Без isValidProp кастомні пропси styled(motion.*) — isActive,
            zIndex тощо — доїжджають до реального DOM-вузла, і React лається на
            кожен рендер. Emotion фільтрує невалідні атрибути лише для строкових
            тегів (styled.div), а framer-motion вмикає власний фільтр лише через
            require('@emotion/is-prop-valid'), якого в ESM-збірці Vite немає.
            MotionConfig — штатний спосіб передати фільтр ззовні.

            reducedMotion='user' — при системному «зменшити рух» зсуви й
            масштаб framer-motion виставляє миттєво, opacity анімує як раніше:
            елементи зʼявляються, але без руху. CSS-анімації те саме робить блок
            prefers-reduced-motion у GlobalStyles.
          */}
          <MotionConfig isValidProp={isPropValid} reducedMotion='user'>
            <App />
          </MotionConfig>
          <GlobalStyles />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
