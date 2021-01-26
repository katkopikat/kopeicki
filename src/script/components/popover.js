import { Popover } from 'bootstrap';

export default function showPopover(elem, errorMessage, placement) {
  const popover = new Popover(elem, {
    content: errorMessage,
    placement,
    container: 'body',
    trigger: 'manual',
  });

  popover.show();

  setTimeout(() => {
    if (popover) popover.dispose();
  }, 5000);
}
