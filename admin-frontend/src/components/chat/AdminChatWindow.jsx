import { useEffect, useState } from "react";
import { useChatStore } from "../../zustand/GlobalStore";
import { Box, CircularProgress, Typography, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getSenderName } from "../../utils/AdminChatLogics";
import AdminChatDisplay from "./AdminChatDisplay";
import { useTheme } from "@mui/material/styles";
import styled from "@emotion/styled";
import SendIcon from "@mui/icons-material/Send";

const StyledBox = styled(Box)`
  padding: 20px;
  padding-top: 6px;
  border-radius: 10px;
  border: 1px solid rgb(159, 145, 204);
  box-shadow: 3px 3px 0px 0px rgb(159, 145, 204, 40%);
`;

const AdminChatWindow = ({ socket }) => {
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

  const theme = useTheme();
  const pale_grey = theme.palette.grey.pale_grey;

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
  }, [selectedChat]);

  return (
    <StyledBox
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="'flex-start'"
      padding={2}
      bgcolor="white"
      width={{ md: "68.5%" }}
      height="75vh"
    >
      {selectedChat ? (
        <Box height="100%" width="100%">
          <Typography
            variant="h6"
            color="primary"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              paddingTop: 8,
            }}
          >
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
                  overflowY: "auto",
                  width: "100%",
                  flex: 1,
                  backgroundColor: pale_grey,
                  borderRadius: "8px",
                }}
              >
                <AdminChatDisplay />
              </div>
            ) : (
              <Typography variant="h6">
                Start chatting with {getSenderName(selectedChat)}!
              </Typography>
            )}
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              width="100%"
              paddingX={3}
            >
              <TextField
                style={{
                  marginTop: "5px",
                  borderRadius: "8px",
                  padding: "4px",
                  marginRight: "8px",
                }}
                fullWidth
                placeholder="Enter your message here..."
                value={inputMessage}
                onChange={handleMessageInputChange}
                onKeyUp={handlePressEnter}
              />

              <SendIcon
                onClick={handleSendMessage}
                color="primary"
                style={{
                  cursor: "pointer",
                }}
              />
            </Box>
          </Box>
        </Box>
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
    </StyledBox>
  );
};

export default AdminChatWindow;
