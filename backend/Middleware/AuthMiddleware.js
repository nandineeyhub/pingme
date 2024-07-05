const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const user = require("../Model/userSchema");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await user.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized");
    }
  } else  throw new Error("Not authorized");
});

module.exports = {protect}
