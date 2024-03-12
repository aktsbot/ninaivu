import logger from "../logger.js";

import { routeMeta } from "../routes/meta.js";
import { patientMessageDays } from "../utils.js";

import User from "../models/user.model.js";
import Sender from "../models/sender.model.js";
import Patient from "../models/patient.model.js";
import Message from "../models/message.model.js";

// pages
export const getAdminSendersHomePage = async (req, res) => {
  try {
    const meta = routeMeta["adminSendersHome"];

    const page = req.xop.query.page || 1;
    const limit = 20;
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

    const promises = [
      Sender.countDocuments({}),
      Sender.countDocuments(query),
      Sender.find(
        query,
        "uuid name mobileNumber user notes createdAt updatedAt",
        { skip, limit },
      ).populate("user", "email uuid status createdAt updatedAt"),
    ];

    const [allCount, totalCount, senders] = await Promise.all(promises);

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
      allCount,
      totalCount,
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

export const getAdminPatientsNewPage = (_req, res) => {
  const meta = routeMeta["adminPatientsNew"];

  return res.render(meta.template, {
    ...meta.meta,
    patientMessageDays,
  });
};

export const getAdminMessagesHomePage = async (req, res, next) => {
  try {
    const meta = routeMeta["adminMessagesHome"];
    const page = req.xop.query.page || 1;
    const limit = 20;
    const skip = page * limit - limit;

    const query = {};
    const paginationUrls = {
      prev: `${req.baseUrl + req.path}?`,
      next: `${req.baseUrl + req.path}?`,
    };

    if (req.xop.query.search) {
      paginationUrls.prev += `&search=${req.xop.query.search}`;
      paginationUrls.next += `&search=${req.xop.query.search}`;

      query["content"] = { $regex: req.xop.query.search, $options: "i" };
    }

    const promises = [
      Message.countDocuments({}),
      Message.countDocuments(query),
      Message.find(query, "uuid content status createdAt updatedAt", {
        skip,
        limit,
      }),
    ];

    const [allCount, totalCount, messages] = await Promise.all(promises);

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
      messages,
      allCount,
      totalCount,
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

export const getAdminMessagesNewPage = (_req, res) => {
  const meta = routeMeta["adminMessagesNew"];

  return res.render(meta.template, {
    ...meta.meta,
  });
};

export const getAdminPatientsHomePage = async (req, res, next) => {
  try {
    const meta = routeMeta["adminPatientsHome"];

    const page = req.xop.query.page || 1;
    const limit = 20;
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
        { patientId: req.xop.query.search },
        {
          mobileNumbers: req.xop.query.search,
        },
      ];
    }

    const promises = [
      Patient.countDocuments({}),
      Patient.countDocuments(query),
      Patient.find(
        query,
        "uuid name status mobileNumbers messagesEvery patientId notes createdAt updatedAt",
        { skip, limit },
      ),
    ];

    const [allCount, totalCount, patients] = await Promise.all(promises);

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
      patients,
      allCount,
      totalCount,
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

export const getAdminMessagesEditPage = async (req, res, next) => {
  try {
    const meta = routeMeta["adminMessagesEdit"];
    return res.render(meta.template, {
      ...meta.meta,
    });
  } catch (error) {
    next(error);
  }
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

export const createPatient = async (req, res, next) => {
  const meta = routeMeta["adminPatientsNew"];

  try {
    const { body } = req.xop;
    const patient = await new Patient({
      ...body,
      mobileNumbers: body.mobileNumbers.split(",").map((n) => n.trim()),
      createdBy: res.locals.user._id,
    }).save();

    req.flash("success", [
      `Patient ${patient.name} has been created successfully.`,
    ]);

    res.redirect("/admin/patients");
    return;
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (req, res, next) => {
  const meta = routeMeta["adminMessagesNew"];

  try {
    const { body } = req.xop;
    await new Message({
      ...body,
      createdBy: res.locals.user._id,
    }).save();

    req.flash("success", [`Message has been created successfully.`]);

    res.redirect("/admin/messages");
    return;
  } catch (error) {
    next(error);
  }
};
