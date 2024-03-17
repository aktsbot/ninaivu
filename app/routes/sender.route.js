import { Router } from "express";

import {
  loadUserSession,
  requireUser,
} from "../middlewares/auth.middleware.js";

import { actionMessageSchema } from "../validations/schemas/sender.schema.js";

import { validatePageSubmission } from "../middlewares/validate.middleware.js";
import { routeMeta } from "./meta.js";

import {
  getSendersHomePage,
  actionMessage,
} from "../controllers/sender.controller.js";

const router = Router();

router.get("/", loadUserSession, requireUser, getSendersHomePage);
router.post(
  "/action-message",
  loadUserSession,
  requireUser,
  validatePageSubmission({
    schema: actionMessageSchema,
    routeMeta: routeMeta["sendersHome"],
    goBackOnError: true,
  }),
  actionMessage,
);
export default router;
