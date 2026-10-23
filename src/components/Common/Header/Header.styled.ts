import styled from '@emotion/styled';
import { Link } from 'react-router';

export const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ theme }) => theme.headerHeight.mobile}px;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    height: ${({ theme }) => theme.headerHeight.tablet}px;
  }
`;

export const LogoLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize.body};
  color: ${({ theme }) => theme.colors.text};
  transition: color ${({ theme }) => theme.transitionDurationAndFunc.all};

  &:is(:hover, :focus-visible) {
    color: ${({ theme }) => theme.colors.accent};
  }
`;
