declare module '@emotion/react' {
  export interface Theme extends ITheme {}
}

// Єдине джерело дизайн-токенів. Кольори, шрифти, брейкпоінти, сітка, радіуси,
// z-index і тривалості — лише звідси: літерали повз тему в компонентах не
// пишемо. Значення нижче — нейтральна заготовка, на старті проєкту замінити
// токенами з макета. Новий токен — спершу в ITheme, потім значення.
interface ITheme {
  colors: {
    // Фон сторінки й полотна під смугою прокрутки. Той самий колір — в
    // inline-стилі index.html і в theme-color.
    background: string;
    // Фон карток і панелей поверх background.
    surface: string;
    text: string;
    // Другорядний текст: підписи, плейсхолдери.
    textSecondary: string;
    accent: string;
    error: string;
    white: string;
    black: string;
    // Затемнення під модалкою.
    backdrop: string;
  };
  fontFamily: {
    main: string;
  };
  // Mobile-first: значення — min-width. Імена й значення — з макета.
  breakpoints: {
    tablet: number;
    laptop: number;
    desktop: number;
  };
  grid: {
    columns: {
      mobile: number;
      tablet: number;
      laptop: number;
    };
    gutter: number;
    // Бічні поля контейнера (styles/containerPadding.ts).
    margin: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
    maxWidth: number;
  };
  headerHeight: {
    mobile: number;
    tablet: number;
  };
  radius: {
    s: number;
    m: number;
    l: number;
  };
  zIndex: {
    header: number;
    loader: number;
    modal: number;
  };
  transitionDurationAndFunc: {
    // Ховер, фокус, відкриття й закриття — усі інтерактивні елементи.
    all: string;
    // Швидкі супутні зміни: натиск, дрібні стани.
    fast: string;
  };
  spacing: (value?: number) => number;
}

const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

const theme: ITheme = {
  colors: {
    background: '#0a0a0a',
    surface: '#161616',
    text: '#ffffff',
    textSecondary: '#7a7a7a',
    accent: '#ffcd33',
    error: '#ff3407',
    white: '#ffffff',
    black: '#000000',
    backdrop: 'rgba(0, 0, 0, 0.6)',
  },
  // Системні шрифти, доки в проєкті немає власних. Власний шрифт — файл у
  // src/fonts/, @font-face у GlobalStyles, імʼя родини — тут (ARCHITECTURE.md).
  fontFamily: {
    main: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  breakpoints: {
    tablet: 768,
    laptop: 1024,
    desktop: 1440,
  },
  grid: {
    columns: {
      mobile: 4,
      tablet: 8,
      laptop: 12,
    },
    gutter: 16,
    margin: {
      mobile: 20,
      tablet: 40,
      desktop: 44,
    },
    maxWidth: 1440,
  },
  headerHeight: {
    mobile: 64,
    tablet: 80,
  },
  radius: {
    s: 8,
    m: 16,
    l: 32,
  },
  zIndex: {
    header: 100,
    loader: 200,
    modal: 1000,
  },
  transitionDurationAndFunc: {
    all: `300ms ${easing}`,
    fast: `150ms ${easing}`,
  },
  spacing: (value = 1) => value * 4,
};

export default theme;
