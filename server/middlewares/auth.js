import jwt from "jsonwebtoken";
import Users from "../models/Users.js";

export const auth = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token missing",
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    const userId =
      typeof tokenDecode.id === "object"
        ? tokenDecode.id.toString()
        : tokenDecode.id;
    const user = await Users.findById(userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};
