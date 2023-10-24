import mongoose from "mongoose";
import { Role } from "../util/roleEnum.js";

const chatMessageSchema = mongoose.Schema({
  //Only require to identify sender to determine alignment of message
  sender: { type: mongoose.Schema.Types.ObjectId },
  senderRole: {
    type: String,
    enum: Object.values(Role),
    required: true,
  },
  messageContent: { type: String, trim: true },
  //Required to identify the Chatroom which message belongs to
  chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: "Chatroom" },
  //Timestamp of sent message
  messageDate: {
    type: Date,
    required: true,
  },
});

const ChatMessageModel = mongoose.model(
  "Message",
  chatMessageSchema,
  "chat_messages",
);
export default ChatMessageModel;
