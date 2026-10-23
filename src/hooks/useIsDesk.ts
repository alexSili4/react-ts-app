import { theme } from '@/constants';
import useMediaQuery from './useMediaQuery';

const useIsDesk = (): boolean => {
  const isDesk = useMediaQuery(`(min-width: ${theme.breakpoints.desktop}px)`);

  return isDesk;
};

export default useIsDesk;
