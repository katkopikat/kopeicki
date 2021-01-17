import jsonWebToken from 'jsonwebtoken';
import 'dotenv/config.js';

import TokenSchema from './Token.model.js';

const expTimeRefresh = 5 * 60 * 60;

export const saveLastToken = async (tokenData) => {
  const savedToken = await TokenSchema.findOneAndUpdate(
    { userId: tokenData.userId },
    { $set: { token: tokenData.refreshToken, expire: tokenData.expire } },
    { new: true, upsert: true },
  );
  return savedToken;
};

export const getTokens = async (email, userId) => {
  const token = jsonWebToken.sign({
    email,
    userId,
  },
  process.env.TOKEN_SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRE_TIME,
  });

  const refreshToken = jsonWebToken.sign({
    email,
    userId,
  },
  process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
  });
  await saveLastToken({
    refreshToken,
    userId,
    expire: Date.now() + expTimeRefresh,
  });
  return { token, refreshToken };
};

export const refreshTokens = async (email, userId) => {
  console.log('userID from refresh', userId);
  const token = await TokenSchema.findOne({ userId });
  console.log('find token', token);
  if (!token) {
    return [null, 'wrong token'];
  }
  console.log('actualData', Date.now());
  if (Date.now() > token.expire) {
    return [null, 'expired token'];
  }

  return getTokens(email, userId);
};
