// shouldForwardProp для styled(Component). Emotion фільтрує невалідні
// HTML-атрибути лише для строкових тегів (styled.div); коли обгортають
// компонент — styled(Link), styled(motion.div) — усі пропси йдуть далі й
// осідають атрибутами на DOM-вузлі.
//
// Фільтрувати тут через @emotion/is-prop-valid не можна: він відкинув би й
// власні пропси компонента (`to` у Link). Тому
// перелічуємо саме ті пропси, що потрібні лише шаблону стилів.
const excludeProps = (
  ...styleOnlyProps: string[]
): ((prop: string) => boolean) => {
  const excluded = new Set(styleOnlyProps);

  return (prop: string) => !excluded.has(prop);
};

export default excludeProps;
