import { Popover } from 'bootstrap';
import { getSound } from '../utils/localStorage';

export default function showPopover(elem, errorMessage, placement) {
  const popover = new Popover(elem, {
    content: errorMessage,
    placement,
    container: 'body',
    trigger: 'manual',
  });

  if (getSound() === 'on') {
    const soundError = new Audio();
    soundError.src = '/src/assets/sounds/error.mp3';
    soundError.play();
  }

  popover.show();

  setTimeout(() => {
    if (popover) popover.dispose();
  }, 5000);
}
