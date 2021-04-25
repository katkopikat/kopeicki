import { getSound, setSound } from '../../utils/localStorage';
import { moveToggle } from '../../utils/DOM';

export function toggleSound() {
  const soundToggleDiv = document.querySelector('.toggle.sound');
  const soundToggleEl = document.getElementById('sound');
  const width = 24;

  const isChecked = getSound() === 'on';

  moveToggle(soundToggleDiv, width, isChecked);
  soundToggleEl.checked = isChecked;

  soundToggleEl.addEventListener('change', () => {
    moveToggle(soundToggleDiv, width, soundToggleEl.checked);
    setSound(soundToggleEl.checked ? 'on' : 'off');
  });
}

export function playSound(str) {
  const sound = new Audio();
  sound.src = `sounds/${str}.mp3`;
  if (getSound() === 'on') sound.play();
}
