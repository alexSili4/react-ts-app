import path from 'node:path';
import { build } from 'esbuild';

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
    logLevel: 'silent',
  });

  return import(
    `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`
  );
};

export default importTs;
