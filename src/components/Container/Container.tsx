import { FC } from 'react';
import { IProps } from './Container.types';
import { StyledContainer } from './Container.styled';

const Container: FC<IProps> = ({ children }) => {
  return <StyledContainer>{children}</StyledContainer>;
};

export default Container;
