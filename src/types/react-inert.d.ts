// React 18 і його типи не знають атрибута inert (зʼявився в React 19). Невідомий
// атрибут React 18 рендерить як є, тож inert='' дає в DOM inert="".
import 'react';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    inert?: '';
  }
}
