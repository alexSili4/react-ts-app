import { FC } from 'react';
import { IProps } from './Section.types';
import { StyledSection } from './Section.styled';

const Section: FC<IProps> = ({ children }) => {
  return <StyledSection>{children}</StyledSection>;
};

export default Section;
