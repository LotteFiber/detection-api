const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  console.log("Check Auth");
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "you must be login" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "you must be login two" });
    }
    const { _id } = payload;
    User.findById(_id).then((userdata) => {
      req.user = userdata;
      next();
    });
  });
};
