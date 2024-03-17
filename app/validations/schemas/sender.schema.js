import joi from "joi";

// the .unknown allows us to proceed if we dont have query or params
// defined in the schema
export const actionMessageSchema = joi
  .object()
  .keys({
    body: joi.object().keys({
      confirmSent: joi.string().valid("yes", "no").required(),
      queueItemId: joi.string().guid().required(),
    }),
  })
  .unknown(true);
