import path from 'node:path';
import { build } from 'esbuild';

// Імпорти ассетів (картинки, відео, шрифти, SVG?react) у Node не мають сенсу:
// модулі з даними їх тягнуть, а скриптам вони не потрібні. Віддаємо порожній
// рядок замість адреси — тому og:image у метаданих лише з public/.
const ASSET_IMPORT = /\.(svg|png|jpe?g|webp|avif|gif|mp4|webm|woff2?)(\?.*)?$/;

const assetStubs = {
  name: 'asset-stubs',
  setup(pluginBuild) {
    pluginBuild.onResolve({ filter: ASSET_IMPORT }, (args) => ({
      path: args.path,
      namespace: 'asset-stub',
    }));
    pluginBuild.onLoad({ filter: /.*/, namespace: 'asset-stub' }, () => ({
      contents: 'export default "";',
      loader: 'js',
    }));
  },
};

// Виконати TS-модуль із src у Node: скрипти беруть перелік мов і метадані
// сторінок з тих самих файлів, що й застосунок, а не дублюють їх. esbuild —
// у devDependencies; аліаси @/… він бере з tsconfig.
const importTs = async (file) => {
  const result = await build({
    entryPoints: [path.resolve(file)],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    tsconfig: path.resolve('tsconfig.json'),
    plugins: [assetStubs],
    logLevel: 'silent',
  });

  return import(
    `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`
  );
};

export default importTs;
