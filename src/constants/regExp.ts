import { IRegExp } from '@/types/general.types';

const regExp: IRegExp = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // Міжнародний номер у тому вигляді, який дає formatPhoneNumber: «+» і від 8
  // до 15 цифр (межі E.164), між цифрами — не більше одного пробілу.
  phone: /^\+\d(?: ?\d){7,14}$/,
};

export default regExp;
