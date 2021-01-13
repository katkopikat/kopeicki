import { getCurrencieslist, renderCurrencyList } from './currency_list';

const endpointCurencyList = 'https://free.currconv.com/api/v7/currencies?apiKey=9907c9f725cc3b503486';

export default function displayCurrencyList() {
  getCurrencieslist(endpointCurencyList).then(() => renderCurrencyList());
}
