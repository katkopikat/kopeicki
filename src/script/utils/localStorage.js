import translatePage from '../components/settings/language';

export function getLanguage() {
  return localStorage.getItem('lang') || 'en';
}

export function setLanguage(value) {
  localStorage.setItem('lang', value);
  translatePage();
}
