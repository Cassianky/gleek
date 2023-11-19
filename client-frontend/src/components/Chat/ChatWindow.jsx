import { useEffect, useState } from "react";
import useChatStore from "../../zustand/ChatStore";
import useGlobalStore from "../../zustand/GlobalStore";
import {
  Box,
  CircularProgress,
  Typography,
  Input,
  Button,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getSenderName } from "../../utils/ChatLogics";
import ChatDisplay from "./ChatDisplay";
import useShopStore from "../../zustand/ShopStore";
import styled from "@emotion/styled";
import { useTheme } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";

const StyledBox = styled(Box)`
  padding: 20px;
  padding-top: 6px;
  border-radius: 10px;
  border: 1px solid rgb(159, 145, 204);
  box-shadow: 3px 3px 0px 0px rgb(159, 145, 204, 40%);
`;

const ChatWindow = ({ socket }) => {
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

  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const primary = theme.palette.primary.main;
  const lightGrey = theme.palette.grey[100];

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
    // console.log(selectedChat);
    // console.log(directChatAccess);
    // console.log(directVendorChatAccess);
    if (selectedChat !== null) {
      retrieveAndSetChatroomMessages(role, selectedChat._id, socket);
    } else if (directChatAccess) {
      console.log("in direct admin");
      console.log(directChatAccess);
      setDirectChatAccess(false);
      retrieveAndAccessChatroom(role, "Admin", null, socket);
      retrieveAndSetAllChatRooms(role);
    } else if (directVendorChatAccess) {
      console.log("in direct vendor");
      console.log(directVendorChatAccess);
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
  }, [selectedChat, directChatAccess]);

  return (
    <StyledBox
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="flex-start"
      width={{ md: "68.5%" }}
      height="90vh"
      borderRadius="8px"
      border="1px solid #000"
      overflow="hidden"
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
            {getSenderName(role, selectedChat)}
          </Typography>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            padding={3}
            height="100%"
            width={{ md: "100%" }}
            borderRadius="8px"
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
                  backgroundColor: lightGrey,
                  borderRadius: "8px",
                }}
              >
                <ChatDisplay />
              </div>
            ) : (
              <Typography variant="h6">
                Start chatting with {getSenderName(role, selectedChat)}!
              </Typography>
            )}
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              width="100%"
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
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          padding={3}
          height="75%"
        >
          <Typography variant="h4" color="primary">
            Select a chat to start messaging
          </Typography>
        </Box>
      )}
    </StyledBox>
  );
};

export default ChatWindow;
