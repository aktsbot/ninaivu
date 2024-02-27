/*
 * ninaivu does not allow for user creation. there is only admins and
 * admins manage everything on the portal.
 *
 * Run this script like node contrib/create-user.js
 */
import "dotenv/config";
import { connectDB, closeDB } from "../app/db.js";
import logger from "../app/logger.js";

import User from "../app/models/user.model.js";

connectDB();

function help() {
  console.log(`

To run this script:

$ NINAIVU_EMAIL=foo@gmail.com \
NINAIVU_FULLNAME="Jimmy Jane" \
NINAIVU_PASSWORD="JimmyFoo98Th" \
node contrib/create-user.js

The $ represents the shell prompt. After the script gives a success.
you can login with the user.
`);
}

async function start({ fullName, email, password }) {
  try {
    if (!fullName || !email || !password) {
      logger.error(`scripts arguments not found.`);
      help();
      return;
    }

    const user = await new User({
      fullName,
      email,
      password,
      userType: "admin",
    }).save();

    logger.info("Success. User has been created");
    logger.info(`uuid: ${user.uuid}`);
  } catch (error) {
    logger.error(error);
  } finally {
    closeDB();
  }
}

start({
  fullName: process.env.NINAIVU_FULLNAME,
  email: process.env.NINAIVU_EMAIL,
  password: process.env.NINAIVU_PASSWORD,
});
