import { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import ChatList from "../components/Chat/ChatList";
import ChatWindow from "../components/Chat/ChatWindow";
import useChatStore from "../zustand/ChatStore";
import useGlobalStore from "../zustand/GlobalStore";
import useClientStore from "../zustand/ClientStore";
import useVendorStore from "../zustand/VendorStore";
import io from "socket.io-client";

let socket;
const uri = process.env.REACT_APP_SERVER_IP;

const Chatpage = () => {
  const {
    retrieveAndSetAllChatRooms,
    selectedChat,
    currentChatroomMessages,
    setSelectedChat,
    retrieveAndSetChatroomMessages,
  } = useChatStore();
  const { role } = useGlobalStore();
  const [socketConnected, setSocketConnected] = useState(false);
  const [newMsgReceived, setNewMsgReceived] = useState({});

  const userId =
    role === "Client"
      ? useClientStore.getState().client._id
      : useVendorStore.getState().vendor._id;

  useEffect(() => {
    retrieveAndSetAllChatRooms(role);
    setSelectedChat(null);
  }, []);

  useEffect(() => {
    const uniqueUser = role.toString().toUpperCase() + userId.toString();
    socket = io(uri);
    socket.emit("setup", uniqueUser);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      console.log("in message received");
      setNewMsgReceived(newMessageReceived);
    });
  }, []);

  useEffect(() => {
    try {
      if (
        selectedChat === undefined ||
        selectedChat === null ||
        selectedChat._id !== newMsgReceived.chatRoom._id
      ) {
        console.log("different chat");
        retrieveAndSetAllChatRooms(role);
      } else if (selectedChat._id === newMsgReceived.chatRoom._id) {
        console.log("same chat");
        retrieveAndSetChatroomMessages(role, newMsgReceived.chatRoom._id);
      }
    } catch (error) {
      console.log(error);
    }
  }, [newMsgReceived]);

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          width: 1,
          minHeight: "60rem",
          justifyContent: "space-between",
          paddingX: 8,
          paddingTop: 8,
        }}
      >
        <ChatList socket={socket} />
        <ChatWindow socket={socket} />
      </Box>
    </Container>
  );
};

export default Chatpage;
