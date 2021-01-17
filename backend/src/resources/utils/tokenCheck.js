import jsonWebToken from 'jsonwebtoken';

const NO_AUTH_URLS = ['/', '/users/', '/users/login', '/users/token/'];
const REFRESH_URL = '/users/token/';

const checkAuthentication = (req, res, next) => {
  if (NO_AUTH_URLS.includes(req.path)) return next();

  const tokenString = req.headers.authorization;
  if (!tokenString) {
    return res.status(401).send('invalid token');
  }
  const [type, token] = tokenString.split(' ');
  if (type !== 'Bearer') {
    return res.status(401).send('invalid token');
  }
  try {
    if (REFRESH_URL.includes(req.path)) {
      const { userId } = jsonWebToken.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
      res.locals.userId = userId;
    } else {
      const { userId } = jsonWebToken.verify(token, process.env.TOKEN_SECRET_KEY);
      res.locals.userId = userId;
    }
  } catch (error) {
    return res.status(401).send('invalid token');
  }
  return next();
};

export default checkAuthentication;
