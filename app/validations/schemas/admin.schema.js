import joi from "joi";

// the .unknown allows us to proceed if we dont have query or params
// defined in the schema
export const createSenderSchema = joi
  .object()
  .keys({
    body: joi.object().keys({
      name: joi.string().required(),
      mobileNumber: joi.string().required(),
      senderEmail: joi.string().email().required(),
      senderPassword: joi.string().required(),
      notes: joi.string().allow(""),
    }),
  })
  .unknown(true);

export const searchSchema = joi
  .object()
  .keys({
    query: joi.object().keys({
      search: joi.string().allow("").optional(),
      page: joi.number().optional().min(1),
      fromDate: joi.string().allow("").optional(),
      toDate: joi.string().allow("").optional(),
    }),
  })
  .unknown(true);

export const createPatientSchema = joi
  .object()
  .keys({
    body: joi.object().keys({
      patientId: joi.string().required(),
      name: joi.string().required(),
      mobileNumbers: joi.string().required(),
      notes: joi.string().allow(""),
      messagesEvery: joi.array().items(joi.string().required()).required(),
    }),
  })
  .unknown(true);

export const createMessageSchema = joi
  .object()
  .keys({
    body: joi.object().keys({
      content: joi.string().required(),
      notes: joi.string().allow("").optional(),
      tag: joi.string().optional(),
    }),
  })
  .unknown(true);

export const updateMessageSchema = joi
  .object()
  .keys({
    params: joi.object().keys({
      uuid: joi.string().guid().required(),
    }),
    body: joi.object().keys({
      content: joi.string().required(),
      notes: joi.string().allow("").optional(),
    }),
  })
  .unknown(true);

export const updateSenderSchema = joi
  .object()
  .keys({
    params: joi.object().keys({
      uuid: joi.string().guid().required(),
    }),
    body: joi.object().keys({
      name: joi.string().required(),
      mobileNumber: joi.string().required(),
      senderEmail: joi.string().email().required(),
      notes: joi.string().allow(""),
    }),
  })
  .unknown(true);

export const updatePatientSchema = joi
  .object()
  .keys({
    params: joi.object().keys({
      uuid: joi.string().guid().required(),
    }),
    body: joi.object().keys({
      patientId: joi.string().required(),
      name: joi.string().required(),
      mobileNumbers: joi.string().required(),
      notes: joi.string().allow(""),
      messagesEvery: joi.array().items(joi.string().required()).required(),
    }),
  })
  .unknown(true);

export const createTagSchema = joi
  .object()
  .keys({
    body: joi.object().keys({
      name: joi.string().required(),
      backgroundColor: joi.string().allow(""),
      textColor: joi.string().allow(""),
    }),
  })
  .unknown(true);
