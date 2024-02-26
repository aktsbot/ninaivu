import "dotenv/config";
import express from "express";
import path from "path";
import nunjucks from "nunjucks";
import cookieParser from "cookie-parser";
import connectFlash from "connect-flash";

import { connectDB, closeDB } from "./db.js";
import config from "./config.js";
import logger from "./logger.js";
import httpLogger from "./middlewares/http-logger.middleware.js";
import helpers from "./helpers.js";
import {
  notFound,
  errorHandler,
} from "./middlewares/error-handlers.middleware.js";
import appRouter from "./routes/index.js";

import { appSession } from "./session.js";

// node 20.11 and up
const __dirname = import.meta.dirname;

const app = express();

app.use(appSession());
app.use(connectFlash());

// thanks to wesbos
// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.session.user || null;
  res.locals.currentPath = req.path;
  next();
});

nunjucks.configure(path.join(__dirname, "views"), {
  autoescape: true,
  express: app,
  noCache: config.env === "development", // this refreshes templates in dev mode
});
app.engine("html", nunjucks.render);
app.set("view engine", "html");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(httpLogger());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", appRouter);

// if no route matches, let the error handler deal with the request
app.use(notFound);
app.use(errorHandler);

const server = app.listen(config.port, (err) => {
  if (err) {
    logger.fatal("app failed to start");
    logger.error(err);
    process.exit(1);
  }

  logger.info(`app started on port ${config.port}`);
  connectDB();
});

// clean up - when server dies, make sure db connection
// also dies
function cleanup() {
  server.close(() => {
    logger.warn("closed out app server");
    closeDB();
    // Note: the close event does actually happen, the docker logs
    // in mongo container does indicate that. The timeout is for us
    // to visually see the confirmation that the node process has
    // withdrawn connection - you can skip the timeout and call
    // process.exit straight away!

    // process.exit(0);
    setTimeout(() => {
      process.exit(0);
    }, 300);
  });
}
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("exit", cleanup);
