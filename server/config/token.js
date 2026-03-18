import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  const id = String(userId);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
