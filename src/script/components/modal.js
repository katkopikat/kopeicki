import { Modal } from 'bootstrap';
import createElement from '../utils/create';
import { insertAfter, createSelect } from '../utils/DOM';

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

export const modal = createModal();

export function transactionModal(options) {
  const titleOptions = {
    accounts: 'I dont know what to do with the money',
    expenses: 'Spent',
    income: 'Earned',
  };

  const saveBtnOptions = {
    accounts: 'Done!',
    expenses: 'Spent it!',
    income: 'Received!',
  };

  document.querySelector('.modal-content').className = `modal-content ${options.type}`;

  const today = new Date().toISOString().split('T')[0];

  const wrap = createElement('div', 'content');

  wrap.insertAdjacentHTML(
    'afterbegin',
    `
    <h5 class="modal-body__title">${titleOptions[options.type]}</h5>
    <span>BYN</span>
    <span data-from>from</span>
    <span data-to>on</span>
    <div class="form-floating">
      <label for="description" class="textarea-label">Do you have anything to say?</label>
    </div>
  `,
  );

  const moneyAmount = createElement(
    'span',
    'modal-body__amount',
    '0.00',
    ['role', 'textbox'],
    ['contenteditable', true],
  );
  const selectFrom = createSelect(options.from);
  const selectTo = createSelect(options.to, options.type);
  const date = createElement(
    'input',
    'modal-body__date',
    null,
    ['type', 'date'],
    ['value', today],
    ['max', today],
  );
  const description = createElement(
    'textarea',
    'form-control',
    null,
    ['id', 'description'],
    ['maxlength', 45],
  );
  // const currency = createElement('span', 'modal-body__currency', 'BYN');

  const saveBtn = createElement('button', 'btn', saveBtnOptions[options.type]);

  insertAfter(moneyAmount, wrap.querySelector('.modal-body__title'));
  insertAfter(selectFrom, wrap.querySelector('[data-from]'));
  insertAfter(selectTo, wrap.querySelector('[data-to]'));
  wrap.insertBefore(date, wrap.querySelector('.form-floating'));
  wrap.querySelector('.form-floating').prepend(description);
  wrap.append(saveBtn);

  saveBtn.addEventListener('click', () => {
    const transactionInfo = {
      moneyAmount: moneyAmount.innerText,
      fromAccount: selectFrom.value,
      to: selectTo.value,
      date: date.value,
      description: description.value,
    };

    console.log(transactionInfo);

    modal.hide();
  });

  return wrap;
}
