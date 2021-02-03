import app from '../../app';
import pubsub from '../../pubsub';
import createElement from '../../utils/create';
import createSelect from '../../utils/select';
import { playSound } from '../settings/sound';
import showPopover from '../popover';
import { getLanguage } from '../../utils/localStorage';

const emailValidation = (email) => /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(email);

const passwordValidation = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/.test(password);

const errors = {
  enterEmail: {
    en: 'Enter email',
    ru: 'Введите электронную почту',
    by: 'Увядзіце адрас электроннай пошты',
  },
  enterPassword: {
    en: 'Enter password',
    ru: 'Введите пароль',
    by: 'Увядзіце пароль',
  },
  passwordMatch: {
    en: 'Passwords don\'t match',
    ru: 'Пароли не совпадают',
    by: 'Паролі не супадаюць',
  },
  invalidEmail: {
    en: 'Invalid email',
    ru: 'Неверная электронная почта',
    by: 'Няправільная электронная пошта',
  },
  invalidPassword: {
    en: 'The password you provided is invalid, use 6 or more characters with a mix of numbers and letters (at least one must be uppercase)',
    ru: 'Неверный пароль. Используйте не менее 6 символов, включая цифры и буквы (хотя бы одна должена быть прописной)',
    by: 'Няправільны пароль, выкарыстоўвайце 6 або больш сімвалаў з сумессю лічбаў і літар (прынамсі адна павінна быць прапісная)',
  },
  registrationError: {
    en: 'Sorry, this email address already exists!',
    ru: 'Извините, этот адрес электронной почты уже существует!',
    by: 'Выбачайце, гэты адрас электроннай пошты ўжо існуе!',
  },
  loginError: {
    en: 'Wrong password or email. Try again',
    ru: 'Неверный адрес электронной почты или пароль. Попробуйте снова',
    by: 'Няправільны адрас электроннай пошты ці пароль. Паспрабуйце зноў',
  },
};

const login = async () => {
  const email = document.getElementById('log-in-email');
  const password = document.getElementById('log-in-password');

  if (email.value === '') {
    showPopover(
      email,
      errors.enterEmail[getLanguage()],
      'right',
    );
    return false;
  }
  if (password.value === '') {
    showPopover(
      password,
      errors.enterPassword[getLanguage()],
      'right',
    );
    return false;
  }

  const result = await app.login(email.value, password.value);

  if (result !== true) {
    showPopover(
      email,
      errors.loginError[getLanguage()],
      'bottom',
    );
  }

  return result;
};

const register = async () => {
  const email = document.getElementById('sign-up-email');
  const password = document.getElementById('sign-up-password');
  const confirmPassword = document.getElementById('sign-up-confirm-password');
  const currency = document.querySelector('.currency-list .select__value');

  if (password.value !== confirmPassword.value) {
    showPopover(
      password,
      errors.passwordMatch[getLanguage()],
      'right',
    );
    return false;
  }
  if (!emailValidation(email.value)) {
    showPopover(
      email,
      errors.invalidEmail[getLanguage()],
      'right',
    );
    return false;
  }
  if (!passwordValidation(password.value)) {
    showPopover(
      password,
      errors.invalidPassword[getLanguage()],
      'bottom',
    );
    return false;
  }
  const result = await app.register(email.value, password.value, currency.innerText);

  if (result !== true) {
    showPopover(
      email,
      errors.registrationError[getLanguage()],
      'bottom',
    );
  }
  return result;
};

