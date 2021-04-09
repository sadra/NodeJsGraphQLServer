const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    return unAthorized();
  }

  const token = authHeader.splic(' ')[1]; //Bearer XXXXXX

  if (!token || token === '') {
    return unAthorized();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return unAthorized();
    }

    req.isAuth = true;
    req.userId = decodedToken.userId;
    return next();
  } catch (err) {
    return unAthorized();
  }
};

function unAthorized() {
  req.isAuth = false;
  return next();
}
