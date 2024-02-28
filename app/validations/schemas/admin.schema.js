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
