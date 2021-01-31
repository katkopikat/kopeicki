/* eslint-disable import/prefer-default-export */
export function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

export function formatNumber(n) {
  const num = String(parseInt(n, 10));
  // eslint-disable-next-line no-useless-concat
  return num.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, '$1' + ' ');
}
