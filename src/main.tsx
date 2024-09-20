import React from 'react';
import ReactDOM from 'react-dom/client';
import { theme } from '@/constants';
import { ThemeProvider } from '@emotion/react';
import GlobalStyles from '@/components/GlobalStyles';
import { BrowserRouter } from 'react-router-dom';
import App from '@/components/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
        <GlobalStyles />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
