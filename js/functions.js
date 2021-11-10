const lowerCase = (str) => str.toLowerCase();
const normalize = (str) => str.normalize('NFD').replace(/\p{Diacritic}/gu, '');

// eslint-disable-next-line import/prefer-default-export
export const normalizeTag = (str) => {
  const newStr = lowerCase(normalize(str));
  const arrayStr = newStr.split('');
  const firstLetter = arrayStr[0].toUpperCase();
  arrayStr.splice(0, 1);
  return firstLetter + arrayStr.join('');
};
