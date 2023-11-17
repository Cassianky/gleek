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
  unreadChatroomCount: 0,
  setUser: (currentUser) => {
    set({ user: currentUser });
  },
  setSelectedChat: (chatSelected, socket) => {
    if (chatSelected !== null) {
      socket.emit("join chat", chatSelected._id);
    }
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
          response.data,
        );
        socket.emit("new message", response.data);
        AxiosConnect.getWithParams(chatroompath + "/fetchChats", params).then(
          (response) => {
            console.log("after send message set chat list");
            set({ allChatrooms: response.data });
            AxiosConnect.get(
              chatMessagepath + `/allMessages/${chatroomId}`,
            ).then((response) => {
              console.log("after send message set chat window");
              set({ currentChatroomMessages: response.data });
            });
          },
        );
      },
    );
  },
  setChatroomMarkAsRead: (chatroomId, role) => {
    console.log("in marking chatroom as read");
    const params = {
      userRole: role,
    };
    AxiosConnect.getWithParams(
      role === "Client"
        ? `/chatroom/client/markChatroomAsRead/${chatroomId}`
        : `/chatroom/vendor/markChatroomAsRead/${chatroomId}`,
      params,
    ).then((response) => {
      console.log(response.data);
      set({ allChatrooms: response.data });
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
    )
      .then((response) => {
        const allChatroom = response.data;
        set({ allChatrooms: allChatroom });
        let unreadChatroomCount = 0;
        allChatroom.map((chatroom) => {
          if (
            chatroom.latestMessage !== undefined &&
            chatroom.latestMessage.senderRole !== role.toUpperCase() &&
            chatroom.latestMessageRead === false
          ) {
            unreadChatroomCount++;
          }
        });
        set({ unreadChatroomCount: unreadChatroomCount });
      })
      .catch((error) => {
        console.log("error in retrieveAndSetAllChatRooms: ", error);
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
      params,
    )
      .then((response) => {
        console.log(response);
        set({ selectedChat: response.data });
        socket.emit("join chat", response.data._id);
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
    AxiosConnect.get(
      role === "Client"
        ? `/chatMessage/client/allMessages/${chatroomId}`
        : `/chatMessage/vendor/allMessages/${chatroomId}`,
    ).then((response) => {
      set({ currentChatroomMessages: response.data });
    });
  },
}));

export default useChatStore;
