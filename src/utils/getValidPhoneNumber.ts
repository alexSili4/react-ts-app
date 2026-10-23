import { Symbols } from '@/constants';
import getStringWithoutSpace from './getStringWithoutSpace';

const getValidPhoneNumber = (number: string): string => {
  const stringWithoutSpace = getStringWithoutSpace(number);
  const symbols = Array.from(stringWithoutSpace);
  const numbers = symbols.filter((symbol) => !Number.isNaN(Number(symbol)));

  const result = numbers.join(Symbols.emptyString);

  return result;
};

export default getValidPhoneNumber;
