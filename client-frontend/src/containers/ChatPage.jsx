import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ChatList from "../components/Chat/ChatList";
import ChatWindow from "../components/Chat/ChatWindow";
import useChatStore from "../zustand/ChatStore";
import useGlobalStore from "../zustand/GlobalStore";
import useClientStore from "../zustand/ClientStore";
import useVendorStore from "../zustand/VendorStore";

const Chatpage = () => {
  const { retrieveAndSetAllChatRooms } = useChatStore();
  const { role } = useGlobalStore();

  useEffect(() => {
    retrieveAndSetAllChatRooms(role);
  }, []);

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
        <ChatWindow />
      </Box>
    </div>
  );
};

export default Chatpage;
