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
  getAdminPatientsNewPage,

  // submissions
  createSender,
  createPatient,
} from "../controllers/admin.controller.js";

import {
  createSenderSchema,
  searchSendersSchema,
  createPatientSchema,
} from "../validations/schemas/admin.schema.js";

const router = Router();

router.get(
  "/senders",
  loadUserSession,
  requireUser,
  validatePageSubmission({
    schema: searchSendersSchema,
    routeMeta: routeMeta["adminSendersHome"],
  }),
  getAdminSendersHomePage,
);
router.get(
  "/senders/new",
  loadUserSession,
  requireUser,
  getAdminSendersNewPage,
);
router.get("/patients", loadUserSession, requireUser, getAdminPatientsHomePage);
router.get(
  "/patients/new",
  loadUserSession,
  requireUser,
  getAdminPatientsNewPage,
);
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
router.post(
  "/patients/new",
  loadUserSession,
  requireUser,
  validatePageSubmission({
    schema: createPatientSchema,
    routeMeta: routeMeta["createPatient"],
  }),
  createPatient,
);

export default router;
