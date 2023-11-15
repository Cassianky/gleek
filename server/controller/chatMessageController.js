import ChatMessageModel from "../model/chatMessageModel.js";
import { Role } from "../util/roleEnum.js";
import ChatroomModel from "../model/chatRoomModel.js";

export const allMessages = async (req, res) => {
  try {
    const messages = await ChatMessageModel.find({
      chatRoom: req.params.chatroomId,
    })
      .populate("client", "name photo email")
      .populate("vendor", "companyName companyLogo companyEmail")
      .populate("chatRoom");
    res.status(200).json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

export const sendMessage = async (req, res) => {
  let { senderRole, content, chatroomId } = req.body;

  if (!senderRole || !content || !chatroomId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  senderRole = senderRole.toUpperCase();

  let newMessage;
  if (senderRole === Role.CLIENT) {
    newMessage = {
      senderRole: Role.CLIENT,
      client: req.user._id,
      messageContent: content,
      chatRoom: chatroomId,
      messageDate: Date.now(),
    };
  } else if (senderRole === Role.VENDOR) {
    newMessage = {
      senderRole: Role.VENDOR,
      vendor: req.user._id,
      messageContent: content,
      chatRoom: chatroomId,
      messageDate: Date.now(),
    };
  } else {
    newMessage = {
      senderRole: Role.ADMIN,
      messageContent: content,
      chatRoom: chatroomId,
      messageDate: Date.now(),
    };
  }

  try {
    let message = await ChatMessageModel.create(newMessage);
    message.populate("chatRoom");
    let updatedChatroom = await ChatroomModel.findByIdAndUpdate(
      req.body.chatroomId,
      {
        latestMessage: message,
        lastChatDate: message.messageDate,
        latestMessageRead: false,
      },
    );
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
