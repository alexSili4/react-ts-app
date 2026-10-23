import styled from '@emotion/styled';
import { Link } from 'react-router';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)}px;
  padding-top: ${({ theme }) => theme.spacing(30)}px;
  padding-bottom: ${({ theme }) => theme.spacing(30)}px;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.h1};
  line-height: ${({ theme }) => theme.lineHeight.heading};
`;

export const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSize.body};
  line-height: ${({ theme }) => theme.lineHeight.body};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const HomeLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSize.caption};
  line-height: ${({ theme }) => theme.lineHeight.body};
  margin-top: ${({ theme }) => theme.spacing(4)}px;
  padding: ${({ theme }) => theme.spacing(3)}px ${({ theme }) => theme.spacing(6)}px;
  border: 1px solid ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.l}px;
  transition:
    color ${({ theme }) => theme.transitionDurationAndFunc.all},
    background-color ${({ theme }) => theme.transitionDurationAndFunc.all};

  &:is(:hover, :focus-visible) {
    color: ${({ theme }) => theme.colors.background};
    background-color: ${({ theme }) => theme.colors.text};
  }
`;
