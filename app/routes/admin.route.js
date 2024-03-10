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
  getAdminMessagesNewPage,

  // submissions
  createSender,
  createPatient,
} from "../controllers/admin.controller.js";

import {
  createSenderSchema,
  searchSchema,
  createPatientSchema,
} from "../validations/schemas/admin.schema.js";

const router = Router();

router.get(
  "/senders",
  loadUserSession,
  requireUser,
  validatePageSubmission({
    schema: searchSchema,
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
router.get(
  "/patients",
  loadUserSession,
  requireUser,
  validatePageSubmission({
    schema: searchSchema,
    routeMeta: routeMeta["adminPatientsHome"],
  }),
  getAdminPatientsHomePage,
);
router.get(
  "/patients/new",
  loadUserSession,
  requireUser,
  getAdminPatientsNewPage,
);
router.get("/messages", loadUserSession, requireUser, getAdminMessagesHomePage);
router.get(
  "/messages/new",
  loadUserSession,
  requireUser,
  getAdminMessagesNewPage,
);

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
