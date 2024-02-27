import logger from "../logger.js";

import { routeMeta } from "../routes/meta.js";

// pages
export const getAdminSendersHomePage = (_req, res) => {
  const meta = routeMeta["adminSendersHome"];

  return res.render(meta.template, {
    ...meta.meta,
  });
};

export const getAdminSendersNewPage = (_req, res) => {
  const meta = routeMeta["adminSendersNew"];

  return res.render(meta.template, {
    ...meta.meta,
  });
};

export const getAdminPatientsHomePage = (_req, res) => {
  const meta = routeMeta["adminPatientsHome"];

  return res.render(meta.template, {
    ...meta.meta,
  });
};

export const getAdminMessagesHomePage = (_req, res) => {
  const meta = routeMeta["adminMessagesHome"];

  return res.render(meta.template, {
    ...meta.meta,
  });
};
