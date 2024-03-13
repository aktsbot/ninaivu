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
  //
  // find the current date
  //
  // get patients that need to be sent messages on current day
  //
  // check if these patients have entry in the queue collection
  // if yes, remove them from this list
  // if no, add them to this list
  //
  // insert the list into queue collection - status
  //
  try {
    const date = new Date();
    const day = days[new Date().getDay()];
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    // const date = '2023-03-27T03:20:01.041Z'
    // const day = 'tuesday'
  } catch (error) {
    logger.error(error);
  }
}

cron.schedule("* * * * *", () => {
  logger.info("running cron task every minute: queuer");
  queuer();
});
