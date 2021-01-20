// const container = document.querySelector('.currency-container');
// let currencyList = [];
// let currentCurrency = 'RUB'; // тащим из БД

export default async function getCurrencylist() {
  const url = 'https://free.currconv.com/api/v7/currencies?apiKey=9907c9f725cc3b503486';
  const response = await fetch(url);
  const obj = await response.json();
  return Object.keys(obj.results);
}

// export function renderCurrencyList() {
//   const dropDown = document.createElement('select');
//   container.appendChild(dropDown);

//   currencyList.forEach((it) => {
//     const currency = document.createElement('option');
//     currency.setAttribute('name', it);
//     currency.innerText = it;

//     if (it === 'RUB') {
//       currency.setAttribute('selected', 'selected');
//     }
//     dropDown.appendChild(currency);
//   });
// }
