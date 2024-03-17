import logger from "../logger.js";

import { routeMeta } from "../routes/meta.js";

import Queue from "../models/queue.model.js";

export const getSendersHomePage = async (req, res, next) => {
  try {
    const meta = routeMeta["sendersHome"];

    // if the sender has something in the queue that
    // was assigned to them. give them that instead of getting
    // a new one for them.
    let queueItem = null;

    queueItem = await Queue.findOne({
      status: "01-sent-to-sender",
      sender: res.locals.user._id,
    }).populate("patient");

    if (!queueItem) {
      // get new one item in the queue and assign it to
      // this sender
      queueItem = await Queue.findOne(
        {
          status: ["00-created", "10-try-another-sender"],
        },
        {},
        { sort: { status: 1 } },
      ).populate("patient");
    }

    logger.debug("queue item");
    logger.debug(queueItem);

    let patient = {
      patientId: null,
      mobileNumbers: "",
    };
    let messageText = "";
    let queueItemId = "";

    if (queueItem) {
      queueItem.sender = res.locals.user._id;
      queueItem.addLog(`Sent to sender: ${res.locals.user.fullName}`);
      queueItem.status = "01-sent-to-sender";
      await queueItem.save();

      patient.patientId = queueItem.patient.patientId;
      patient.mobileNumbers = queueItem.mobileNumbers;
      messageText = queueItem.messageText;
      queueItemId = queueItem.uuid;
    }

    logger.debug("patient --");
    logger.debug(queueItem.patient);
    logger.debug("messageText --");
    logger.debug(messageText);

    return res.render(meta.template, {
      ...meta.meta,
      patient,
      messageText,
      queueItemId,
    });
  } catch (error) {
    next(error);
  }
};
