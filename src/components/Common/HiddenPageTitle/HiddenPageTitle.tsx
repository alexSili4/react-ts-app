import { FC } from 'react';
import { IProps } from './HiddenPageTitle.types';
import { Title } from './HiddenPageTitle.styled';

const HiddenPageTitle: FC<IProps> = ({ title }) => {
  return <Title>{title}</Title>;
};

export default HiddenPageTitle;
