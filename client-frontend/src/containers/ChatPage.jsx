import { useEffect, useState } from "react";
import { Box } from "@mui/material";
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
  const [selectedChatCompare, setSelectedChatCompare] = useState(null);
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
      console.log("in message received", newMessageReceived);
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageReceived.chatRoom._id
      ) {
        retrieveAndSetAllChatRooms(role);
      } else {
        retrieveAndSetChatroomMessages(role, selectedChat._id, socket);
      }
    });
  }, [currentChatroomMessages]);

  return (
    <div style={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          width: 1,
          height: "50rem",
          justifyContent: "space-between",
          padding: 3,
        }}
      >
        <ChatList />
        <ChatWindow
          socket={socket}
          setSelectedChatCompare={setSelectedChatCompare}
        />
      </Box>
    </div>
  );
};

export default Chatpage;
