import createElement from '../../utils/create';
import modal from './modal';
import app from '../../app';
import { getLanguage } from '../../utils/localStorage';
import pubsub from '../../pubsub';

export default function confirmModal(group, category) {
  const lang = getLanguage();

  const msgCategory = {
    en: 'Delete category?',
    ru: 'Удалить категорию?',
    be: 'Выдаліць катэгорыю?',
  };

  // const msgTransaction = {
  //   en: 'Delete transaction?',
  //   ru: 'Удалить операцию?',
  //   be: 'Выдаліць аперацыю?',
  // };

  const msgYes = {
    en: 'Yes',
    ru: 'Да',
    be: 'Так',
  };

  const msgNo = {
    en: 'No',
    ru: 'Нет',
    be: 'Не',
  };

  document.querySelector('.modal-content').className = 'modal-content warning';

  const wrap = createElement('div', 'content');

  wrap.insertAdjacentHTML(
    'afterbegin',
    `<h5 class="modal-body__title">${msgCategory[lang]}</h5>
        <div class="btns-container">
          <button class="btn" data-msg="confirm">${msgYes[lang]}</button>
          <button class="btn" data-msg="reject">${msgNo[lang]}</button>
        </div>`,
  );

  const buttons = wrap.querySelector('.btns-container');

  buttons.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const isConfirmed = e.target.dataset.msg === 'confirm';
      if (isConfirmed) {
        switch (group) {
          case 'accounts':
            app.removeUserAccount(category);
            break;
          case 'expenses':
            app.removeUserExpense(category);
            break;
          case 'income':
            app.removeUserIncome(category);
            break;
          // no default
        }

        modal.hide();
        pubsub.publish('navigateTo', '/');
      } else {
        modal.hide();
      }
    }
  });

  return wrap;
}
