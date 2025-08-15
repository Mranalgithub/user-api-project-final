const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const auth = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;
  if (auth && auth === `Bearer ${apiToken}`) return next();

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'jwtsecret');
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
