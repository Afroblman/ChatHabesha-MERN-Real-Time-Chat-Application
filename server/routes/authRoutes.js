import express from "express";
import {
  register,
  login,
  updateProfile,
  checkAuth,
} from "../controllers/authController.js";
import { auth } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/signup", register);
authRouter.post("/login", login);
authRouter.put("/update-profile", auth, updateProfile);
authRouter.get("/check", auth, checkAuth);

export default authRouter;
