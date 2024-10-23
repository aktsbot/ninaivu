import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const PatientSchema = new mongoose.Schema(
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
    patientId: {
      type: String,
      default: "",
    },
    mobileNumbers: [
      {
        type: String,
        required: true,
      },
    ],
    mobileNumberOperator: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
    },
    messagesEvery: [
      {
        type: String, // sunday, monday, tuesday, wednesday, thursday, friday, saturday
        required: true,
      },
    ],
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

export default mongoose.model("Patient", PatientSchema);
