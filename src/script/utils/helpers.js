/* eslint-disable import/prefer-default-export */
export function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}
