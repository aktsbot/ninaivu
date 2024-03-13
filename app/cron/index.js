import cron from "node-cron";

import logger from "../logger.js";

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

async function queuer() {
  try {
  } catch (error) {
    logger.error(error);
  }
}

cron.schedule("* * * * *", () => {
  logger.info("running cron task every minute: queuer");
  queuer();
});
