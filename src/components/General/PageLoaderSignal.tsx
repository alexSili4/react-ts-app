import { useEffect } from 'react';
import { clearChunkReloadAttempt } from '@/utils/chunkReloadAttempt';

// Стоїть у тому ж Suspense, що й сторінка, тож ефект спрацьовує лише тоді, коли
// її лінивий чанк завантажився й відрендерився. Тому лінивим частинам сторінки
// власний Suspense не можна: з ним сигнал пішов би, щойно приїхала обгортка, а
// не сам вміст.
const PageLoaderSignal = () => {
  useEffect(() => {
    // Знімає прелоадер з index.html
    if (typeof window.updateLoader === 'function') {
      window.updateLoader(100);
    }

    // Сторінка є — отже, автоперезавантаження ChunkErrorBoundary (якщо було)
    // спрацювало, і на наступний деплой його можна дозволити знову. Якщо чанк
    // недоступний насправді, сюди не дійде, і прапорець не дасть зациклитись.
    clearChunkReloadAttempt();
  }, []);

  return null;
};

export default PageLoaderSignal;
