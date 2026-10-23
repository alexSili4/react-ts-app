import { Component, ErrorInfo, ReactNode } from 'react';
import { IProps, IState } from './ChunkErrorBoundary.types';
import { Button, Container, Message, Title } from './ChunkErrorBoundary.styled';
import {
  clearChunkReloadAttempt,
  getHasChunkReloadAttempt,
  markChunkReloadAttempt,
} from '@/utils';

// Формулювання помилки завантаження чанка в браузерах різне. «Unable to
// preload CSS» кидає сам Vite, коли зник CSS лінивого чанка.
const CHUNK_ERROR_PATTERN =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Loading chunk \d+ failed|Unable to preload CSS/i;

const getIsChunkLoadError = (error: Error): boolean =>
  CHUNK_ERROR_PATTERN.test(error.message);

// Класовий компонент тут не стилістичний вибір: ловити помилки рендеру вміє
// лише componentDidCatch, хука-еквівалента React не дає.
class ChunkErrorBoundary extends Component<IProps, IState> {
  state: IState = { hasError: false };

  static getDerivedStateFromError(error: Error): IState {
    return { hasError: true, isChunkError: getIsChunkLoadError(error) };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Не вдалося відрендерити сторінку', error, errorInfo);

    // Найчастіша причина — застарілий бандл у вкладці, відкритій до деплою:
    // свіже завантаження віддасть нові імена чанків. Тож перезавантажуємо
    // мовчки, але рівно один раз (прапорець знімає lazyPage, коли чанк
    // приїхав).
    if (!getIsChunkLoadError(error) || getHasChunkReloadAttempt()) {
      return;
    }

    markChunkReloadAttempt();
    window.location.reload();
  }

  private handleReloadClick = (): void => {
    clearChunkReloadAttempt();
    window.location.reload();
  };

  render(): ReactNode {
    const { hasError, isChunkError } = this.state;

    if (!hasError) {
      return this.props.children;
    }

    // Тексти літералами: хуки в класовому компоненті недоступні.
    return (
      <Container>
        <Title>Сторінка не завантажилась</Title>
        <Message>
          {isChunkError
            ? 'Схоже, сайт оновився, поки ця вкладка була відкрита. Перезавантажте сторінку — має запрацювати.'
            : 'Щось пішло не так під час відкриття сторінки. Спробуйте перезавантажити.'}
        </Message>
        <Button type='button' onClick={this.handleReloadClick}>
          Перезавантажити
        </Button>
      </Container>
    );
  }
}

export default ChunkErrorBoundary;
