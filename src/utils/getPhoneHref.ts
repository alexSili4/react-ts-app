import getValidPhoneNumber from './getValidPhoneNumber';

const getPhoneHref = (number: string): string =>
  `tel:+${getValidPhoneNumber(number)}`;

export default getPhoneHref;
