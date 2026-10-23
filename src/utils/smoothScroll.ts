import { ISmoothScrollProps } from '@/types/functions.types';

const smoothScroll = ({ id, block = 'start' }: ISmoothScrollProps) => {
  const targetElement = document.getElementById(id);

  targetElement?.scrollIntoView({
    behavior: 'smooth',
    block,
  });
};

export default smoothScroll;
