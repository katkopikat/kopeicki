import Router from 'express';
import { login, register } from './user.service.js';
import { refreshTokens } from '../utils/token.js';

const router = Router({ mergeParams: true });

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [statusCode, response] = await login(email, password);
  res.status(statusCode).json(response);
});
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  const [statusCode, response] = await register(email, password);
  res.status(statusCode).json(response);
});

router.get('/token', async (req, res) => {
  const { email, userId } = req.body;
  const [tokens, message] = await refreshTokens(email, userId);
  if (!tokens) {
    res.status(403).json({ message });
  } else {
    const { token, refreshToken } = tokens;
    console.log(tokens);
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

export default router;
