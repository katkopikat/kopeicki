import bcrypt from 'bcrypt';
// import jsonWebToken from 'jsonwebtoken';
import User from '../models/User.js';
import { getTokens } from './token.js';

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const { _id: id } = user;
    const checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword) {
      //! change secret key and think how to store
      // const token = jsonWebToken.sign({
      //   email,
      //   userId: id,
      // }, 'secret-key', { expiresIn: 3600 });
      const { token, refreshToken } = await getTokens(email, id);
      res.status(200).json({
        userId: id,
        email,
        token: `Bearer ${token}`,
        refreshToken: `Bearer ${refreshToken}`,
      });
    } else {
      res.status(401).json({
        message: 'wrong login-pass input',
      });
    }
  } else {
    res.status(404).json({
      message: 'wrong login-password input',
    });
  }
}

export async function register(req, res) {
  const searchUser = await User.findOne({ email: req.body.email });
  // const salt = await bcrypt.genSalt(10);
  if (searchUser) {
    // error user exist
    res.status(409).json({
      error: 'Email or user exist',
    });
  } else {
    const user = await User.create({
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
    });
    res.status(201).json(user);
    console.log(user);
  }
}
