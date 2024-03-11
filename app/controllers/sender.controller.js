import logger from "../logger.js";

import { routeMeta } from "../routes/meta.js";

export const getSendersHomePage = async (req, res) => {
  try {
    const meta = routeMeta["sendersHome"];

    return res.render(meta.template, {
      ...meta.meta,
    });
  } catch (error) {
    next(error);
  }
};
