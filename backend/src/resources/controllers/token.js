import jsonWebToken from 'jsonwebtoken';

import TokenSchema from '../models/Token.js';

export const saveLastToken = async (tokenData) => {
  const savedToken = await TokenSchema.findOneAndUpdate(
    { userId: tokenData.userId },
    { $set: { token: tokenData.refreshToken, expire: tokenData.expire } },
    // { $set: { tokenData } },
    { new: true, upsert: true },
  );
  return savedToken;
};

export const getTokens = async (email, userId) => {
  const token = jsonWebToken.sign({
    email,
    userId,
  },
  'secret-key', {
    expiresIn: 3600,
  });

  const refreshToken = jsonWebToken.sign({
    email,
    userId,
  },
  'refresh-secret-key', {
    expiresIn: 4000,
  });
  await saveLastToken({ refreshToken, userId, expire: Date.now() + 4000 });
  return { token, refreshToken };
};

export const refreshTokens = async (email, userId) => {
  console.log('userID from refresh', userId);
  const token = await TokenSchema.findOne({ userId });
  console.log('find token', token);
  // console.log('token time', token.expire);
  if (!token) {
    // return new Error('Token is not found');
    return [null, 'wrong token'];
  }
  console.log('actualData', Date.now());
  if (Date.now() > token.expire) {
    // throw new Error('Token is expired');
    return [null, 'expired token'];
  }

  return getTokens(email, userId);
};
