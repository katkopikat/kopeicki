export default async function getExchangeData(ammount, fromCurrency) {
  const toCurrency = (localStorage.getItem('currency')).toUpperCase();
  if (toCurrency === fromCurrency) return ammount;
  const endpoint = `https://free.currconv.com/api/v7/convert?apiKey=9907c9f725cc3b503486&q=${fromCurrency}_${toCurrency},${toCurrency}_${fromCurrency}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  const exchangeData = { ...data };
  const base = exchangeData.results[`${fromCurrency}_${toCurrency}`];
  return (ammount * base.val).toFixed(2);
}
