import { createModal, addTransactionModal } from '../modal';
import { allExpensesCategories, expenseModal } from '../../data/expenses';
import { allIncomeCategories, incomeModal } from '../../data/income';

export function dragStart() {
  this.classList.add('dragging');
  setTimeout(() => this.classList.add('invisible'), 0);
}

export function dragEnd() {
  this.classList.remove('invisible');
  this.classList.remove('dragging');
}

export function dragOver(e) {
  e.preventDefault();
}

export function dragEnter(e) {
  e.preventDefault();
  this.classList.add('hovered');
}

export function dragLeave() {
  this.classList.remove('hovered');
}

export function dragDrop() {
  this.classList.remove('hovered');

  const { category } = document.querySelector('.dragging').dataset;
  const { type } = document.querySelector('.dragging').dataset;

  const categoriesList = type === 'income' ? allIncomeCategories : allExpensesCategories;
  const modalOpts = type === 'income' ? incomeModal : expenseModal;

  const modal = createModal(
    addTransactionModal(categoriesList, category, modalOpts, this.dataset.category),
  );

  modal.show();
}
