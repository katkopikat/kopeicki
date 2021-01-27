import { Popover } from 'bootstrap';
import { getSound } from '../utils/localStorage';

export default function showPopover(elem, errorMessage, placement) {
  const popover = new Popover(elem, {
    content: errorMessage,
    placement: 'auto',
    container: 'body',
    trigger: 'manual',
    popperConfig: {
      modifiers: [
        {
          name: 'flip',
          options: {
            allowedAutoPlacements: [placement],
          },
        },
      ],
    },
  });

  if (getSound() === 'on') {
    const soundError = new Audio();
    soundError.src = '/src/assets/sounds/error.mp3';
    soundError.play();
  }

  popover.show();

  setTimeout(() => {
    popover.hide();
  }, 3000);
}
