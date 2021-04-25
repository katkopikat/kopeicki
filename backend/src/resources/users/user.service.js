import { hashPassword, checkHashedPassword } from '../utils/hashHelper.js';
import { User, UserTemplate } from './User.model.js';
import { getTokens } from '../utils/token.js';

export async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    return [403, { message: 'invalid login-password' }];
  }
  const { _id: id } = user;
  const checkPassword = await checkHashedPassword(password, user.password);
  if (!checkPassword) {
    return [403, { message: 'invalid login-password' }];
  }
  if (checkPassword) {
    const { token, refreshToken } = await getTokens(email, id);
    return [200, {
      userId: id,
      email,
      token: `Bearer ${token}`,
      refreshToken: `Bearer ${refreshToken}`,
    }];
  }
  return [500, { message: 'server error' }];
}

export async function register(email, password, currency) {
  const searchUser = await User.findOne({ email });
  if (searchUser) {
    return [403, { message: 'invalid email-password' }];
  }

  const template = await UserTemplate.findOne({ lang: 'en' }, '-_id');

  const user = await User.create({
    email,
    password: await hashPassword(password),
    ...template.toObject(),
    currency,
  });
  return [201, { user }];
}

export async function updateAccount(transaction) {
  const amount = transaction.type === 'expenses' ? -transaction.amount : transaction.amount;
  return User.findByIdAndUpdate(
    transaction.user,
    { $inc: { 'accounts.$[acc].amount': amount } },
    { arrayFilters: [{ 'acc.name': transaction.account }] },
  ).exec();
}
