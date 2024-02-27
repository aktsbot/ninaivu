import { Router } from "express";

import {
  loadUserSession,
  requireUser,
} from "../middlewares/auth.middleware.js";

import { routeMeta } from "./meta.js";

import {
  getAdminSendersHomePage,
  getAdminSendersNewPage,
  getAdminMessagesHomePage,
  getAdminPatientsHomePage,
} from "../controllers/admin.controller.js";

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

export default router;
