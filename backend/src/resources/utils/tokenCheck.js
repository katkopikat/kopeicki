import jsonWebToken from 'jsonwebtoken';

const NO_AUTH_URLS = ['/', '/auth/register', '/auth/login'];

const checkAuthentication = (req, res, next) => {
  if (NO_AUTH_URLS.includes(req.path)) return next();

  const tokenString = req.headers.authorization;
  if (!tokenString) {
    // return [null, 'invalid Authorization'];
    return res.status(401).send('invalid Authorization 1');
  }
  const [type, token] = tokenString.split(' ');
  if (type !== 'Bearer') {
    // return [null, 'invalid Authorization'];
    return res.status(401).send('invalid Authorization 2');
  }
  try {
    jsonWebToken.verify(token, 'secret-key');
  } catch {
    // return [null, 'invalid token'];
    return res.status(401).send('invalid token');
  }
  return next();
};

export default checkAuthentication;
