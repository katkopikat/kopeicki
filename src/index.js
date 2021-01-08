import './styles/main.scss';

import { createModalElement, receiveIncomeModal } from './script/components/modal';
import expenses from './script/components/expenses';
import createWallet from './script/components/wallet';

const modalIncome = createModalElement(receiveIncomeModal, 'receive-income');
document.body.append(modalIncome);
createWallet();
expenses();
