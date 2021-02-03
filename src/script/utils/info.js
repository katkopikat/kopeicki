import modal from '../components/modals/modal';
import { getLanguage } from './localStorage';
import createElement from './create';

const infoHtml = () => {
  document.querySelector('.modal-content').style.background = '#ffc107';

  const lang = getLanguage();

  const transl = {
    en: [
      'hot keys:',
      'Open a transactions page',
      'Open a statistics page',
      'Open a history page',
      'Open an expenses modal',
      'Open an income modal',
      'Open an accounts modal',
      'Made by',
    ],
    ru: [
      'сочетания клавиш:',
      'Открыть страницу транзакций',
      'Открыть страницу статистики',
      'Открыть страницу истории',
      'Открыть модальное окно расходов',
      'Открыть модальное окно доходов',
      'Открыть модальное окно счетов',
      'Сделано',
    ],
    by: [
      'спалучэння клавіш:',
      'Адкрыць старонку транзакцый',
      'Адкрыць старонку статыстыкі',
      'Адкрыць старонку гісторыі',
      'Адкрыць мадальнае акно расходаў',
      'Адкрыць мадальнае акно даходаў',
      'Адкрыць мадальнае акно рахункаў',
      'Зроблена',
    ],
  };

  const wrap = createElement('div', 'content');

  wrap.insertAdjacentHTML(
    'afterbegin',
    `
    <div class="keys">
        <p class="keys__title">${transl[lang][0]}</p>
        <p class="keys__descr"><kbd>Alt</kbd><span class="plus">+</span><kbd>T</kbd>- ${transl[lang][1]}</p>
        <p class="keys__descr"><kbd>Alt</kbd><span class="plus">+</span><kbd>S</kbd>- ${transl[lang][2]}</p>
        <p class="keys__descr"><kbd>Alt</kbd><span class="plus">+</span><kbd>H</kbd>- ${transl[lang][3]}</p>
        <p class="keys__descr"><kbd>Alt</kbd><span class="plus">+</span><kbd>E</kbd>- ${transl[lang][4]}</p>
        <p class="keys__descr"><kbd>Alt</kbd><span class="plus">+</span><kbd>I</kbd>- ${transl[lang][5]}</p>
        <p class="keys__descr"><kbd>Alt</kbd><span class="plus">+</span><kbd>A</kbd>- ${transl[lang][6]}</p>
    </div>
    <div class="about">
    <span class="code_btn">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-code-slash" viewBox="0 0 16 16">
        <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/>
    </svg>
    </span>
    <div class="links">
    ${transl[lang][7]}
        <a class="link__item" href="https://github.com/katkopikat" target="_blank">katkopikat</a>  |
        <a class="link__item"href="https://github.com/yulia-kri" target="_blank">yulia-kri</a>  |
        <a class="link__item" href="https://github.com/v0f" target="_blank">v0f</a>  |
        <a class="link__item" href="https://github.com/akulaualiaksei" target="_blank">akulaualiaksei</a>
    </div>
    <p>2021</p>
    <a class="rs__link" href="https://rs.school/js/" target="_blank"><img class="logo__img" src="https://rs.school/images/rs_school_js.svg"></a>
    </div>
    `,
  );

  return wrap;
};

export default function showInfo() {
  document.getElementById('info').addEventListener('click', () => {
    modal.setContent(infoHtml());
    modal.show();
  });
}
