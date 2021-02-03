import translatePage from '../components/settings/language';

export function getLanguage() {
  return localStorage.getItem('lang') || 'en';
}

export function setLanguage(value) {
  localStorage.setItem('lang', value);
  translatePage();
}

export function getSound() {
  return localStorage.getItem('sound') || 'off';
}

export function setSound(value) {
  localStorage.setItem('sound', value);
}

export function getTheme() {
  return localStorage.getItem('theme') || 'dark';
}

export function setTheme(value) {
  localStorage.setItem('theme', value);
  document.documentElement.setAttribute('theme', value);
}
