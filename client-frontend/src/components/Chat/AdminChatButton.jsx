import { useNavigate } from "react-router-dom";
import React from "react";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import useGlobalStore from "../../zustand/GlobalStore";
import useChatStore from "../../zustand/ChatStore";
import { Tooltip } from "@mui/material";

const AdminChatButton = () => {
  const navigate = useNavigate();
  const { role } = useGlobalStore();
  const { setDirectChatAccess } = useChatStore();
  const navigateToAdminChat = () => {
    setDirectChatAccess(true);
    if (role === "Client") {
      navigate("/client/chats");
    } else {
      navigate("/vendor/chats");
    }
  };

  return (
    <Tooltip title={"Chat with Admin"}>
      <HeadsetMicIcon
        sx={{
          fontSize: "3rem",
          position: "absolute",
          bottom: 24,
          right: 24,
          backgroundColor: "#9F91CC",
          borderRadius: "50%",
          padding: "10px",
        }}
        onClick={navigateToAdminChat}
      />
    </Tooltip>
  );
};
export default AdminChatButton;
