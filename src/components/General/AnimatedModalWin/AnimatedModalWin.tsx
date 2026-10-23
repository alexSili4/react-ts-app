import { FC } from 'react';
import { AnimatePresence } from 'framer-motion';
import { IProps } from './AnimatedModalWin.types';

const AnimatedModalWin: FC<IProps> = ({ showModalWin, children }) => {
  return <AnimatePresence>{showModalWin && children}</AnimatePresence>;
};

export default AnimatedModalWin;
