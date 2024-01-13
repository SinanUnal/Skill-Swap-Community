const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {

  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];

  if(token == null) {
    return res.status(401).send({ message:' Unauthorized to this request'}); // if there is no token
  }

  jwt.verify(token, "Mvp project", (err, user) => {
    console.log('Error:', err, 'User:', user);
    if(err) {
      return res.status(403).send({ message:' Unauthorized access different token'}); // if the token has expired or invalid
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;