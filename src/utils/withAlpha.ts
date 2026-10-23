// Колір теми (#rrggbb) із заданою непрозорістю — для напівпрозорих відтінків
// токена, щоб не заводити в темі окремий rgba-колір під кожен.
const withAlpha = (hex: string, alpha: number): string => {
  const [r, g, b] = [1, 3, 5].map((start) =>
    parseInt(hex.slice(start, start + 2), 16)
  );

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default withAlpha;
