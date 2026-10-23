import { FC } from 'react';
import { IProps } from './PageContainer.types';
import { Container } from './PageContainer.styled';

const PageContainer: FC<IProps> = ({
  children,
  isFullHeight = false,
  isPositionRelative = false,
  isPositionAbsolute = false,
  isCenterXPosition = false,
  isPointerEventsNone = false,
  top,
}) => {
  return (
    <Container
      isFullHeight={isFullHeight}
      isPositionRelative={isPositionRelative}
      isPositionAbsolute={isPositionAbsolute}
      isCenterXPosition={isCenterXPosition}
      isPointerEventsNone={isPointerEventsNone}
      top={top}
    >
      {children}
    </Container>
  );
};

export default PageContainer;
