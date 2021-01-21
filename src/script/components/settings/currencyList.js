export default async function getCurrencylist() {
  const url = 'https://free.currconv.com/api/v7/currencies?apiKey=9907c9f725cc3b503486';
  const response = await fetch(url);
  const obj = await response.json();
  return Object.keys(obj.results);
}
