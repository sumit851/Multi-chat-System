import mongoose from "mongoose";
import { User } from "./userSchema.js";

const messageSchmea = mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Messgae = mongoose.model("Message", messageSchmea);
