import Patient from "../models/patient.model.js";
import Message from "../models/message.model.js";
import Queue from "../models/queue.model.js";

import logger from "../logger.js";

export const makePatientQueueForDay = async ({ day, startOfDay }) => {
  logger.info(`making list for ${day} : ${startOfDay}`);
  const patientList = [];
  try {
    // https://stackoverflow.com/questions/62928285/mongodb-querying-collection-and-filtering-by-array-in-another-collection
    // get patients who had not entered in the queue table for the date or if they dont have an entry at all
    // const patients = await Patient.aggregate([
    //   {
    //     $match: {
    //       messagesEvery: day,
    //       status: "active",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "queues", // collection name and not model name
    //       localField: "_id",
    //       foreignField: "patient",
    //       as: "queuedPatients",
    //     },
    //   },
    //   {
    //     $match: {
    //       $or: [
    //         {
    //           "queues.forDate": {
    //             $lt: startOfDay,
    //           },
    //         },
    //         {
    //           queuedPatients: {
    //             $size: 0,
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   //Remove extra field
    //   {
    //     $unset: "queuedPatients",
    //   },
    // ]);

    let patients = [];

    const patientsForDay = await Patient.find({
      messagesEvery: day,
      status: "active",
    }).lean();

    const alreadyQueuedPatientsForDay = await Queue.find({
      patient: patientsForDay.map((p) => p._id),
      forDate: startOfDay,
    }).lean();

    // logger.debug(`already queued`);
    // logger.debug(alreadyQueuedPatientsForDay);

    if (alreadyQueuedPatientsForDay.length) {
      const _aqpIds = alreadyQueuedPatientsForDay.map((a) =>
        a.patient.toString(),
      );
      patients = patientsForDay.filter(
        (p) => !_aqpIds.includes(p._id.toString()),
      );
    } else {
      patients = [...patientsForDay];
    }

    logger.debug(`-- patients for this day --`);
    logger.debug(patients);

    // return;

    for (const p of patients) {
      // get messages that have not been sent for this patient
      const sentMessages = await Queue.find(
        { patient: p._id },
        "message",
      ).lean();
      let messageIdsToRemove = [];
      if (sentMessages.length) {
        messageIdsToRemove = sentMessages.map((s) => s.message.toString());
      }

      const oneMessage = await Message.findOne({
        status: "active",
        _id: {
          $nin: messageIdsToRemove,
        },
      });

      if (oneMessage) {
        const payload = {
          messageText: oneMessage.content,
          mobileNumbers: p.mobileNumbers.join(","),
          patient: p._id,
          message: oneMessage._id,
          forDate: startOfDay,
        };
        patientList.push(payload);
      }
    }

    if (patientList.length) {
      logger.info(
        `Inserting ${patientList.length} entries for queue on ${day} : ${startOfDay}`,
      );
      await Queue.insertMany(patientList);
    } else {
      logger.info(`No inserts in queue on ${day} : ${startOfDay}`);
    }
  } catch (error) {
    logger.error(`getPatientListForDay error`);
    logger.error(error);
  }
};
