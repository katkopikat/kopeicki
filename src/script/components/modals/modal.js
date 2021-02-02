import { Modal } from 'bootstrap';
import createElement from '../../utils/create';

function createModal() {
  function create() {
    const html = `<div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" data-content></div>
      </div>
    </div>`;

    return createElement('div', 'modal fade', html);
  }

  const modalEl = create();

  const modalObj = new Modal(modalEl);

  document.body.append(modalEl);

  return Object.assign(modalObj, {
    setContent(elem) {
      const modalContent = modalEl.querySelector('[data-content]');
      const contentNested = modalEl.querySelector('.content');

      if (contentNested) modalContent.removeChild(contentNested);
      modalContent.append(elem);
    },
  });
}

export default createModal();
