import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import MainBodyContainer from "../common/MainBodyContainer";
import AdminChatList from "./AdminChatList";
import AdminChatWindow from "./AdminChatWindow";
import { useChatStore } from "../../zustand/GlobalStore";

const AdminChatpage = () => {
  const { retrieveAndSetAllChatRooms } = useChatStore();

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
