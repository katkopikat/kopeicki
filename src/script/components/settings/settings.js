import switchTheme from './theme';
import displayCurrencyList from './currency';
import { switchLanguage } from './language';

export default function renderSettingsPage() {
  switchTheme();
  displayCurrencyList();
  switchLanguage();
}
