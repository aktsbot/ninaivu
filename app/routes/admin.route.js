import { Router } from "express";

import {
  loadUserSession,
  requireUser,
} from "../middlewares/auth.middleware.js";

import { validatePageSubmission } from "../middlewares/validate.middleware.js";

import { routeMeta } from "./meta.js";

import {
  getAdminSendersHomePage,
  getAdminSendersNewPage,
  getAdminMessagesHomePage,
  getAdminPatientsHomePage,

  // submissions
  createSender,
} from "../controllers/admin.controller.js";

import { createSenderSchema } from "../validations/schemas/admin.schema.js";

const router = Router();

router.get("/senders", loadUserSession, requireUser, getAdminSendersHomePage);
router.get(
  "/senders/new",
  loadUserSession,
  requireUser,
  getAdminSendersNewPage,
);
router.get("/patients", loadUserSession, requireUser, getAdminPatientsHomePage);
router.get("/messages", loadUserSession, requireUser, getAdminMessagesHomePage);

// api or page submissions
router.post(
  "/senders/new",
  loadUserSession,
  requireUser,
  validatePageSubmission({
    schema: createSenderSchema,
    routeMeta: routeMeta["createSender"],
  }),
  createSender,
);

export default router;
