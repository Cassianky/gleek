import { useEffect, useState } from "react";
import useChatStore from "../../zustand/ChatStore";
import useGlobalStore from "../../zustand/GlobalStore";
import { Box, CircularProgress, Typography, Input } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getSenderName } from "../../utils/ChatLogics";
import ChatDisplay from "./ChatDisplay";
import useShopStore from "../../zustand/ShopStore";

const ChatWindow = ({ socket, setSelectedChatCompare }) => {
  const {
    selectedChat,
    directChatAccess,
    setDirectChatAccess,
    directVendorChatAccess,
    setDirectVendorChatAccess,
    setSelectedChat,
    retrieveAndAccessChatroom,
    retrieveAndSetAllChatRooms,
    retrieveAndSetChatroomMessages,
    loadingMessage,
    currentChatroomMessages,
    sendMessage,
  } = useChatStore();
  const { role } = useGlobalStore();
  const { currentActivity } = useShopStore();
  const [inputMessage, setInputMessage] = useState("");

  const handleMessageInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      sendMessage(inputMessage, role, selectedChat._id, socket);
      setInputMessage("");
    }
  };

  const handlePressEnter = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const fetchMessages = () => {
    console.log(selectedChat);
    if (selectedChat !== null) {
      retrieveAndSetChatroomMessages(role, selectedChat._id, socket);
    } else if (directChatAccess) {
      console.log("in direct admin");
      setDirectChatAccess(false);
      retrieveAndAccessChatroom(role, "Admin", null, socket);
      retrieveAndSetAllChatRooms(role);
    } else if (directVendorChatAccess) {
      console.log("in direct vendor");
      setDirectVendorChatAccess(false);
      if (currentActivity.adminCreated === undefined) {
        retrieveAndAccessChatroom(
          role,
          "Vendor",
          currentActivity.linkedVendor._id,
          socket,
        );
      } else {
        retrieveAndAccessChatroom(role, "Admin", null, socket);
      }
      retrieveAndSetAllChatRooms(role);
    } else {
      retrieveAndSetAllChatRooms(role);
    }
  };

  useEffect(() => {
    fetchMessages();
    setSelectedChatCompare(selectedChat);
  }, [selectedChat, directChatAccess]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="'flex-start'"
      padding={2}
      bgcolor="white"
      width={{ md: "68.5%" }}
      height="100vh"
      borderRadius="8px"
      border="1px solid #000"
      overflow="hidden"
    >
      {selectedChat ? (
        <>
          <Typography variant="h4">
            <ArrowBackIcon
              onClick={() => setSelectedChat(null)}
              sx={{
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            />
            {getSenderName(role, selectedChat)}
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            padding={3}
            bgcolor="#E8E8E8"
            width={{ md: "100%" }}
            borderRadius="8px"
            marginTop={1}
          >
            {loadingMessage ? (
              <CircularProgress />
            ) : currentChatroomMessages.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  scrollbarWidth: "none",
                  width: "100%",
                  height: "75vh",
                }}
              >
                <ChatDisplay />
              </div>
            ) : (
              <Typography variant="h6">
                Start chatting with {getSenderName(role, selectedChat)}!
              </Typography>
            )}
            <Input
              style={{
                marginTop: "5px",
                border: "1px outset grey",
                borderRadius: "8px",
                padding: "2px",
              }}
              fullWidth
              placeholder="Enter your message here..."
              value={inputMessage}
              onChange={handleMessageInputChange}
              onKeyUp={handlePressEnter}
            />
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          padding={3}
          height="75%"
        >
          <Typography variant="h4">
            Click on a user to start chatting
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatWindow;
