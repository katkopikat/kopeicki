import translatePage from '../components/settings/language';

export function getLanguage() {
  return localStorage.getItem('lang') || 'en';
}

export function setLanguage(value) {
  localStorage.setItem('lang', value);
  translatePage();
}

export function getSound() {
  return localStorage.getItem('sound') || false;
}

export function setSound(value) {
  localStorage.setItem('sound', value);
}
