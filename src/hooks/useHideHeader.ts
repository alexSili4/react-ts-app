import { createContext, useContext, useLayoutEffect } from 'react';

// Сеттер прапорця «хедер схований», який тримає SharedLayout. Хедер живе в
// SharedLayout над усіма маршрутами, а 404 відкривається і за '*', і за
// PagePaths.notFound (туди роблять Navigate динамічні сторінки з неіснуючим
// id), тож вирішувати за адресою там нема з чим — про себе знає лише сама
// сторінка.
export const HeaderVisibilityContext = /* @__PURE__ */ createContext<
  (isHidden: boolean) => void
>(() => {});

// Ховає хедер, поки змонтована сторінка, що його викликала (404).
// useLayoutEffect — щоб хедер зник до першого малювання сторінки, без спалаху.
const useHideHeader = (): void => {
  const setIsHeaderHidden = useContext(HeaderVisibilityContext);

  useLayoutEffect(() => {
    setIsHeaderHidden(true);

    return () => {
      setIsHeaderHidden(false);
    };
  }, [setIsHeaderHidden]);
};

export default useHideHeader;
