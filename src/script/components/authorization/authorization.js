import app from '../../app';
import pubsub from '../../pubsub';
import createElement from '../../utils/create';
import createSelect from '../../utils/select';

const emailValidation = (email) => {
  const isValid = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(email);
  return isValid;
};

const passwordValidation = (password) => {
  const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/.test(password);
  return isValid;
};

const login = async () => {
  const email = document.getElementById('log-in-email').value;
  const password = document.getElementById('log-in-password').value;

  await app.login(email, password);

  if (app.user) {
    pubsub.publish('navigateTo', '/');
  }
  return true;
};

const register = async () => {
  const email = document.getElementById('sign-up-email').value;
  const password = document.getElementById('sign-up-password').value;
  const confirmPassword = document.getElementById('sign-up-confirm-password').value;

  if (password !== confirmPassword) {
    console.log('passwords not equal');
    return false;
  }
  if (!emailValidation(email)) {
    console.log('incorrect email');
    return false;
  }
  if (!passwordValidation(password)) {
    console.log('incorrect password');
    return false;
  }
  console.log('all done', password);
  await app.register(email, password);

  if (app.user) {
    pubsub.publish('navigateTo', '/');
  }

  return true;
};

export default function renderAuthorizationPage() {
  const main = document.querySelector('main');

  const leftSideSignIn = `<h2>Hello, Friend!</h2>
  <p>Enter your personal details and start counting copecks with us</p>`;

  const rightSideSignIn = `
  <div class="img-wrapper">
  <img src="gifs/wallet2.gif" alt="" />
  </div>
  <h3 class="form__header">Log in to Copeicki</h3>
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
    <button class="btn" id="submit" data-auth="sign in">Log in</button>
  </div>`;

  const leftSideSignUp = `<h2>Welcome back!</h2>
  <p>To start counting copecks with us please login with your personal info</p>`;

  const rightSideSignUp = `
  <div class="img-wrapper">
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
      <label for="formFile" class="form-file">
        <img src="icons/input-file.svg" alt="">
        <span>Profile photo</span>
      </label>
      <input class="file-input" id="formFile" type="file">
    </div>
    <button class="btn btn-yellow" id="submit" data-auth="sign up">sign up</button>
    </div>`;

  const loginWrapper = createElement('div', 'login__overlay');

  loginWrapper.insertAdjacentHTML(
    'afterbegin',
    `<div class="login__content">
  <div class="left side">
  <div class="left__content">${leftSideSignIn}</div>
  <button class="btn" data-action="go-right" id="move-id">Sign up</button>
  </div>
  <div class="right side">${rightSideSignIn}</div>
  </div>`,
  );

  main.append(loginWrapper);

  const loginContent = loginWrapper.querySelector('.login__content');

  loginContent.addEventListener('click', (e) => {
    if (!e.target.tagName === 'BUTTON') return false;

    const { action } = e.target.dataset;
    const leftSide = loginContent.querySelector('.left');
    const rightSide = loginContent.querySelector('.right');
    const buttonSubmit = document.getElementById('move-id');

    if (action) {
      if (action === 'go-right') {
        leftSide.style.animation = 'goRight 1s ease forwards';
        rightSide.style.animation = 'goLeft 1s ease forwards';
        buttonSubmit.textContent = 'sign in';
        buttonSubmit.dataset.action = 'go-left';

        leftSide.children[0].innerHTML = leftSideSignUp;
        rightSide.innerHTML = rightSideSignUp;
        const selectElement = createSelect(document.getElementById('formFile'), {
          class: 'currency-list',
          placeholder: 'RUB',
          list: app.api.currencyList,
          isTranslatable: false,
        });
        console.log(selectElement);
      } else if (action === 'go-left') {
        leftSide.style.animation = 'goRight 1s ease forwards reverse';
        rightSide.style.animation = 'goLeft 1s ease forwards reverse';
        buttonSubmit.textContent = 'sign up';
        buttonSubmit.dataset.action = 'go-right';
        leftSide.children[0].innerHTML = leftSideSignIn;
        rightSide.innerHTML = rightSideSignIn;
      }
    }

    if (e.target.id === 'submit') {
      console.log('asd');
      if (e.target.dataset.auth === 'sign in') {
        login();
      } else {
        register();
      }
    }
    return true;
  });
}
