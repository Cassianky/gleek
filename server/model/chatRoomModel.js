import mongoose from "mongoose";
import { Role } from "../util/roleEnum.js";

//Assumption that all admin share the same chat
//Admin sent/received message will not have sender/recipient ID
//Role will be used as differentiator
const chatroomSchema = mongoose.Schema({
  // chatName: { type: String, trim: true },
  //Not compulsory due to admin requirement
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
  admin: {
    type: Boolean,
    default: false,
  },
  //To display as part of the list of chatted user
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  //Timestamp to sort the order of chat rooms
  lastChatDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const ChatroomModel = mongoose.model("Chatroom", chatroomSchema, "chatrooms");

export default ChatroomModel;
