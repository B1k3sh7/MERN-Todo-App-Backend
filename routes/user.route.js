import { Router } from "express";
import {
  check,
  createUser,
  signIn,
  verifyUser,
  logOut,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/login").post(check, signIn);
router.route("/logout").post(logOut);
router.route("/register").post(createUser);
router.route("/verify").post(verifyUser);

export default router;
