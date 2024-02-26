import { Router } from "express";

import { validatePageSubmission } from "../middlewares/validate.middleware.js";
import {
  goHomeIfLoggedIn,
  loadUserSession,
  requireUser,
} from "../middlewares/auth.middleware.js";

import { routeMeta } from "./meta.js";

import {
  loginUser,
  signupUser,
  forgotPassword,
  resetPassword,
  updatePassword,

  // pages --
  getLoginPage,
  getSignupPage,
  getForgotPasswordPage,
  getResetPasswordPage,
  getMyProfilePage,
} from "../controllers/auth.controller.js";

import {
  loginUserSchema,
  signupUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updatePasswordSchema,
} from "../validations/schemas/auth.schema.js";

const router = Router();

// pages routes
router.get("/login", goHomeIfLoggedIn, getLoginPage);
router.get("/signup", goHomeIfLoggedIn, getSignupPage);
router.get("/forgot-password", goHomeIfLoggedIn, getForgotPasswordPage);
router.get("/reset-password", goHomeIfLoggedIn, getResetPasswordPage);
router.get("/profile", loadUserSession, requireUser, getMyProfilePage);

// api or page submission routes
router.post(
  "/signup",
  validatePageSubmission({
    schema: signupUserSchema,
    routeMeta: routeMeta["signup"],
  }),
  signupUser,
);
router.post(
  "/login",
  validatePageSubmission({
    schema: loginUserSchema,
    routeMeta: routeMeta["login"],
  }),
  loginUser,
);
router.post(
  "/forgot-password",
  validatePageSubmission({
    schema: forgotPasswordSchema,
    routeMeta: routeMeta["forgotPassword"],
  }),
  forgotPassword,
);
router.post(
  "/reset-password",
  validatePageSubmission({
    schema: resetPasswordSchema,
    routeMeta: routeMeta["resetPassword"],
  }),
  resetPassword,
);
router.post(
  "/update-password",
  loadUserSession,
  requireUser,
  validatePageSubmission({
    schema: updatePasswordSchema,
    routeMeta: routeMeta["profile"],
  }),
  updatePassword,
);

export default router;
