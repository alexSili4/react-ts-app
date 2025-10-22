import { FC } from 'react';
import { IProps } from './GeneralContainer.types';
import { Container } from './GeneralContainer.styled';

const GeneralContainer: FC<IProps> = ({ children }) => {
  return <Container>{children}</Container>;
};

export default GeneralContainer;
