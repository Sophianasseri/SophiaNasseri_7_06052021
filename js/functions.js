const lowerCase = (str) => str.toLowerCase();
export const normalize = (str) => str.normalize('NFD').replace(/\p{Diacritic}/gu, '');

export const normalizeTag = (str) => {
  const newStr = lowerCase(normalize(str));
  return newStr.charAt(0).toUpperCase() + newStr.slice(1);
};
