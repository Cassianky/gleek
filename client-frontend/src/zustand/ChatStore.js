import { create } from "zustand";
import AxiosConnect from "../utils/AxiosConnect";
import useGlobalStore from "./GlobalStore";
import { getRecipientId, getRecipientRole } from "../utils/ChatLogics";

const useChatStore = create((set) => ({
  user: {},
  allChatrooms: [],
  currentChatroomMessages: [],
  selectedChat: null,
  loadingMessage: false,
  setUser: (currentUser) => {
    set({ user: currentUser });
  },
  setSelectedChat: (chatSelected) => {
    set({ selectedChat: chatSelected });
  },
  sendMessage: (messageContent, role, chatroomId) => {
    const params = {
      senderRole: role,
      content: messageContent,
      chatroomId: chatroomId,
    };
    AxiosConnect.post(
      role === "Client"
        ? "/chatMessage/client/sendMessage"
        : "/chatMessage/vendor/sendMessage",
      params,
    ).then((response) => {
      console.log("sent message::", response.data);
    });
  },
  retrieveAndSetAllChatRooms: (role) => {
    const params = {
      userRole: role,
    };
    AxiosConnect.getWithParams(
      role === "Client"
        ? "/chatroom/client/fetchChats"
        : "/chatroom/vendor/fetchChats",
      params,
    ).then((response) => {
      console.log(response.data);
      set({ allChatrooms: response.data });
    });
  },
  retrieveAndAccessChatroom: (role, recipientRole, recipientId) => {
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
      params,
    )
      .then((response) => {
        console.log(response);
        set({ selectedChat: response.data });
        AxiosConnect.get(
          role === "Client"
            ? `/chatMessage/client/allMessages/${response.data._id}`
            : `/chatMessage/vendor/allMessages/${response.data._id}`,
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
  retrieveAndSetChatroomMessages: (role, chatroomId) => {
    set({ loadingMessage: true });
    AxiosConnect.get(
      role === "Client"
        ? `/chatMessage/client/allMessages/${chatroomId}`
        : `/chatMessage/vendor/allMessages/${chatroomId}`,
    ).then((response) => {
      console.log(response.data);
      set({ currentChatroomMessages: response.data });
      set({ loadingMessage: false });
    });
  },
}));

export default useChatStore;
