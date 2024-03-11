import { routeMeta } from "../routes/meta.js";

import logger from "../logger.js";

// pages
export const getHomePage = (_req, res) => {
  logger.debug("User ");
  logger.debug(res.locals.user);

  if (res.locals.user && res.locals.user.userType === "sender") {
    return res.redirect("/sender/send-message");
  }

  const meta = routeMeta["home"];

  return res.render(meta.template, {
    ...meta.meta,
  });
};
