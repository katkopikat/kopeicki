export default function renderAuthorizationPage() {
  const main = document.querySelector('main');

  main.innerHTML = `<form id="signInForm">
    <div class="form-group">
      <label for="inputEmail">Email address</label>
      <input type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" required>
      <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
    </div>
    <div class="form-group">
      <label for="inputPassword">Password</label>
      <input type="password" class="form-control" id="inputPassword" placeholder="Password" required>
    </div>
    <button type="submit" class="btn btn-primary" id="signInButton">SignIn</button>
    </form>`;

  const emailValidation = (email) => {
    const isValid = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/.test(email);
    return isValid;
  };

  const formSingIn = document.getElementById('signInForm');
  // const signInButton = document.getElementById('signInButton');
  // signInButton.addEventListener('click', async () => {
  formSingIn.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    if (!emailValidation(email)) {
      console.log('incorrect email');
      return false;
    }
    console.log('all done', password);
    // app.login(email, password);
    return true;
  });
}
