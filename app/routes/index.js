import { Router } from "express";

import authRouter from "./auth.route.js";
import generalRouter from "./general.route.js";
import adminRouter from "./admin.route.js";
import senderRouter from "./sender.route.js";

const appRouter = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/admin", adminRouter);
appRouter.use("/sender", senderRouter);

// should be the last route
appRouter.use("/", generalRouter);

export default appRouter;
