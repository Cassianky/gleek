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

  useEffect(() => {
    retrieveAndSetAllChatRooms();
  }, []);

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
          <AdminChatWindow />
        </Box>
      </div>
    </MainBodyContainer>
  );
};

export default AdminChatpage;
