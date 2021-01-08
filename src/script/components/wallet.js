import createElement from '../utils/create';

export default function createWallet() {
  const walletTitle = createElement('h3', 'wallet__title', 'Wallet');
  const incomeReceived = createElement(
    'button',
    ['btn', 'btn-success'],
    null,
    ['bsToggle', 'modal'],
    ['bsTarget', '#receive-income'],
  );

  const walletDiv = createElement('div', ['container-sm', 'wallet'], [walletTitle, incomeReceived]);

  document.querySelector('.accounts').append(walletDiv);
}
