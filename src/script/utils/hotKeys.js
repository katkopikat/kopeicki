import pubsub from '../pubsub';
import modal from '../components/modals/modal';
import transactionModal from '../components/modals/transactionModal';
import accountModal from '../components/modals/accountModal';

/* ------------ HOT KEYS ---------------
      Alt + T --> Open transactions page
      Alt + S --> Open statistics page
      Alt + H --> Open history page
      Alt + E --> Open expenses modal
      Alt + I --> Open income modal
      Alt + A --> Open account modal
  */

export default function hotKeys() {
  const pressed = new Set();

  document.addEventListener('keydown', (e) => {
    pressed.add(e.code);

    if (!window.location.href.includes('login')) {
      if (pressed.size === 2 && e.altKey) {
        if (pressed.has('KeyT')) pubsub.publish('navigateTo', '/');
        if (pressed.has('KeyS')) pubsub.publish('navigateTo', '/statistics');
        if (pressed.has('KeyH')) pubsub.publish('navigateTo', '/history');
        if (pressed.has('KeyE')) {
          modal.setContent(transactionModal({ type: 'expenses' }));
          modal.show();
        }
        if (pressed.has('KeyI')) {
          modal.setContent(transactionModal({ type: 'income' }));
          modal.show();
        }
        if (pressed.has('KeyA')) {
          modal.setContent(accountModal({ type: 'accounts' }));
          modal.show();
        }

        pressed.clear();
      }
    }
  });

  document.addEventListener('keyup', (e) => {
    pressed.delete(e.code);
  });
}
