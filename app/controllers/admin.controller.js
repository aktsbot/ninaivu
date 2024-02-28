import logger from "../logger.js";

import { routeMeta } from "../routes/meta.js";

import User from "../models/user.model.js";
import Sender from "../models/sender.model.js";

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

// page submissions

export const createSender = async (req, res, next) => {
  const meta = routeMeta["adminSendersNew"];

  try {
    const errorMessage = "This email is already being used by a user.";

    const { body } = req.xop;
    const userPresent = await User.findOne(
      { email: body.senderEmail },
      { _id: 1, password: 1, email: 1, fullName: 1 },
    );

    if (userPresent) {
      req.flash("error", [errorMessage]);
      return res.status(401).render(meta.template, {
        ...meta.meta,
        flashes: req.flash(),
        body,
      });
    }

    const user = await new User({
      fullName: body.name,
      email: body.senderEmail,
      password: body.senderPassword,
      userType: "sender",
    }).save();

    const sender = await new Sender({
      name: body.name,
      mobileNumber: body.mobileNumber,
      notes: body.notes,
      user: user._id,
    }).save();

    req.flash("success", [
      `Sender ${user.fullName} (${sender.mobileNumber}) has been created successfully.`,
    ]);

    res.redirect("/admin/senders");
    return;
  } catch (error) {
    next(error);
  }
};
