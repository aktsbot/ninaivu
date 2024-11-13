import Patient from "../models/patient.model.js";
import Message from "../models/message.model.js";
import Queue from "../models/queue.model.js";

import logger from "../logger.js";

const buildSentMessageStats = ({ sentMessages }) => {
  const stats = [];

  for (const message of sentMessages) {
    const foundIndex = stats.findIndex(
      (s) => s.message === message.message.toString(), // .message is an ObjectId
    );
    if (foundIndex === -1) {
      const obj = {
        message: message.message.toString(),
        resendCount: 0,
        lastSentOn: message.forDate,
      };
      stats.push(obj);
    } else {
      stats[foundIndex]["resendCount"] += 1;
      // update last datetime of recent send!
      if (
        message.forDate.getTime() > stats[foundIndex]["lastSentOn"].getTime()
      ) {
        stats[foundIndex]["lastSentOn"] = message.forDate;
      }
    }
  }

  logger.debug("---- stats ----");
  logger.debug(stats);
  logger.debug("---- sentMessages ----");
  logger.debug(sentMessages);

  // now sort by asc order of resendCount and forDate(date when the message is to be sent)
  const sortedStats = stats.sort(
    (a, b) =>
      a["resendCount"] - b["resendCount"] ||
      a["lastSentOn"].getTime() - b["lastSentOn"].getTime(),
  );

  return sortedStats;
};

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
      //
      // we plan on getting the message that has been sent least number of times and
      // then sending that, if we dont find any messages that have not been sent
      const sentMessages = await Queue.find(
        { patient: p._id },
        "message resendCount forDate",
        { sort: { resendCount: -1, forDate: -1 } },
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
          resendCount: 0,
        };
        patientList.push(payload);
      } else {
        logger.info(
          `Patient has no new unsent messages. Getting the least sent message for the patient ...`,
        );
        const messageStats = buildSentMessageStats({ sentMessages });
        // we get sorted array of messages that look like
        // { message: '_id', resendCount: 2 }
        // the first element is the message that has been sent the least number of times.
        if (messageStats[0]) {
          const messageData = await Message.findOne({
            status: "active",
            _id: messageStats[0]["message"],
          });
          if (messageData) {
            const payload = {
              messageText: messageData.content,
              mobileNumbers: p.mobileNumbers.join(","),
              patient: p._id,
              message: messageData._id,
              forDate: startOfDay,
              resendCount: messageStats[0]["resendCount"] + 1,
            };
            patientList.push(payload);
          }
        }
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
