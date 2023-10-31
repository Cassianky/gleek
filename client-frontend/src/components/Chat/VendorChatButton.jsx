import { IconButton, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useGlobalStore from "../../zustand/GlobalStore";
import useChatStore from "../../zustand/ChatStore";
import useShopStore from "../../zustand/ShopStore";
import React from "react";

const VendorChatButton = () => {
  const navigate = useNavigate();
  const { role } = useGlobalStore();
  const { retrieveAndAccessChatroom } = useChatStore();
  const { currentActivity } = useShopStore();

  const theme = useTheme();
  const accent = theme.palette.accent.main;

  const navigateToChat = () => {
    if (currentActivity.adminCreated === undefined) {
      retrieveAndAccessChatroom(
        role,
        "Vendor",
        currentActivity.linkedVendor._id,
      );
    } else {
      retrieveAndAccessChatroom(role, "Admin", null);
    }
    navigate("/client/chats");
  };

  return (
    <Button
      onClick={navigateToChat}
      sx={{
        border: 1,
        marginRight: "10px",
      }}
    >
      <Typography color={accent} variant="body1">
        Chat with Vendor
      </Typography>
    </Button>
  );
};

export default VendorChatButton;
