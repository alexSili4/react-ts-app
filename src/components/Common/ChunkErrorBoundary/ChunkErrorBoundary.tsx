import { Component, ErrorInfo, ReactNode } from 'react';
import ErrorScreen from '@ErrorPageComponents/ErrorScreen';
import { IProps, IState } from './ChunkErrorBoundary.types';
import {
  clearChunkReloadAttempt,
  getHasChunkReloadAttempt,
  markChunkReloadAttempt,
} from '@/utils/chunkReloadAttempt';

// Rollup віддає ліниві сторінки окремими файлами з хешем в імені. Вкладка,
// відкрита до деплою, рано чи пізно попросить чанк, якого на сервері вже
// немає. Формулювання помилки в браузерах різне, тому перевіряємо кілька
// варіантів. «Unable to preload CSS» кидає сам Vite, коли зник CSS лінивого
// чанка, — ще до import() JS, тож до межі доходить саме цей текст.
const CHUNK_ERROR_PATTERN =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Loading chunk \d+ failed|Unable to preload CSS/i;

const getIsChunkLoadError = (error: Error): boolean =>
  CHUNK_ERROR_PATTERN.test(error.message);

// Класовий компонент тут не стилістичний вибір: ловити помилки рендеру вміє
// лише componentDidCatch, хука-еквівалента React не дає досі.
class ChunkErrorBoundary extends Component<IProps, IState> {
  state: IState = { hasError: false };

  static getDerivedStateFromError(error: Error): IState {
    return { hasError: true, isChunkError: getIsChunkLoadError(error) };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Не вдалося відрендерити сторінку', error, errorInfo);

    if (!getIsChunkLoadError(error)) {
      return;
    }

    // Найчастіша причина — застарілий бандл у відкритій вкладці. Свіже
    // завантаження сторінки віддасть новий бандл із новими іменами чанків, і
    // проблема зникне сама. Тому перезавантажуємо мовчки, але рівно один раз:
    // якщо після цього чанк усе одно не приїхав, справа не в деплої, і
    // користувачу треба показати повідомлення, а не крутити його по колу.
    // Прапорець знімає PageLoaderSignal, щойно сторінка відрендерилась, —
    // інакше після першого ж успішного перезавантаження він жив би до кінця
    // сесії вкладки, і на наступному деплої вона вже не оновилась би сама.
    if (getHasChunkReloadAttempt()) {
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
    const { children } = this.props;

    if (!hasError) {
      return children;
    }

    // Той самий екран, що й у 404, — лише з іншим текстом і кнопкою замість
    // посилання: межа стоїть над усім застосунком, і навігація звідси однаково
    // нікуди б не привела. Тексти літералами: хуки (useTranslation) у
    // класовому компоненті недоступні.
    return (
      <ErrorScreen
        title='Сторінка не завантажилась'
        message={
          isChunkError
            ? 'Схоже, сайт оновився, поки ця вкладка була відкрита. Перезавантажте сторінку — має запрацювати.'
            : 'Щось пішло не так під час відкриття сторінки. Спробуйте перезавантажити.'
        }
        actionLabel='Перезавантажити'
        onActionClick={this.handleReloadClick}
      />
    );
  }
}

export default ChunkErrorBoundary;