export default function renderAuthorizationPage() {
  const main = document.querySelector('main');

  const leftSideSignIn = `<h2>Hello, Friend!</h2>
  <p>Enter your personal details and start counting copecks with us</p>`;

  const rightSideSignIn = `
  <div class="img-wrapper gif-wallet">
  <img src="gifs/wallet2.gif" alt="" />
  </div>
  <h3 class="form__header">Log in to Kopeicki</h3>
  <p class="form__subtitle">#countingcopecks</p>
  <div class="form__body">
    <div class="form-group">
      <input type="email" class="form-control" id="log-in-email" placeholder="Email" required />
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
      </svg>
    </div>
    <div class="form-group">
      <input type="password" class="form-control" id="log-in-password" placeholder="Password" required />
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-key" viewBox="0 0 16 16">
        <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z"/>
        <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
      </svg>
    </div>
    <button class="btn" id="submit" data-auth="sign in">Sign in</button>
  </div>`;

  const leftSideSignUp = `<h2>Welcome back!</h2>
  <p>To start counting copecks with us please login with your credential</p>`;

  const rightSideSignUp = `
  <div class="img-wrapper gif-coin">
    <img src="gifs/coin-rotation.gif" alt="">
  </div>
  <h3 class="form__header">Create an account</h3>
  <p class="form__subtitle">to #countingcopecks</p>
  <div class="form__body">
    <div class="form-group">
      <input type="email" class="form-control" id="sign-up-email" placeholder="Email" required>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" id="email-icon-sign-up" viewBox="0 0 16 16">
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
      </svg>
    </div>
    <div class="form-group">
      <input type="password" class="form-control" id="sign-up-password" placeholder="Password" required>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-key" id="password-icon-sign-up" viewBox="0 0 16 16">
        <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z"/>
        <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
      </svg>
    </div>
    <div class="form-group">
      <input type="password" class="form-control" id="sign-up-confirm-password" placeholder="Confirm password" required>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-key" id="confirm-password-icon-sign-up" viewBox="0 0 16 16">
        <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8zm4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5z"/>
        <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
      </svg>
    </div>
    <div class="form-group two-col">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cash" viewBox="0 0 16 16">
        <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
        <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V4zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2H3z"/>
      </svg>
      <span id="currency-list">Currency</span>
    </div>
    <button class="btn btn-yellow" id="submit" data-auth="sign up">sign up</button>
    </div>`;

  const loginWrapper = createElement('div', 'login__overlay');

  loginWrapper.insertAdjacentHTML(
    'afterbegin',
    `<div class="login__content">
    <div class="left side">
    <div class="left__content">${leftSideSignIn}</div>
    <button class="btn btn-sign-up" data-action="go-right" id="move"><span class="btn-text">Sign up</span></button>
    </div>
    <div class="right side">${rightSideSignIn}</div>
    </div>`,
  );

  main.append(loginWrapper);

  const loginContent = loginWrapper.querySelector('.login__content');

  loginContent.addEventListener('click', async (e) => {
    const submitBtn = e.target.closest('#move');

    if (submitBtn) {
      const { action } = submitBtn.dataset;
      const submitBtnText = submitBtn.children[0];
      const leftSide = loginContent.querySelector('.left');
      const leftSideContent = leftSide.children[0];
      const rightSide = loginContent.querySelector('.right');

      if (action === 'go-right') {
        leftSide.style.animation = 'goRight 1s linear forwards';
        rightSide.style.animation = 'goLeft 1s linear forwards';

        leftSideContent.style.animation = 'fadeOutFromLeft 0.5s linear forwards';

        submitBtnText.style.animation = 'fadeOutFromLeft 0.5s linear forwards';
        submitBtn.style.animation = 'stretchBtn 1s ease';

        setTimeout(() => {
          leftSideContent.innerHTML = leftSideSignUp;
          leftSideContent.style.animation = 'fadeInFromRight 0.5s linear forwards';

          submitBtnText.innerText = 'sign in';
          submitBtnText.style.animation = 'fadeInFromRight 0.5s linear forwards';
          submitBtn.dataset.action = 'go-left';

          rightSide.innerHTML = rightSideSignUp;
          createSelect(document.getElementById('currency-list'), {
            class: 'currency-list',
            placeholder: 'RUB',
            list: [...['USD', 'EUR', 'RUB', 'BYN', 'UAH', 'KZT'], ...app.api.currencyList],
            isTranslatable: false,
          });
        }, 500);
      } else {
        leftSide.style.animation = 'goLeftBack 1s linear forwards';
        rightSide.style.animation = 'goRightBack 1s linear forwards';

        leftSideContent.style.animation = 'fadeOutFromRight 0.5s linear forwards';

        submitBtnText.style.animation = 'fadeOutFromRight 0.5s linear forwards';
        submitBtn.style.animation = 'stretchBtn 1s ease';

        setTimeout(() => {
          leftSideContent.innerHTML = leftSideSignIn;
          leftSideContent.style.animation = 'fadeInFromLeft 0.5s linear forwards';

          submitBtnText.innerText = 'sign up';
          submitBtnText.style.animation = 'fadeInFromLeft 0.5s linear forwards';
          submitBtn.dataset.action = 'go-right';

          rightSide.innerHTML = rightSideSignIn;
        }, 500);
      }
    }

    if (e.target.id === 'submit') {
      if (e.target.dataset.auth === 'sign in') {
        const result = await login();

        if (result !== true) {
          playSound('error-login', true);
        }
        if (app.user) {
          pubsub.publish('navigateTo', '/');
          playSound('income', true);
        }
      } else {
        const result = await register();
        if (result !== true) {
          playSound('error-login', true);
        }
        if (app.user) {
          playSound('income', true);
          pubsub.publish('navigateTo', '/');
        }
      }
    }
  });
}
