import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const SenderSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      default: () => uuidv4(),
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      // for logging in, the sender is configured as a
      // user in the users collection
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      default: "active", // active, inactive
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model("Sender", SenderSchema);
