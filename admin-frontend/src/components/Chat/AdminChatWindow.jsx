import { useEffect, useState } from "react";
import { useChatStore } from "../../zustand/GlobalStore";
import { Box, CircularProgress, Typography, Input } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getSenderName } from "../../utils/AdminChatLogics";
import AdminChatDisplay from "./AdminChatDisplay";

const AdminChatWindow = ({ socket, setSelectedChatCompare }) => {
  const {
    selectedChat,
    setSelectedChat,
    retrieveAndSetAllChatRooms,
    retrieveAndSetChatroomMessages,
    loadingMessage,
    currentChatroomMessages,
    sendMessage,
  } = useChatStore();
  const [inputMessage, setInputMessage] = useState("");

  const handleMessageInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      sendMessage(inputMessage, selectedChat._id, socket);
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
      retrieveAndSetChatroomMessages(selectedChat._id, socket);
    } else {
      retrieveAndSetAllChatRooms();
    }
  };

  useEffect(() => {
    fetchMessages();
    setSelectedChatCompare(selectedChat);
  }, [selectedChat]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="'flex-start'"
      padding={2}
      bgcolor="white"
      width={{ md: "68.5%" }}
      height="75vh"
      borderRadius="8px"
      border="1px solid #000"
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
            {getSenderName(selectedChat)}
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            padding={3}
            bgcolor="#E8E8E8"
            width={{ md: "95%" }}
            borderRadius="8px"
            marginTop={1}
            height="65vh"
            overflow="hidden"
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
                  height: "63vh",
                }}
              >
                <AdminChatDisplay />
              </div>
            ) : (
              <Typography variant="h6">
                Start chatting with {getSenderName(selectedChat)}!
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
        // to get socket.io on same page
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

export default AdminChatWindow;
