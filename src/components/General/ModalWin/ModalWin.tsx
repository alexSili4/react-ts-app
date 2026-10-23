import { FC } from 'react';
import { createPortal } from 'react-dom';
import { IProps } from './ModalWin.types';

const ModalWin: FC<IProps> = ({ children, modalRoot }) => {
  return modalRoot && createPortal(children, modalRoot);
};

export default ModalWin;
