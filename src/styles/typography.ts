import { css } from '@emotion/react';
import { theme } from '@/constants';

// Типографічна шкала з макета: імена — як у Figma, щоб дизайнер і код
// говорили однією мовою (наприклад, <стиль><накреслення><кегль>). Значення
// нижче — заготовка, замінити шкалою проєкту.
//
// Тема береться імпортом, а не з пропсів: css з @emotion/react серіалізується
// одразу, функції-інтерполяції в ньому не отримали б theme.
//
// clamp() тягне кегль лінійно від 375 px вікна (мінімум) до 1440 (максимум):
// для пари (min, max) — clamp(min, a + b·vw, max), де
// b = (max − min) / (1440 − 375) · 100, a = min − b · 3.75.

export const h1 = css`
  font-family: ${theme.fontFamily.main};
  font-weight: 400;
  font-size: clamp(32px, 22.14px + 2.63vw, 60px);
  line-height: 120%;
`;

export const h2 = css`
  font-family: ${theme.fontFamily.main};
  font-weight: 400;
  font-size: clamp(24px, 18.37px + 1.5vw, 40px);
  line-height: 130%;
`;

export const bodyRegular16 = css`
  font-family: ${theme.fontFamily.main};
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
`;

export const caption = css`
  font-family: ${theme.fontFamily.main};
  font-weight: 400;
  font-size: 14px;
  line-height: 140%;
`;
