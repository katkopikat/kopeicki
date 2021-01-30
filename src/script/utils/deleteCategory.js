import { getRandom } from './helpers';
import { getSound } from './localStorage';
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

  if (container.querySelector('.selected')) container.querySelector('.selected').classList.remove('selected');
}

export function startDeletion(container) {
  deletionState.isDeletionEnded = false;
  container.querySelectorAll('[draggable]').forEach((el) => {
    el.classList.add('deleting');
    el.style.animation = `beforeDeletion 1.5s cubic-bezier(0.3, 0.06, 0.2, 0.9) ${getRandom(0, 0.5)}s infinite`;
    el.addEventListener('click', deleteCategory);
  });

  // setTimeout(() => {
  //   if (container.querySelector('.selected')) stopDeletion(container);
  // }, 15000);
}
