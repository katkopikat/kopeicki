import { getRandom } from './helpers';
import { getSound, getLanguage } from './localStorage';
import translations from '../data/translations';
import modal from '../components/modals/modal';
import confirmModal from '../components/modals/confirmModal';

export const deletionState = { isModalOpened: false, isDeletionEnded: true };

function deleteCategory(e) {
  e.stopPropagation();

  deletionState.isModalOpened = true;

  const elem = e.target.closest('.flex-list__item');

  const { category } = elem.dataset;
  const { group } = elem.dataset;

  if (getSound() === 'on') {
    const audioCategory = new Audio();
    audioCategory.src = 'sounds/warn.mp3';
    audioCategory.play();
  }

  modal.setContent(confirmModal(group, category));
  modal.show();
}

export function stopDeletion(container) {
  deletionState.isDeletionEnded = true;
  deletionState.isModalOpened = false;

  container.querySelectorAll('[draggable]').forEach((el) => {
    el.classList.remove('deleting');
    el.style.animation = '';
    el.removeEventListener('click', deleteCategory);
  });

  const btn = container.querySelector('.selected');

  if (btn) {
    btn.classList.remove('selected');

    const lang = getLanguage();

    const btnText = btn.querySelector('span');
    btnText.innerText = translations[lang]['delete category'];
    btnText.dataset.i18n = 'delete category';
  }
}

export function startDeletion(elClicked, container) {
  deletionState.isDeletionEnded = false;

  const lang = getLanguage();

  const btn = elClicked.closest('.flex-list__item');
  const btnText = btn.querySelector('span');

  btn.classList.add('selected');
  btnText.innerText = translations[lang]['stop deletion'];
  btnText.dataset.i18n = 'stop deletion';

  container.querySelectorAll('[draggable]').forEach((el) => {
    el.classList.add('deleting');
    el.style.animation = `beforeDeletion 1.5s cubic-bezier(0.3, 0.06, 0.2, 0.9) ${getRandom(0, 0.5)}s infinite`;
    el.addEventListener('click', deleteCategory);
  });
}
