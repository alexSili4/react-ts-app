import styled from '@emotion/styled';
import containerPadding from '@/styles/containerPadding';
import { IStyledContainerProps } from './PageContainer.types';

export const Container = styled.div<IStyledContainerProps>`
  position: ${({ isPositionRelative, isPositionAbsolute }) =>
    isPositionRelative ? 'relative' : isPositionAbsolute ? 'absolute' : ''};
  top: ${({ top }) => top ?? 'auto'};
  left: ${({ isCenterXPosition }) => isCenterXPosition && '50%'};
  width: 100%;
  max-width: ${({ theme }) => theme.grid.maxWidth}px;
  height: ${({ isFullHeight }) => isFullHeight && '100%'};
  ${containerPadding}
  margin-left: auto;
  margin-right: auto;
  pointer-events: ${({ isPointerEventsNone }) => isPointerEventsNone && 'none'};
  transform: ${({ isCenterXPosition }) =>
    isCenterXPosition && 'translateX(-50%)'};
`;
