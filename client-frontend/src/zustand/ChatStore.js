import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";
import useGlobalStore from "./GlobalStore";

const useChatStore = create((set) => ({
  user: {},
  allChatrooms: [],
  currentChatroomMessages: [],
  selectedChat: null,
  loadingMessage: false,
  directChatAccess: false,
  directVendorChatAccess: false,
  setUser: (currentUser) => {
    set({ user: currentUser });
  },
  setSelectedChat: (chatSelected) => {
    set({ selectedChat: chatSelected });
  },
  setDirectChatAccess: (boolean) => {
    set({ directChatAccess: boolean });
  },
  setDirectVendorChatAccess: (boolean) => {
    set({ directVendorChatAccess: boolean });
  },
  sendMessage: (messageContent, role, chatroomId, socket) => {
    const params = {
      senderRole: role,
      content: messageContent,
      chatroomId: chatroomId,
    };
    const chatMessagepath =
      role === "Client" ? "/chatMessage/client" : "/chatMessage/vendor";
    const chatroompath =
      role === "Client" ? "/chatroom/client" : "/chatroom/vendor";
    AxiosConnect.post(chatMessagepath + "/sendMessage", params).then(
      (response) => {
        console.log(
          "after send message received data of message: ",
          response.data
        );
        socket.emit("new message", response.data);
        AxiosConnect.getWithParams(chatroompath + "/fetchChats", params).then(
          (response) => {
            console.log("after send message set chat list");
            set({ allChatrooms: response.data });
            AxiosConnect.get(
              chatMessagepath + `/allMessages/${chatroomId}`
            ).then((response) => {
              console.log("after send message set chat window");
              set({ currentChatroomMessages: response.data });
            });
          }
        );
      }
    );
  },
  retrieveAndSetAllChatRooms: (role) => {
    const params = {
      userRole: role,
    };
    AxiosConnect.getWithParams(
      role === "Client"
        ? "/chatroom/client/fetchChats"
        : "/chatroom/vendor/fetchChats",
      params
    ).then((response) => {
      console.log(response.data);
      set({ allChatrooms: response.data });
    });
  },
  retrieveAndAccessChatroom: (role, recipientRole, recipientId, socket) => {
    const params = {
      userRole: role,
      recipientRole: recipientRole,
      recipientId: recipientId,
    };
    console.log("access chat params:", params);
    AxiosConnect.post(
      role === "Client"
        ? "/chatroom/client/accessChat"
        : "/chatroom/vendor/accessChat",
      params
    )
      .then((response) => {
        console.log(response);
        set({ selectedChat: response.data });
        socket.emit("join chat", response.data._id);
        AxiosConnect.get(
          role === "Client"
            ? `/chatMessage/client/allMessages/${response.data._id}`
            : `/chatMessage/vendor/allMessages/${response.data._id}`
        ).then((response) => {
          console.log(response.data);
          set({ currentChatroomMessages: response.data });
          set({ loadingMessage: false });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
  retrieveAndSetChatroomMessages: (role, chatroomId, socket) => {
    AxiosConnect.get(
      role === "Client"
        ? `/chatMessage/client/allMessages/${chatroomId}`
        : `/chatMessage/vendor/allMessages/${chatroomId}`
    ).then((response) => {
      console.log(response.data);
      set({ currentChatroomMessages: response.data });
      socket.emit("join chat", chatroomId);
    });
  },
}));

export default useChatStore;
