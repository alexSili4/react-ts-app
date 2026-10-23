import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const DOT_SIZE = 18;
const CONTAINER_SIZE = 80;

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

export const Dot = styled.span<{ order: number }>`
  width: ${DOT_SIZE}px;
  height: ${DOT_SIZE}px;
  background-color: #808080;
  border-radius: 50%;
  opacity: 0.2;
  animation: ${blink} 1.2s ease-in-out infinite;
  animation-delay: ${({ order }) => order * 0.16}s;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.6;
  }
`;
