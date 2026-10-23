const getStringWithoutSpace = (string: string): string => {
  const result = string.replace(/\s+/g, '');

  return result;
};

export default getStringWithoutSpace;
