import bcrypt from 'bcrypt';
import jsonWebToken from 'jsonwebtoken';
import User from '../models/User.js';

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const { _id: id } = user;
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (checkPassword) {
      //! change secret key and think how to store
      const token = jsonWebToken.sign({
        email,
        userId: id,
      }, 'secret-key', { expiresIn: 3600 });
      res.status(200).json({
        token: `Bearer ${token}`,
      });
    } else {
      res.status(401).json({
        message: 'wrong input login-pass',
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
  const salt = bcrypt.genSaltSync(10);
  if (searchUser) {
    // error user exist
    res.status(409).json({
      error: 'Email or user exist',
    });
  } else {
    const user = await User.create({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt),
    });
    res.status(201).json(user);
    console.log(user);
  }
}
