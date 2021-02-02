import app from '../../app';

export default async function getExchangeData(amount, fromCurrency) {
  const toCurrency = app.user.currency.toUpperCase();
  if (!+amount || toCurrency === fromCurrency) return amount;
  const endpoint = `https://free.currconv.com/api/v7/convert?apiKey=9907c9f725cc3b503486&q=${fromCurrency}_${toCurrency},${toCurrency}_${fromCurrency}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  const exchangeData = { ...data };
  const base = exchangeData.results[`${fromCurrency}_${toCurrency}`];
  return (amount * base.val).toFixed(2);
}
