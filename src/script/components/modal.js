import { Modal } from 'bootstrap';
import createElement from '../utils/create';

export function createModalElement(modalHtml, id) {
  return createElement('div', ['modal', 'fade'], modalHtml, ['id', id]);
}

export function createModal(modalHtml, id) {
  return new Modal(createModalElement(modalHtml, id));
}

export function addTransactionModal(category, context) {
  return `<div class="modal-dialog">
        <div class="modal-content ${context.class}">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5 class="modal-body__title">${context.title}</h5>
            <p><span class="modal-body__amount" role="textbox" contenteditable>0.00</span>BYN</p>
            <span class="modal-body__category-name">at #${category}</span>
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
