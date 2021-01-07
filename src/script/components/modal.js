import { Modal } from 'bootstrap';
import createElement from '../utils/create';

export function createModal(modalHtml, id) {
  const modalElem = createElement('div', ['modal', 'fade'], modalHtml, ['id', id]);

  const modal = new Modal(modalElem);

  return modal;
}

export function addExpenseModal(category) {
  return `<div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">What did you spend money on?</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>${category}</p>
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
}
