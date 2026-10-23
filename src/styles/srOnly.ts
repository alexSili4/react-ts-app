import { css } from '@emotion/react';

// Текст лишається в дереві доступності, але візуально зникає і не займає
// місця в розкладці: канонічний sr-only, один на весь проєкт.
//
// Раніше HiddenSectionTitle ховався через position: absolute + transform:
// scale(0). Скрінрідер його так само читав (перевірено в Chrome), але
// елемент зберігав власну коробку (offsetWidth × offsetHeight), а на
// HiddenPageTitle тим часом уже стояв цей варіант — два однакові компоненти
// з різним CSS.
const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

export default srOnly;
