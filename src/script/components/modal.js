import { Modal } from 'bootstrap';
import createElement from '../utils/create';
import { allAccountsCategories } from '../data/accounts';

export function createModalElement(modalHtml, id) {
  return createElement('div', ['modal', 'fade'], modalHtml, ['id', id]);
}

export function createModal(modalHtml, id) {
  return new Modal(createModalElement(modalHtml, id));
}

function createSelect(list, selected, defaultValue) {
  const names = list.map(({ name }) => name);

  let selectHtml = `<option value="Other">${defaultValue}</option>`;

  names.forEach((name) => {
    if (name === selected) {
      selectHtml += `<option value="${name}" selected>${name.toLowerCase()}</option>`;
    } else {
      selectHtml += `<option value="${name}">${name.toLowerCase()}</option>`;
    }
  });

  return selectHtml;
}

export function addTransactionModal(categoriesArray, currentCategory, context, currentAccount) {
  return `<div class="modal-dialog">
        <div class="modal-content ${context.class}">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5 class="modal-body__title">${context.title}</h5>
            <p><span class="modal-body__amount" role="textbox" contenteditable>0.00</span>BYN</p>
            <span class="modal-body__category-name">from</span>
            <select>${createSelect(allAccountsCategories, currentAccount, 'somewhere')}</select>
            <span class="modal-body__category-name"> at #</span>
            <select>${createSelect(categoriesArray, currentCategory, 'something')}</select>
            <input type="date" class="modal-body__date"
              value=${new Date().toISOString().split('T')[0]}
              min="2018-01-01" max=${new Date().toISOString().split('T')[0]} >
            <div class="form-floating">
              <textarea class="form-control" placeholder="Leave a descrioption here" id="description" maxlength="45"></textarea>
              <label for="description" class="textarea-label">Do you have any comments?</label>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn">${context.saveBtn}</button>
          </div>
        </div>
      </div>
    `;
}
