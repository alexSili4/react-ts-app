const enum Symbols {
  space = ' ',
  emptyString = '',
  comma = ', ',
  // Розмітка — лише для авторських текстів із констант, які свідомо йдуть
  // через innerHTML. Для повідомлень, що приходять із мережі, є newLine:
  // їх рендеримо текстом, а перенос робить white-space: pre-line.
  break = '<br/>',
  newLine = '\n',
}

export default Symbols;
