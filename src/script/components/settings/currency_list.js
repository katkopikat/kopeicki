const container = document.querySelector('.currency-container');
let currencyList = [];
// let currentCurrency = 'RUB'; // тащим из БД

export async function getCurrencieslist(requestLink) {
  const response = await fetch(requestLink);
  const obj = await response.json();
  currencyList = Object.keys(obj.results);
  return currencyList;
}

export function renderCurrencyList() {
  const dropDown = document.createElement('select');
  container.appendChild(dropDown);

  currencyList.forEach((it) => {
    const currency = document.createElement('option');
    currency.setAttribute('name', it);
    currency.innerText = it;

    if (it === 'RUB') {
      currency.setAttribute('selected', 'selected');
    }
    dropDown.appendChild(currency);
  });
}
