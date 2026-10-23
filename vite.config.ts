import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const REACT_PACKAGES = new Set(['react', 'react-dom', 'scheduler', 'react-router']);

// Групуємо лише ті бібліотеки, які й так тягне entry: винесені в окремі чанки,
// вони перестають перезавантажуватись через кожну правку коду застосунку.
//
// Свідомо без загального vendor-катчола: він згріб би сюди й бібліотеки, які
// вантажаться асинхронно лише на окремих сторінках (слайдер, Lottie), і
// зробив би їх обовʼязковими. Тому — тільки поіменний перелік.
const getVendorChunk = (id: string): string | undefined => {
  // Віртуальний модуль rollup зі спільними CJS-interop-хелперами. Якщо його не
  // закріпити, він осідає у випадковому вендорному чанку, і той стає
  // залежністю решти — виникає цикл імпортів між чанками й падіння
  // "Cannot access ... before initialization" ще до першого рендеру.
  // Власний листовий чанк робить граф ациклічним за побудовою.
  if (id.includes('commonjsHelpers')) {
    return 'cjs-helpers';
  }

  const pkg = id.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/)?.[1];

  if (!pkg) {
    return undefined;
  }

  // Emotion свідомо в одному чанку з React, а не окремо. React — CJS, і
  // rollup виносить interop-хелпери в спільний чанк; коли emotion окремо,
  // хелпер осідає в ньому, react-чанк починає імпортувати emotion, а emotion
  // імпортує react — цикл ESM-біндингів і падіння
  // "Cannot access ... before initialization" ще до рендеру.
  if (pkg.startsWith('@emotion/') || REACT_PACKAGES.has(pkg)) {
    return 'react';
  }

  if (['framer-motion', 'motion-dom', 'motion-utils'].includes(pkg)) {
    return 'framer-motion';
  }

  return undefined;
};

export default defineConfig({
  plugins: [
    // Аліаси імпортів — з paths у tsconfig.json, єдине місце, де вони
    // оголошені. Окремого resolve.alias тут немає й не треба.
    tsconfigPaths(),
    react(),
    // Усі SVG через ?react — декор або іконки всередині вже названих посилань
    // і кнопок. Без aria-hidden Chrome віддає кожен окремим безіменним
    // «зображенням». Змістовній іконці — role='img' і aria-label точково.
    svgr({ svgrOptions: { svgProps: { 'aria-hidden': 'true' } } }),
  ],
  // Сайт у підтеці (бекенд віддає збірку з /frontend/) — base: '/frontend/',
  // а адреси файлів із public/ будувати через getPublicUrl. Докладніше —
  // docs/backend-integration.md.
  base: '/',
  build: {
    // Шрифти й картинки завжди окремими файлами з хешем, а не base64 у
    // бандлі: так вони кешуються незалежно від коду.
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: getVendorChunk,
      },
    },
  },
});
