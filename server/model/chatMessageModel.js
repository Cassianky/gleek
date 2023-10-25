import mongoose from "mongoose";
import { Role } from "../util/roleEnum.js";

const chatMessageSchema = mongoose.Schema({
  //Only require to identify sender to determine alignment of message
  senderRole: {
    type: String,
    enum: Object.values(Role),
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    default: null,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    default: null,
  },
  messageContent: { type: String, trim: true },
  //Required to identify the Chatroom which message belongs to
  chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: "Chatroom" },
  //Timestamp of sent message
  messageDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const ChatMessageModel = mongoose.model(
  "Message",
  chatMessageSchema,
  "chatMessages",
);
export default ChatMessageModel;
