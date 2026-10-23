import { theme } from '@/constants';

// Ширина у vw, що зупиняється там, де зупиняється контейнер сітки (maxWidth):
// на ширших екранах контент не росте, тож і блок усередині не має рости.
// До maxWidth — звичайні vw.
const cappedVw = (vw: number): string =>
  `min(${vw}vw, ${Math.round(vw * theme.grid.maxWidth) / 100}px)`;

export default cappedVw;
