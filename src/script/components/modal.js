import { Modal } from 'bootstrap';
import createElement from '../utils/create';

export function createModalElement(modalHtml, id) {
  return createElement('div', ['modal', 'fade'], modalHtml, ['id', id]);
}

export function createModal(modalHtml, id) {
  return new Modal(createModalElement(modalHtml, id));
}

export function addExpenseModal(category) {
  return `<div class="modal-dialog">
        <div class="modal-content expense-modal">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <h5 class="modal-body__title">SPEND</h5>
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
            <button type="button" class="btn">Wasted!</button>
          </div>
        </div>
      </div>
    `;
}

export const receiveIncomeModal = `<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="exampleModalLabel">Adding income</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <h4>Select account where money comes to</h4>
      <input type="number"></input>
      <span id="currency">BYN</span>
      <label for="date">Choose date:</label>
      <input type="date" id="date"
        value=${new Date().toISOString().split('T')[0]}
        min="2018-01-01" max=${new Date().toISOString().split('T')[0]} >
      <div class="form-floating">
        <textarea class="form-control" placeholder="Leave a descrioption here" id="description"></textarea>
        <label for="description">Description</label>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      <button type="button" class="btn btn-primary">Save changes</button>
    </div>
  </div>
</div>
`;
