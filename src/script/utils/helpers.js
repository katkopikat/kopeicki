export function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

export function formatNumber(n) {
  const num = String(parseInt(n, 10));
  return num.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, '$1 ');
}
export function formatDate(date) {
  let dd = date.getDate();
  if (dd < 10) dd = `0${dd}`;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = `0${mm}`;

  let yy = date.getFullYear() % 100;
  if (yy < 10) yy = `0${yy}`;

  return `${dd}.${mm}.${yy}`;
}
