import jsonWebToken from 'jsonwebtoken';

const NO_AUTH_URLS = ['/', '/users/', '/users/login'];
const REFRESH_URL = '/users/token';

const checkAuthentication = (req, res, next) => {
  if (NO_AUTH_URLS.includes(req.path)) return next();

  const tokenString = req.headers.authorization;
  if (!tokenString) {
    return res.status(401).send('invalid Authorization 1');
  }
  const [type, token] = tokenString.split(' ');
  if (type !== 'Bearer') {
    return res.status(401).send('invalid Authorization 2');
  }
  try {
    console.log(process.env.TOKEN_SECRET_KEY);
    if (REFRESH_URL.includes(req.path)) {
      jsonWebToken.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
    } else {
      const { userId } = jsonWebToken.verify(token, process.env.TOKEN_SECRET_KEY);
      res.locals.userId = userId;
    }
  } catch {
    return res.status(401).send('invalid token3');
  }
  return next();
};

export default checkAuthentication;
