/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number} A 32bit integer
 */

export const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
