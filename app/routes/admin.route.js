import { Router } from "express";

import {
  loadUserSession,
  requireUser,
} from "../middlewares/auth.middleware.js";

import { validatePageSubmission } from "../middlewares/validate.middleware.js";

import { routeMeta } from "./meta.js";

import {
  getAdminHomePage,
  getAdminSendersHomePage,
  getAdminSendersNewPage,
  getAdminMessagesHomePage,
  getAdminPatientsHomePage,
  getAdminPatientsNewPage,
  getAdminMessagesNewPage,
  getAdminMessagesEditPage,
  getAdminSenderEditPage,
  getAdminPatientsEditPage,
  getAdminTagsPage,

  // submissions
  createSender,
  createPatient,
  createMessage,
  updateMessage,
  deleteMessage,
  updateSender,
  deleteSender,
  updatePatient,
  deletePatient,
  getAdminCSVReport,
  createTag,
} from "../controllers/admin.controller.js";

import {
  createSenderSchema,
  searchSchema,
  createPatientSchema,
  createMessageSchema,
  updateMessageSchema,
  updateSenderSchema,
  updatePatientSchema,
  createTagSchema,
} from "../validations/schemas/admin.schema.js";

const router = Router();

router.get(
  "/",
  loadUserSession,
  requireUser,
  validatePageSubmission({
    schema: searchSchema,
    routeMeta: routeMeta["adminHome"],
  }),
  getAdminHomePage,
);
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
  "/senders/:uuid/edit",
  loadUserSession,
  requireUser,
  getAdminSenderEditPage,
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
router.get(
  "/patients/:uuid/edit",
  loadUserSession,
  requireUser,
  getAdminPatientsEditPage,
);

router.get(
  "/messages",
  loadUserSession,
  requireUser,
  validatePageSubmission({
    schema: searchSchema,
    routeMeta: routeMeta["adminMessagesHome"],
  }),
  getAdminMessagesHomePage,
);
router.get(
  "/messages/new",
  loadUserSession,
  requireUser,
  getAdminMessagesNewPage,
);
router.get(
  "/messages/:uuid/edit",
  loadUserSession,
  requireUser,
  getAdminMessagesEditPage,
);
router.get("/tags", loadUserSession, requireUser, getAdminTagsPage);

// api or page submissions
router.post(
  "/senders/new",
  loadUserSession,
  requireUser,
  validatePageSubmission({
    schema: createSenderSchema,
    routeMeta: routeMeta["adminSendersNew"],
  }),
  createSender,
);
router.post(
  "/patients/new",
  loadUserSession,
  requireUser,
  validatePageSubmission({
    schema: createPatientSchema,
    routeMeta: routeMeta["adminPatientsNew"],
  }),
  createPatient,
);
router.post(
  "/messages/new",
  loadUserSession,
  requireUser,
  validatePageSubmission({
    schema: createMessageSchema,
    routeMeta: routeMeta["adminMessagesNew"],
  }),
  createMessage,
);
router.post(
  "/messages/:uuid/update",
  loadUserSession,
  requireUser,
  validatePageSubmission({
    schema: updateMessageSchema,
    routeMeta: routeMeta["adminMessagesEdit"],
    goBackOnError: true,
  }),
  updateMessage,
);
router.get(
  "/messages/:uuid/delete",
  loadUserSession,
  requireUser,
  deleteMessage,
);
router.post(
  "/senders/:uuid/update",
  loadUserSession,
  requireUser,
  validatePageSubmission({
    schema: updateSenderSchema,
    routeMeta: routeMeta["adminSendersEdit"],
    goBackOnError: true,
  }),
  updateSender,
);
router.get("/senders/:uuid/delete", loadUserSession, requireUser, deleteSender);
router.post(
  "/patients/:uuid/update",
  loadUserSession,
  requireUser,
  validatePageSubmission({
    schema: updatePatientSchema,
    routeMeta: routeMeta["adminPatientsEdit"],
    goBackOnError: true,
  }),
  updatePatient,
);
router.get(
  "/patients/:uuid/delete",
  loadUserSession,
  requireUser,
  deletePatient,
);
router.get(
  "/csv",
  loadUserSession,
  requireUser,
  validatePageSubmission({
    schema: searchSchema,
    goBackOnError: true,
  }),
  getAdminCSVReport,
);
router.post(
  "/tags/new",
  loadUserSession,
  requireUser,
  validatePageSubmission({
    schema: createTagSchema,
    goBackOnError: true,
  }),
  createTag,
);

export default router;
