import logger from "../logger.js";

import { routeMeta } from "../routes/meta.js";

import User from "../models/user.model.js";
import Sender from "../models/sender.model.js";

// pages
export const getAdminSendersHomePage = async (req, res) => {
  try {
    const meta = routeMeta["adminSendersHome"];

    const page = req.xop.query.page || 1;
    const limit = 2; // TODO: just for testing
    const skip = page * limit - limit;

    const query = {};
    const paginationUrls = {
      prev: `${req.baseUrl + req.path}?`,
      next: `${req.baseUrl + req.path}?`,
    };

    if (req.xop.query.search) {
      paginationUrls.prev += `&search=${req.xop.query.search}`;
      paginationUrls.next += `&search=${req.xop.query.search}`;

      query["$or"] = [
        { name: { $regex: req.xop.query.search, $options: "i" } },
        { mobileNumber: { $regex: req.xop.query.search, $options: "i" } },
      ];
    }

    const totalCount = await Sender.countDocuments(query);

    const senders = await Sender.find(
      query,
      "uuid name mobileNumber user notes createdAt updatedAt",
      { skip, limit },
    ).populate("user", "email uuid status createdAt updatedAt");

    logger.debug("senders");
    logger.debug(senders);

    const totalPages = Math.ceil(totalCount / limit);

    if (page != 1) {
      paginationUrls.prev += `&page=${page - 1}`;
    }

    if (totalPages > page) {
      paginationUrls.next += `&page=${page + 1}`;
    }

    logger.debug(`totalPages ${totalPages}`);
    logger.debug(`page ${page}`);

    return res.render(meta.template, {
      ...meta.meta,
      senders,
      pagination: {
        page,
        limit,
        skip,
        totalCount,
        totalPages,
        urls: paginationUrls,
      },
      query: req.xop.query,
    });
  } catch (error) {
    next(error);
  }
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
