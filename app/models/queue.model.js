import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const QueueSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      default: () => uuidv4(),
      index: true,
    },
    messageText: {
      type: String,
      required: true,
    },
    mobileNumbers: {
      type: String, // csv of mobilenumbers
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sender",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sender",
    },
    logs: [
      {
        text: { type: String },
        timestamp: { type: Date },
      },
    ],
    status: {
      type: String,
      default: "00-created", // 00-created, 01-sent-to-sender, 03-sent-to-patient, 10-try-another-sender
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

QueueSchema.methods.addLog = async function (text) {
  this.logs.push({
    text,
    timestamp: new Date(),
  });
};

export default mongoose.model("Queue", QueueSchema);
