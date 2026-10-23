import React from 'react';
import ReactDOM from 'react-dom/client';
import { theme } from '@/constants';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
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
          <App />
          <GlobalStyles />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
