const jwt = require('jsonwebtoken');

module.exports = {
  generateAccessToken: (user) => { //generates a JWT token of 1y validity
    return jwt.sign(user, process.env.secret_key, { expiresIn: '1y' });
  },
  authenticateToken: async (req, res, next) => { //authenticates the JWT Token
    const authHeader = req.headers["authorization"]; //gets the contents in the authetication header
    const token = authHeader && authHeader.split(" ")[1]; //gets the actual JWT token from the header
    if (token == null)
      return res
        .status(401)
        .json({
          error: "You are not authorized to use this resource!", //if the token is wrong, it displays this error
          statusCode: 401,
          status: "Unauthorized",
        });

    jwt.verify(token, process.env.secret_key, (err, user) => { //verifies the token
      if (err) return res.status(403).json(err);
      req.user = user;
      next();
    });
  },
};