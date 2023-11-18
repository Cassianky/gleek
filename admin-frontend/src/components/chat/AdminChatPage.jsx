import { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
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
  const [newMsgReceived, setNewMsgReceived] = useState({});

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
      console.log("in message received: ", newMessageReceived);
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
        retrieveAndSetAllChatRooms("Admin");
      } else if (selectedChat._id === newMsgReceived.chatRoom._id) {
        console.log("same chat");
        retrieveAndSetChatroomMessages(newMsgReceived.chatRoom._id);
      }
    } catch (error) {
      console.log(error);
    }
  }, [newMsgReceived]);

  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"All Chats"}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            width: 1,
            height: "40rem",
            justifyContent: "space-between",
            padding: 3,
          }}
        >
          <AdminChatList socket={socket} />
          <AdminChatWindow socket={socket} />
        </Box>
      </Container>
    </MainBodyContainer>
  );
};

export default AdminChatpage;
