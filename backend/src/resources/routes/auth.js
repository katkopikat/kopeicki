import Router from 'express';
import { login, register } from '../controllers/auth.js';
import { refreshTokens } from '../controllers/token.js';

const router = Router({ mergeParams: true });

router.post('/login', login);
router.post('/register', register);
router.get('/token', async (req, res) => {
  console.log('res from query', req.userId);
  const [tokens, message] = await refreshTokens(req.body.email, req.body.userId);
  // .catch((error) => console.log(error));
  if (!tokens) {
    res.status(403).json({ message });
  } else {
    console.log(tokens);
    res.status(200).json({ userId: req.body.userId, email: req.body.email, ...tokens });
  }
});

export default router;
