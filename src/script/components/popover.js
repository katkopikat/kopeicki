import { Popover } from 'bootstrap';
import { playSound } from './settings/sound';

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

  playSound('error');
  popover.show();

  setTimeout(() => {
    popover.hide();
  }, 3000);
}
