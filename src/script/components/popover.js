import { Popover } from 'bootstrap';
import { getLanguage } from '../utils/localStorage';

export default function showPopover(elem) {
  const lang = getLanguage();

  const errorMessage = {
    en: 'Please fill out all the fields',
    ru: 'Пожалуйста, заполните все поля',
    be: 'Калі ласка, запоўніце ўсе палі',
  };

  const popover = new Popover(elem, {
    content: errorMessage[lang],
    placement: 'right',
    container: 'body',
    trigger: 'focus',
  });

  popover.show();
}
