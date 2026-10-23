// Лічильник, а не прапорець: модалки накладаються (з меню відкривається
// інша модалка), і та, що закриється першою, не повинна знімати блокування,
// поставлене іншою. Якби кожен хук писав у document.body.style напряму,
// будь-яке зняття скидало б стан для всіх.
//
// Ширину смуги прокрутки тут не компенсуємо: місце під неї тримає
// scrollbar-gutter: stable на html (GlobalStyles), тож сторінка й fixed-хедер
// не зсуваються, коли смуга зникає.
let lockCount = 0;
let savedOverflow = '';

export const getIsBodyScrollLocked = (): boolean => lockCount > 0;

export const lockBodyScroll = (): void => {
  lockCount += 1;

  if (lockCount > 1) {
    return;
  }

  savedOverflow = document.body.style.overflow;

  document.body.style.overflow = 'hidden';
};

export const unlockBodyScroll = (): void => {
  if (lockCount === 0) {
    return;
  }

  lockCount -= 1;

  if (lockCount > 0) {
    return;
  }

  // Повертаємо те, що було, а не порожній рядок: сторінка могла мати власні
  // інлайнові стилі до того, як модалку відкрили.
  document.body.style.overflow = savedOverflow;
};
