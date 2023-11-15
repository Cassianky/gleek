import ChatroomModel from "../model/chatRoomModel.js";
import { Role } from "../util/roleEnum.js";
import ChatRoomModel from "../model/chatRoomModel.js";

//Fetch all chats for a user
//route: GET /api/chat/
export const userFetchChats = async (req, res) => {
  let userRole = req.cookies.userRole;
  userRole = userRole.toUpperCase();

  try {
    ChatroomModel.find(
      userRole === Role.CLIENT
        ? { client: req.user._id }
        : { vendor: req.user._id },
    )
      .populate("latestMessage")
      .populate("client", "-password")
      .populate("vendor", "-password")
      .sort({ lastChatDate: -1 })
      .then(async (results) => {
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

//Fetch all chats for an admin
//route: GET /api/chat/
export const adminFetchChats = async (req, res) => {
  try {
    ChatroomModel.find({ admin: true })
      .populate("client", "-password")
      .populate("vendor", "-password")
      .populate("latestMessage")
      .sort({ lastChatDate: -1 })
      .then(async (results) => {
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

//Create or fetch chat for a user
//route: POST /api/chat/
//Client -> Admin; Vendor -> Admin; Client -> Vendor; Vendor -> Client
export const userAccessChat = async (req, res) => {
  console.log("user accessChat all request body::", req.body);

  //User is initiator of chat
  let { userRole, recipientId, recipientRole } = req.body;
  userRole = userRole.toUpperCase();
  recipientRole = recipientRole.toUpperCase();

  if (!recipientId && recipientRole != Role.ADMIN) {
    console.log("recipientID param not sent with request");
    return res.sendStatus(400);
  }

  let isChat;

  if (userRole === Role.CLIENT) {
    console.log("in user access chat user role is client");
    if (recipientRole === Role.VENDOR) {
      console.log("in user access chat recipient role is vendor");
      isChat = await ChatroomModel.find({
        $and: [
          //initiator of chat - current user who is logged in
          { client: req.user._id },
          //recipient of chat
          { vendor: recipientId },
        ],
      })
        .populate("client", "-password")
        .populate("vendor", "-password")
        .populate("latestMessage");
    } else {
      console.log("in user access chat recipient role is admin");
      isChat = await ChatroomModel.find({
        $and: [
          { client: req.user._id },
          //recipient of chat
          { admin: true },
        ],
      })
        .populate("client", "-password")
        .populate("latestMessage");
    }
  } else {
    console.log("in user access chat user role is vendor");
    if (recipientRole === Role.CLIENT) {
      console.log("in user access chat recipient role is client");
      isChat = await ChatroomModel.find({
        $and: [
          //initiator of chat - current user who is logged in
          { vendor: req.user._id },
          //recipient of chat
          { client: recipientId },
        ],
      })
        .populate("client", "-password")
        .populate("vendor", "-password")
        .populate("latestMessage");
    } else {
      console.log("in user access chat recipient role is admin");
      isChat = await ChatroomModel.find({
        $and: [
          { vendor: req.user._id },
          //recipient of chat
          { admin: true },
        ],
      })
        .populate("vendor", "-password")
        .populate("latestMessage");
    }
  }

  if (isChat.length > 0) {
    console.log("chat room already exists", isChat);
    res.send(isChat[0]);
  } else {
    let chatroomData;
    console.log("is new chat");
    if (userRole === Role.CLIENT) {
      if (recipientRole === Role.VENDOR) {
        chatroomData = {
          client: req.user._id,
          vendor: recipientId,
        };
      } else {
        chatroomData = {
          client: req.user._id,
          admin: true,
        };
      }
    } else {
      if (recipientRole === Role.CLIENT) {
        chatroomData = {
          vendor: req.user._id,
          client: recipientId,
        };
      } else {
        chatroomData = {
          vendor: req.user._id,
          admin: true,
        };
      }
    }
    try {
      const createdChat = await ChatroomModel.create(chatroomData);
      const fullChat = await ChatroomModel.findOne({ _id: createdChat._id })
        .populate("client", "-password")
        .populate("vendor", "-password");
      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

//Create or fetch chat for an admin
//route: POST /api/chat/
export const adminAccessChat = async (req, res) => {
  //User is initiator of chat
  let { recipientId, recipientRole } = req.body;
  recipientRole = recipientRole.toUpperCase();

  if (!recipientId) {
    console.log("recipientID param not sent with request");
    return res.sendStatus(400);
  }

  let isChat;

  if (recipientRole === Role.CLIENT) {
    console.log("in admin access chat recipient role is client");
    isChat = await ChatroomModel.find({
      $and: [
        { admin: true },
        //recipient of chat
        { client: recipientId },
      ],
    })
      .populate("client", "-password")
      .populate("latestMessage");
  } else {
    console.log("in admin access chat user role is vendor");
    isChat = await ChatroomModel.find({
      $and: [
        { admin: true },
        //recipient of chat
        { vendor: recipientId },
      ],
    })
      .populate("vendor", "-password")
      .populate("latestMessage");
  }

  if (isChat.length > 0) {
    console.log("chat room already exists", isChat);
    res.send(isChat[0]);
  } else {
    let chatroomData;
    console.log("is new chat");
    if (recipientRole === Role.CLIENT) {
      chatroomData = {
        admin: true,
        client: recipientId,
      };
    } else {
      chatroomData = {
        admin: true,
        vendor: recipientId,
      };
    }
    try {
      const createdChat = await ChatroomModel.create(chatroomData);
      const fullChat = await ChatroomModel.findOne({ _id: createdChat._id })
        .populate("client", "-password")
        .populate("vendor", "-password");
      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

export const markSelectedChatAsRead = async (req, res) => {
  let userRole = req.cookies.userRole;
  userRole = userRole.toUpperCase();

  console.log(userRole);
  console.log(req.params.id);
  console.log(req.user._id);

  try {
    const updatedChatroom = await ChatroomModel.findByIdAndUpdate(
      { _id: req.params.id },
      { latestMessageRead: true },
    );

    const updatedChatrooms = await ChatroomModel.find(
      userRole === Role.CLIENT
        ? { client: req.user._id }
        : { vendor: req.user._id },
    )
      .populate("latestMessage")
      .populate("client", "-password")
      .populate("vendor", "-password")
      .sort({ lastChatDate: -1 });

    res.status(200).send(updatedChatrooms);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
