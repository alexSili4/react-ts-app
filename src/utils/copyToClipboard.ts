// Повертає, чи копіювання вдалось. Раніше тут стояв порожній catch: у
// небезпечному контексті (http) navigator.clipboard недоступний узагалі, а в
// Safari кидає поза жестом користувача — і в обох випадках кнопка мовчки
// малювала галочку, наче все спрацювало.
const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard', error);

    return false;
  }
};

export default copyToClipboard;
