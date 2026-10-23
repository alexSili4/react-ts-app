import { FC } from 'react';
import { IProps } from './GeneralContainer.types';
import { Container } from './GeneralContainer.styled';

const GeneralContainer: FC<IProps> = ({
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

export default GeneralContainer;
