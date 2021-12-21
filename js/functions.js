const lowerCase = (str) => str.toLowerCase();
export const normalize = (str) => str.normalize('NFD').replace(/\p{Diacritic}/gu, '');

export const normalizeTag = (str) => {
  const newStr = lowerCase(normalize(str));
  const arrayStr = newStr.split('');
  const firstLetter = arrayStr[0].toUpperCase();
  arrayStr.splice(0, 1);
  return firstLetter + arrayStr.join('');
};
