import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const TagSchema = new mongoose.Schema(
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
    backgroundColor: {
      type: String,
      default: "#ff0000",
    },
    textColor: {
      type: String,
      default: "#ffffff",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model("Tag", TagSchema);
