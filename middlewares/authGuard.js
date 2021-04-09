const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return unAthorized(req, next);
  }

  const token = authHeader.splic(' ')[1]; //Bearer XXXXXX

  if (!token || token === '') {
    return unAthorized(req, next);
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return unAthorized(req, next);
    }

    req.isAuth = true;
    req.userId = decodedToken.userId;
    return next();
  } catch (err) {
    return unAthorized(req, next);
  }
};

function unAthorized(req, next) {
  req.isAuth = false;
  return next();
}
