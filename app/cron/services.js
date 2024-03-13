import Patient from "../models/patient.model.js";
import Sender from "../models/sender.model.js";
import Queue from "../models/queue.model.js";

import logger from "../logger.js";

export const makePatientQueueForDay = async ({ day, startOfDay }) => {
  const patientList = [];
  try {
    const patients = await Patient.find({
      messagesEvery: day,
      status: "active",
    });
  } catch (error) {
    logger.error(`getPatientListForDay error`);
    logger.error(error);
  }
};
