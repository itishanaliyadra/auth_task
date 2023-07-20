require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret =process.env.SECRET;
const ceakAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, msg: "You are not authorized" });
  }
  const token = authorization.split(" ")[1];

  try {
    // let istoken = req.cookie;
    // console.log(istoken);
    // if (!istoken) {
    //   console.log(istoken);
    //   return res.status(401).json({ success: false, msg: "Unauthorized" });
    // }
    // istoken = istoken.toJSON();
    const decoded = jwt.decode(token, secret);
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, msg: "Token invalid" });
  }
};
module.exports = ceakAuth;
