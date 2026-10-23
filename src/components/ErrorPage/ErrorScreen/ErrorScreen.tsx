import { FC } from 'react';
import GeneralContainer from '@GeneralComponents/GeneralContainer';
import { IProps } from './ErrorScreen.types';
import {
  ActionButton,
  ActionLink,
  Container,
  Message,
  Title,
} from './ErrorScreen.styled';

// Спільний екран для 404 і для ChunkErrorBoundary: межа помилок стоїть над
// усім застосунком, тож показує той самий вигляд, лише з кнопкою замість
// посилання. Оформлення 404 з макета — тут.
const ErrorScreen: FC<IProps> = ({
  title,
  message,
  actionLabel,
  actionTo,
  onActionClick,
}) => {
  return (
    <GeneralContainer isFullHeight>
      <Container>
        <Title>{title}</Title>
        <Message>{message}</Message>
        {actionTo ? (
          <ActionLink to={actionTo}>{actionLabel}</ActionLink>
        ) : (
          <ActionButton type='button' onClick={onActionClick}>
            {actionLabel}
          </ActionButton>
        )}
      </Container>
    </GeneralContainer>
  );
};

export default ErrorScreen;
