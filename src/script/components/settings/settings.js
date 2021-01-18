import switchTheme from './theme';
import { switchLanguage } from './language';

export default function toggleSettings() {
  switchTheme();
  switchLanguage();
}
