import { FC } from 'react';
import PageContainer from '@CommonComponents/PageContainer';
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
    <PageContainer isFullHeight>
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
    </PageContainer>
  );
};

export default ErrorScreen;
