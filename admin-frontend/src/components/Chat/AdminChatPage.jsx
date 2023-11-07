import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import MainBodyContainer from "../common/MainBodyContainer";
import AdminChatList from "./AdminChatList";
import AdminChatWindow from "./AdminChatWindow";
import { useChatStore } from "../../zustand/GlobalStore";
import io from "socket.io-client";

let socket;
const uri = process.env.REACT_APP_SERVER_IP;

const AdminChatpage = () => {
  const {
    retrieveAndSetAllChatRooms,
    selectedChat,
    currentChatroomMessages,
    setSelectedChat,
    retrieveAndSetChatroomMessages,
  } = useChatStore();
  const [socketConnected, setSocketConnected] = useState(false);
  const [selectedChatCompare, setSelectedChatCompare] = useState(null);

  useEffect(() => {
    retrieveAndSetAllChatRooms();
    setSelectedChat(null);
  }, []);

  useEffect(() => {
    socket = io(uri);
    socket.emit("setup", "Admin");
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
        retrieveAndSetAllChatRooms("Admin");
      } else {
        retrieveAndSetChatroomMessages(newMessageReceived.chatRoom._id, socket);
      }
    });
  }, [currentChatroomMessages]);

  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"All Chats"}
    >
      <div style={{ width: "96%" }}>
        <Box
          sx={{
            display: "flex",
            width: 1,
            height: "40rem",
            justifyContent: "space-between",
            padding: 3,
          }}
        >
          <AdminChatList />
          <AdminChatWindow
            socket={socket}
            setSelectedChatCompare={setSelectedChatCompare}
          />
        </Box>
      </div>
    </MainBodyContainer>
  );
};

export default AdminChatpage;
