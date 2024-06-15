const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res
      .status(200)
      .json({ status: 401, message: "Unauthorized: Missing token" });
  }

  jwt.verify(token, "your-secret-key", (err, user) => {
    if (err) {
      return res
        .status(200)
        .json({ status: 403, message: "Forbidden: Invalid token" });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
