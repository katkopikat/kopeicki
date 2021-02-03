import jsonWebToken from 'jsonwebtoken';
import 'dotenv/config.js';

import TokenSchema from './Token.model.js';

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
    expire: Date.now() + process.env.REFRESH_TOKEN_TIME_MS,
  });
  return { token, refreshToken };
};

export const deleteToken = async (email, userId) => {
  const token = await TokenSchema.findOneAndDelete({ userId });
  if (token) {
    return true;
  }
  return undefined;
};

export const refreshTokens = async (email, userId) => {
  const token = await TokenSchema.findOne({ userId });
  if (!token) {
    deleteToken(email, userId);
    return [null, { message: 'Access token is missing or invalid' }];
  }
  if (Date.now() > token.expire) {
    deleteToken(email, userId);
    return [null, { message: 'Access token is missing or invalid' }];
  }
  const tokens = await getTokens(email, userId);
  return [tokens, 'accept'];
};
