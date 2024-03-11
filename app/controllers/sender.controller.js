import logger from "../logger.js";

import { routeMeta } from "../routes/meta.js";

import Patient from "../models/patient.model.js";
import Message from "../models/message.model.js";

export const getSendersHomePage = async (req, res) => {
  // TODO: this is a stub till we figure out a flow
  try {
    const meta = routeMeta["sendersHome"];

    return res.render(meta.template, {
      ...meta.meta,
    });
  } catch (error) {
    next(error);
  }
};
