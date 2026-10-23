import React from 'react';
import ReactDOM from 'react-dom/client';
import { theme } from '@/constants';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { MotionConfig } from 'framer-motion';
import { IconContext } from 'react-icons';
import isPropValid from '@emotion/is-prop-valid';
import GlobalStyles from '@GeneralComponents/GlobalStyles';
import App from '@/components/App';
import { i18nReady } from '@/i18n/i18n';

const ICON_CONTEXT = { attr: { 'aria-hidden': true } };

const app = (
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
            кожен рендер.

            Emotion фільтрує невалідні HTML-атрибути лише для строкових тегів
            (styled.div), а для компонента передає все далі. Далі їх мав би
            відсіяти сам framer-motion — він уміє, але вмикає фільтр лише коли
            зміг зробити require('@emotion/is-prop-valid'). У ESM-збірці Vite
            require не існує, тож фільтр лишається вимкненим.

            MotionConfig — штатний спосіб передати цю функцію ззовні, і одного
            виклику на корені вистачає на весь проєкт.

            reducedMotion='user' — та сама причина, що й у блоці
            prefers-reduced-motion в GlobalStyles, але для framer-motion: CSS-блок
            на нього не діє, бо framer анімує інлайновими стилями та WAAPI. З
            'user' при системному налаштуванні зсуви й масштаб (transform)
            виставляються миттєво, а opacity і колір анімуються як раніше, тож
            елементи все одно з'являються, просто без руху.
          */}
          <MotionConfig isValidProp={isPropValid} reducedMotion='user'>
            {/*
              Іконки react-icons — декор або всередині названих посилань і
              кнопок, тож усі aria-hidden. Без цього Chrome віддає кожну
              окремим безіменним «зображенням». Змістовній іконці — role='img'
              і aria-label точково.
            */}
            <IconContext.Provider value={ICON_CONTEXT}>
              <App />
            </IconContext.Provider>
          </MotionConfig>
          <GlobalStyles />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// Сайт рендериться, коли мову визначено і її переклад завантажено: без
// мигання текстом типової мови перед іншою. Типова мова — у бандлі, тож для
// неї чекати нічого не треба. Помилку завантаження перекладу i18next не кидає
// (тоді лишаються тексти типової мови), тож рендер не зависне.
void i18nReady.then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(app);
});
