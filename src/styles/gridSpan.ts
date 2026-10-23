import { theme } from '@/constants';

// Ширина span колонок із columns у сітці theme.grid, як calc() для CSS.
// margin — поле з кожного боку, коли елемент рахується від повної ширини
// шару, а не від контейнера, у якому поля вже відступлено.
const gridSpan = (span: number, columns: number, margin = 0): string => {
  const { gutter } = theme.grid;

  return `calc((100% - ${2 * margin}px - ${(columns - 1) * gutter}px) / ${columns} * ${span} + ${(span - 1) * gutter}px)`;
};

export default gridSpan;
