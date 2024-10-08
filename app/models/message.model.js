import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const MessageSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      default: () => uuidv4(),
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tag: { type: mongoose.Schema.Types.ObjectId, ref: "Tag" },
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

export default mongoose.model("Message", MessageSchema);
