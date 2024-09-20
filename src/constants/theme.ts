declare module '@emotion/react' {
  export interface Theme extends ITheme {}
}

interface ITheme {
  padding: {
    container: number;
  };
  containerWidth: {
    desktop: number;
    mobile: number;
  };
  transitionDurationAndFunc: string;
  spacing: (value?: number) => string;
}

const theme: ITheme = {
  // colors: {  },
  // fontFamily: {  },
  // fontWeight: {  },
  // fontSize: {  },
  padding: {
    container: 16,
  },
  // borderRadius: {  },
  containerWidth: {
    desktop: 1376,
    mobile: 375,
  },
  // shadows: {  },
  transitionDurationAndFunc: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  spacing: (value = 1) => `${value * 4}px`,
};

export default theme;
