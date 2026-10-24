import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { IStyledDotProps } from './Loader.types';

const DOT_SIZE = 18;
const CONTAINER_SIZE = 80;
const DOT_DELAY_STEP_MS = 160;

const blink = keyframes`
  0%, 80%, 100% {
    opacity: 0.2;
  }
  40% {
    opacity: 1;
  }
`;

export const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  z-index: ${({ theme }) => theme.zIndex.loader};

  display: flex;
  align-items: center;
  justify-content: space-between;
  width: ${CONTAINER_SIZE}px;
  height: ${DOT_SIZE}px;
`;

export const Dot = styled.span<IStyledDotProps>`
  width: ${DOT_SIZE}px;
  height: ${DOT_SIZE}px;
  background-color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: 50%;
  opacity: 0.2;
  animation: ${blink} ${({ theme }) => theme.transitionDurationAndFunc.loader}
    infinite;
  animation-delay: ${({ order }) => order * DOT_DELAY_STEP_MS}ms;

  /*
    Виняток із «не дублювати GlobalStyles»: глобальне правило лишає одну
    коротку ітерацію, і крапки застигли б на opacity 0.2 — лоадер зник би.
  */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.6;
  }
`;
