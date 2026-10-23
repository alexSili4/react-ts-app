import styled from '@emotion/styled';
import { css, Theme } from '@emotion/react';
import { Link } from 'react-router';
import { bodyRegular16, caption, h1 } from '@/styles/typography';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(4)}px;
  min-height: 100vh;
  text-align: center;
`;

export const Title = styled.h1`
  ${h1}
`;

export const Message = styled.p`
  ${bodyRegular16}
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// Посилання й кнопка мають виглядати однаково.
const action = ({ theme }: { theme: Theme }) => css`
  ${caption}
  margin-top: ${theme.spacing(4)}px;
  padding: ${theme.spacing(3)}px ${theme.spacing(6)}px;
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.text};
  border-radius: ${theme.radius.l}px;
  transition:
    color ${theme.transitionDurationAndFunc.all},
    background-color ${theme.transitionDurationAndFunc.all};

  &:is(:hover, :focus-visible) {
    color: ${theme.colors.background};
    background-color: ${theme.colors.text};
  }
`;

export const ActionLink = styled(Link)`
  ${action}
`;

export const ActionButton = styled.button`
  ${action}
`;
