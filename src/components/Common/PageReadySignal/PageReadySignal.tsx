import { FC, useEffect } from 'react';
import { clearChunkReloadAttempt } from '@/utils/chunkReloadAttempt';

// Стоїть у тому ж Suspense, що й сторінка, тож ефект спрацьовує лише тоді, коли
// її лінивий чанк завантажився й відрендерився. Сторінка є — отже,
// автоперезавантаження ChunkErrorBoundary (якщо було) спрацювало, і на
// наступний деплой його можна дозволити знову. Якщо чанк недоступний насправді,
// сюди не дійде, і прапорець не дасть зациклитись.
//
// Тому лінивим частинам сторінки власний Suspense не можна: з ним сигнал
// пішов би, щойно приїхала обгортка, а не сам вміст.
const PageReadySignal: FC = () => {
  useEffect(() => {
    clearChunkReloadAttempt();
  }, []);

  return null;
};

export default PageReadySignal;
