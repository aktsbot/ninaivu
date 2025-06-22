import cron from "node-cron";

import logger from "../logger.js";
import { makePatientQueueForDay } from "./services.js";

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
    const day = days[new Date().getDay()];
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    // --- for testing only!
    // const date = "2025-05-03T03:20:01.041Z";
    // const day = "friday";
    // const startOfDay = new Date(date);
    // startOfDay.setUTCHours(0, 0, 0, 0);

    await makePatientQueueForDay({ day, startOfDay });
  } catch (error) {
    logger.error(error);
  }
}

export const startCrons = () => {
  cron.schedule("0 * * * *", () => {
    logger.info("running cron task every hour: queuer");
    queuer();
  });

  // README: For debugging only! -----
  // queuer();
  // ---------------------------------
};
