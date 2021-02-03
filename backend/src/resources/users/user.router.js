import Router from 'express';
import { login, register } from './user.service.js';
import { refreshTokens } from '../utils/token.js';
import { User } from './User.model.js';

const router = Router({ mergeParams: true });

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [statusCode, response] = await login(email, password);
  res.status(statusCode).json(response);
});
router.post('/', async (req, res) => {
  const { email, password, currency } = req.body;
  const [statusCode, response] = await register(email, password, currency);
  res.status(statusCode).json(response);
});

router.post('/token', async (req, res) => {
  const { email, userId } = req.body;
  const [tokens, message] = await refreshTokens(email, userId);
  if (!tokens) {
    res.status(403).json({ message });
  } else {
    const { token, refreshToken } = tokens;
    res.status(200).json(
      {
        userId,
        email,
        token: `Bearer ${token}`,
        refreshToken: `Bearer ${refreshToken}`,
      },
    );
  }
});

router.route('/current')
  .get(async (req, res) => {
    const user = await User.findById(res.locals.userId, '-password');
    res.json(user);
  })
  .put(async (req, res) => {
    const user = await User.findByIdAndUpdate(res.locals.userId, req.body, { new: true });
    res.json(user);
  });

export default router;