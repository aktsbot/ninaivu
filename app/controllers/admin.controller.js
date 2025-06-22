import logger from "../logger.js";

import { routeMeta } from "../routes/meta.js";
import {
  patientMessageDays,
  startOfDay,
  endOfDay,
  makeReportJSON,
  mobileNumberOperatorList,
} from "../utils.js";

import { json2csv } from "json-2-csv";

import User from "../models/user.model.js";
import Sender from "../models/sender.model.js";
import Patient from "../models/patient.model.js";
import Message from "../models/message.model.js";
import Queue from "../models/queue.model.js";
import Tag from "../models/tag.model.js";

// pages
export const getAdminHomePage = async (req, res, next) => {
  try {
    const meta = routeMeta["adminHome"];
    const page = req.xop.query.page || 1;
    const limit = 20;
    const skip = page * limit - limit;

    const query = {};
    let showFilters = false;

    const paginationUrls = {
      prev: `${req.baseUrl + req.path}?`,
      next: `${req.baseUrl + req.path}?`,
    };

    if (req.xop.query.search) {
      showFilters = true;
      paginationUrls.prev += `&search=${req.xop.query.search}`;
      paginationUrls.next += `&search=${req.xop.query.search}`;

      // search for patient id or message text
      const patients = await Patient.find(
        {
          patientId: { $regex: req.xop.query.search, $options: "i" },
        },
        "_id uuid"
      );

      query["$or"] = [
        { messageText: { $regex: req.xop.query.search, $options: "i" } },
      ];

      if (patients.length) {
        query["$or"].push({
          patient: patients.map((p) => p._id),
        });
      }
    }

    if (req.xop.query.fromDate) {
      showFilters = true;
      // YYYY-MM-DD <-- format
      query["forDate"] = {
        $gte: startOfDay(req.xop.query.fromDate),
      };
    }
    if (req.xop.query.toDate) {
      showFilters = true;
      if (query["forDate"]) {
        query["forDate"] = {
          ...query["forDate"],
          $lte: endOfDay(req.xop.query.toDate),
        };
      } else {
        query["forDate"] = {
          $lte: endOfDay(req.xop.query.toDate),
        };
      }
    }

    const promises = [
      Queue.countDocuments({}),
      Queue.countDocuments(query),
      Queue.find(query, {}, { skip, limit, sort: { forDate: -1 } })
        .populate("patient")
        .populate("message")
        .populate("sender"),
    ];

    const [allCount, totalCount, reports] = await Promise.all(promises);

    // logger.debug("reports");
    // logger.debug(JSON.stringify(reports));

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
      reports,
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
      showFilters,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminSendersHomePage = async (req, res, next) => {
  try {
    const meta = routeMeta["adminSendersHome"];

    const page = req.xop.query.page || 1;
    const limit = 20;
    const skip = page * limit - limit;

    const query = {
      status: ["active", "inactive"],
    };
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
      Sender.countDocuments({ status: ["active", "inactive"] }),
      Sender.countDocuments(query),
      Sender.find(
        query,
        "uuid name mobileNumber user notes createdAt updatedAt",
        { skip, limit }
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

export const getAdminSenderEditPage = async (req, res, next) => {
  try {
    const meta = routeMeta["adminSendersEdit"];
    const sender = await Sender.findOne(
      { uuid: req.params.uuid },
      "uuid name mobileNumber notes user createdAt"
    ).populate("user", "fullName email uuid");

    return res.render(meta.template, {
      ...meta.meta,
      sender,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminPatientsNewPage = async (_req, res) => {
  try {
    const meta = routeMeta["adminPatientsNew"];
    const allTags = await Tag.find({}, {}, { sort: { _id: -1 } });

    return res.render(meta.template, {
      ...meta.meta,
      patientMessageDays,
      allTags,
      mobileNumberOperatorList,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminMessagesHomePage = async (req, res, next) => {
  try {
    const meta = routeMeta["adminMessagesHome"];
    const page = req.xop.query.page || 1;
    const limit = 20;
    const skip = page * limit - limit;

    const query = {
      status: ["active", "inactive"],
    };
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
      Message.countDocuments({ status: ["active", "inactive"] }),
      Message.countDocuments(query),
      Message.find(query, "uuid content notes tag status createdAt updatedAt", {
        skip,
        limit,
      }).populate("tag", "name backgroundColor textColor"),
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

export const getAdminMessagesNewPage = async (_req, res) => {
  try {
    const meta = routeMeta["adminMessagesNew"];

    const allTags = await Tag.find({}, {}, { sort: { _id: -1 } });

    return res.render(meta.template, {
      ...meta.meta,
      allTags,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminPatientsHomePage = async (req, res, next) => {
  try {
    const meta = routeMeta["adminPatientsHome"];

    const page = req.xop.query.page || 1;
    const limit = 20;
    const skip = page * limit - limit;

    const query = {
      status: ["active", "inactive"],
    };
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

    if (req.xop.query.messagesEvery) {
      query["messagesEvery"] = {
        $in: req.xop.query.messagesEvery,
      };

      // to make the url look like
      // ?messagesEvery[]=monday&messagesEvery[]=thursday
      // this helps express get
      // {messagesEvery: [monday, thursday]}
      for (const mev of req.xop.query.messagesEvery) {
        paginationUrls.prev += `&messagesEvery[]=${mev}`;
        paginationUrls.next += `&messagesEvery[]=${mev}`;
      }
    }

    logger.debug("query");
    logger.debug(query);

    const promises = [
      Patient.countDocuments({ status: ["active", "inactive"] }),
      Patient.countDocuments(query),
      Patient.find(
        query,
        "uuid name status mobileNumbers mobileNumberOperator messagesEvery tag patientId notes createdAt updatedAt",
        { skip, limit }
      ).populate("tag", "backgroundColor textColor name"),
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
      patientMessageDays,
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
    const allTags = await Tag.find({}, {}, { sort: { _id: -1 } });
    const message = await Message.findOne(
      { uuid: req.params.uuid },
      "uuid content notes tag status createdAt"
    ).populate("tag", "name backgroundColor textColor");

    return res.render(meta.template, {
      ...meta.meta,
      message,
      allTags,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminPatientsEditPage = async (req, res, next) => {
  try {
    const meta = routeMeta["adminPatientsEdit"];
    const allTags = await Tag.find({}, {}, { sort: { _id: -1 } });
    const patient = await Patient.findOne({ uuid: req.params.uuid }).populate(
      "tag",
      "name backgroundColor textColor"
    );
    return res.render(meta.template, {
      ...meta.meta,
      patient,
      patientMessageDays,
      allTags,
      mobileNumberOperatorList,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminTagsPage = async (req, res, next) => {
  try {
    const meta = routeMeta["adminTags"];
    const allTags = await Tag.find({}, {}, { sort: { _id: -1 } });
    return res.render(meta.template, {
      ...meta.meta,
      allTags,
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
      { _id: 1, password: 1, email: 1, fullName: 1 }
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
    // if a tag has been passed, make sure it exists
    if (body.tag) {
      const tagFound = await Tag.findById(body.tag);
      if (!tagFound) {
        req.flash("error", ["Selected tag not found"]);
        return res.status(400).render(meta.template, {
          ...meta.meta,
          flashes: req.flash(),
          body,
        });
      }
    }

    const patient = await new Patient({
      ...body,
      mobileNumbers: body.mobileNumbers.split(",").map((n) => n.trim()),
      createdBy: res.locals.user._id,
    }).save();

    req.flash("success", [
      `Patient ${patient.name} has been created successfully.`,
    ]);

    const limit = 20;
    const totalPatientCount = await Patient.countDocuments({
      status: ["active", "inactive"],
    });
    const totalPages = Math.ceil(totalPatientCount / limit);

    // go back to the last page of patient list
    res.redirect(`/admin/patients?page=${totalPages}`);
    return;
  } catch (error) {
    next(error);
  }
};

export const createMessage = async (req, res, next) => {
  const meta = routeMeta["adminMessagesNew"];

  try {
    const { body } = req.xop;

    // if a tag has been passed, make sure it exists
    if (body.tag) {
      const tagFound = await Tag.findById(body.tag);
      if (!tagFound) {
        req.flash("error", ["Selected tag not found"]);
        return res.status(400).render(meta.template, {
          ...meta.meta,
          flashes: req.flash(),
          body,
        });
      }
    }
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

export const updateMessage = async (req, res, next) => {
  const meta = routeMeta["adminMessagesEdit"];

  try {
    const { body } = req.xop;
    // if a tag has been passed, make sure it exists
    if (body.tag) {
      const tagFound = await Tag.findById(body.tag);
      if (!tagFound) {
        req.flash("error", ["Selected tag not found"]);
        return res.status(400).render(meta.template, {
          ...meta.meta,
          flashes: req.flash(),
          body,
        });
      }
    }
    await Message.updateOne(
      {
        uuid: req.params.uuid,
      },
      {
        $set: {
          ...body,
        },
      }
    );

    req.flash("success", [`Message has been updated successfully.`]);

    res.redirect("/admin/messages");
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    await Message.updateOne(
      {
        uuid: req.params.uuid,
      },
      {
        $set: {
          status: "zz-deleted",
        },
      }
    );

    req.flash("success", [`Message has been deleted successfully.`]);

    res.redirect("/admin/messages");
    return;
  } catch (error) {
    next(error);
  }
};

export const updateSender = async (req, res, next) => {
  try {
    const errorMessage = "This email is already being used by a user.";

    const { body } = req.xop;

    const senderInfo = await Sender.findOne({
      uuid: req.params.uuid,
    }).populate("user", "uuid email fullName");

    // check if this email is in use by someone else
    const emailUsed = await User.countDocuments({
      uuid: {
        $ne: senderInfo.user.uuid,
      },
      email: body.senderEmail,
    });

    if (emailUsed) {
      req.flash("error", errorMessage);
      return res.redirect(req.header("referer"));
    }

    senderInfo.name = body.name;
    senderInfo.mobileNumber = body.mobileNumber;
    senderInfo.notes = body.notes;

    senderInfo.user.fullName = body.name;
    senderInfo.user.email = body.senderEmail;

    await senderInfo.save();
    await senderInfo.user.save();

    req.flash("success", [
      `Sender ${senderInfo.user.fullName} (${senderInfo.mobileNumber}) has been updated successfully.`,
    ]);

    res.redirect("/admin/senders");
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteSender = async (req, res, next) => {
  try {
    const senderInfo = await Sender.findOne({
      uuid: req.params.uuid,
    }).populate("user", "uuid status email fullName");

    senderInfo.status = "zz-deleted";
    senderInfo.user.status = "zz-deleted";

    await senderInfo.save();
    await senderInfo.user.save();

    req.flash("success", [
      `Sender ${senderInfo.name} has been deleted successfully.`,
    ]);

    res.redirect("/admin/senders");
    return;
  } catch (error) {
    next(error);
  }
};

export const updatePatient = async (req, res, next) => {
  try {
    const { body } = req.xop;
    // if a tag has been passed, make sure it exists
    if (body.tag) {
      const tagFound = await Tag.findById(body.tag);
      if (!tagFound) {
        req.flash("error", ["Selected tag not found"]);
        return res.redirect(req.header("referer"));
      }
    }

    await Patient.updateOne(
      {
        uuid: req.params.uuid,
      },
      {
        $set: {
          ...body,
        },
      }
    );

    req.flash("success", [`Patient has been updated successfully.`]);

    res.redirect("/admin/patients");
    return;
  } catch (error) {
    next(error);
  }
};

export const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({
      uuid: req.params.uuid,
    });

    patient.status = "zz-deleted";

    await patient.save();

    req.flash("success", [
      `Patient ${patient.name} has been deleted successfully.`,
    ]);

    res.redirect("/admin/patients");
    return;
  } catch (error) {
    next(error);
  }
};

export const createTag = async (req, res, next) => {
  try {
    const { body } = req.xop;
    await new Tag({
      ...body,
      createdBy: res.locals.user._id,
    }).save();

    req.flash("success", [`Tag has been created successfully.`]);

    res.redirect("/admin/tags");
    return;
  } catch (error) {
    next(error);
  }
};
// pages
export const getAdminCSVReport = async (req, res, next) => {
  try {
    const query = {};

    if (req.xop.query.fromDate) {
      // YYYY-MM-DD <-- format
      query["forDate"] = {
        $gte: startOfDay(req.xop.query.fromDate),
      };
    }
    if (req.xop.query.toDate) {
      if (query["forDate"]) {
        query["forDate"] = {
          ...query["forDate"],
          $lte: endOfDay(req.xop.query.toDate),
        };
      } else {
        query["forDate"] = {
          $lte: endOfDay(req.xop.query.toDate),
        };
      }
    }

    const promises = [
      Queue.find(query, {}, { sort: { forDate: -1 } })
        .populate("patient")
        .populate("message")
        .populate("sender"),
    ];

    const [reports] = await Promise.all(promises);

    const json = makeReportJSON(reports);
    const csv = json2csv(json);

    let fileName = `ninaivureport_${new Date().getTime()}`;
    fileName += `_${req.xop.query.fromDate.replace(/-/g, "")}`;
    fileName += `_${req.xop.query.toDate.replace(/-/g, "")}`;
    fileName += ".csv";

    return res.attachment(fileName).send(csv);
  } catch (error) {
    next(error);
  }
};
