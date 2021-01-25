import { setSound } from '../../utils/localStorage';

export default function toggleSound() {
  const soundToggleDiv = document.querySelector('.toggle.sound');
  const soundToggleEl = document.getElementById('sound');

  soundToggleEl.addEventListener('change', () => {
    const ball = soundToggleDiv.querySelector('.ball');

    if (soundToggleEl.checked) {
      ball.style.transform = 'translateX(28px)';
      setSound(true);
    } else {
      ball.style.transform = 'translateX(0)';
      setSound(false);
    }
  });
}
