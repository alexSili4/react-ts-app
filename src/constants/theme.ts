declare module '@emotion/react' {
  export interface Theme extends ITheme {}
}

interface ITheme {
  colors: {
    // Той самий колір — в inline-стилі й theme-color в index.html.
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
    error: string;
    white: string;
    black: string;
    backdrop: string;
  };
  fontFamily: {
    main: string;
  };
  // Імена — як у Figma, щоб дизайнер і код говорили однією мовою.
  fontSize: {
    h1: string;
    body: string;
    caption: string;
  };
  lineHeight: {
    heading: number;
    body: number;
  };
  // Mobile-first: значення — min-width.
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
    all: string;
    fast: string;
    loader: string;
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
  fontFamily: {
    main: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  // clamp() тягне кегль лінійно від 375 px вікна (мінімум) до 1440 (максимум):
  // для пари (min, max) — clamp(min, a + b·vw, max), де
  // b = (max − min) / (1440 − 375) · 100, a = min − b · 3.75.
  fontSize: {
    h1: 'clamp(32px, 22.14px + 2.63vw, 60px)',
    body: '16px',
    caption: '14px',
  },
  lineHeight: {
    heading: 1.2,
    body: 1.5,
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
    loader: '1200ms ease-in-out',
  },
  spacing: (value = 1) => value * 4,
};

export default theme;
