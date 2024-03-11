import logger from "../logger.js";

import { routeMeta } from "../routes/meta.js";

import Patient from "../models/patient.model.js";
import Message from "../models/message.model.js";

export const getSendersHomePage = async (_req, res) => {
  // TODO: this is a stub till we figure out a flow
  try {
    const meta = routeMeta["sendersHome"];

    const [pcount, mcount] = await Promise.all([
      Patient.countDocuments({ status: "active" }),
      Message.countDocuments({ status: "active" }),
    ]);

    const pIndex = Math.floor(Math.random() * pcount);
    const mIndex = Math.floor(Math.random() * mcount);
    const patients = await Patient.find(
      {},
      { patientId: 1, mobileNumbers: 1 },
      { skip: pIndex, limit: 1 },
    );
    const messages = await Message.find({}, {}, { skip: mIndex, limit: 1 });

    logger.debug("patients ");
    logger.debug(patients);
    logger.debug("messages ");
    logger.debug(messages);

    return res.render(meta.template, {
      ...meta.meta,
      patient: patients[0],
      message: messages[0],
    });
  } catch (error) {
    next(error);
  }
};
