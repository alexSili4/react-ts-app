export { default as theme } from './theme';
export { default as PagePaths } from './pagePaths';
export { default as Links } from './links';
export { default as Symbols } from './symbols';
export { default as ClassNames } from './classNames';
export { default as navLinks } from './navLinks';
export { default as regExp } from './regExp';
export { default as common } from './common';

// Барель імпортують майже всі файли проєкту, включно з main.tsx і хедером,
// тож сюди — лише легкі константи. Важкі дані (кейси, каталоги, довгі тексти)
// тримати окремими модулями й імпортувати напряму: '@/constants/projects'.
// Дерево їх не струшує — рядки лежать усередині обʼєктів, які експортуються,
// і кожен файл, що імпортує барель, протягнув би їх у свій чанк.
//
// pagesMeta, motion і viewport теж не тут: їх імпортують напряму
// ('@/constants/pagesMeta'), бо вони тягнуть типи й утиліти, яким у барелі не
// місце.
