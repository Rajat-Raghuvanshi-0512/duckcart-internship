const jwt = require("jsonwebtoken");
const User = require("../Database/Models/userSchema");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Please login to access this resource" });
    }
    const data = await jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(data.id);
    next();
  } catch (err) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};
