export default function navSlideIn() {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  const main = document.querySelector('main');
  const links = document.querySelectorAll('.nav__item');

  burger.addEventListener('click', () => {
    if (burger.classList.contains('burger_open')) {
      burger.classList.remove('burger_open');
      burger.classList.add('burger_close');
      main.style.left = '0';
      main.style.width = '100%';
    } else {
      burger.classList.add('burger_open');
      burger.classList.remove('burger_close');
      if (document.documentElement.clientWidth > 540) {
        main.style.left = '240px';
        main.style.width = 'calc(100% - 240px)';
      }
    }

    nav.classList.toggle('nav_open');

    links.forEach((link, index) => {
      const tempLink = link;
      if (link.style.animation) {
        tempLink.style.animation = '';
      } else {
        tempLink.style.animation = `linkFade 0.5s ease-in-out ${index / 6 + 0.5}s forwards`;
      }
    });
  });
}
