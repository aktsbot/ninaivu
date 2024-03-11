import { Router } from "express";

import {
  loadUserSession,
  requireUser,
} from "../middlewares/auth.middleware.js";

// import { validatePageSubmission } from "../middlewares/validate.middleware.js";
//
// import { routeMeta } from "./meta.js";

import { getSendersHomePage } from "../controllers/sender.controller.js";

const router = Router();

router.get("/", loadUserSession, requireUser, getSendersHomePage);

export default router;
