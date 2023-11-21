import { Box, Stack, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import useChatStore from "../../zustand/ChatStore";
import ChatLoading from "./ChatLoading";
import { getSenderName } from "../../utils/ChatLogics";
import useGlobalStore from "../../zustand/GlobalStore";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";
import styled from "@emotion/styled";

const ChatList = ({ socket }) => {
  const {
    loading,
    allChatrooms,
    selectedChat,
    setSelectedChat,
    setChatroomMarkAsRead,
  } = useChatStore();
  const { role } = useGlobalStore();
  const [selectedChatroomId, setSelectedChatroomId] = useState(null);

  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const primary = theme.palette.primary.main;

  const onSelectChatroom = (chatroom) => {
    console.log("selectedChatroom", chatroom);
    if (
      chatroom.latestMessage !== undefined &&
      chatroom.latestMessage.senderRole !== role.toUpperCase() &&
      chatroom.latestMessageRead === false
    ) {
      setChatroomMarkAsRead(chatroom._id, role);
    }

    if (selectedChat === null || chatroom._id !== selectedChat._id) {
      setSelectedChat(chatroom, socket);
      setSelectedChatroomId(chatroom._id);
    } else {
      setSelectedChat(null);
      setSelectedChatroomId(null);
    }
  };

  useEffect(() => {
    selectedChat === null
      ? setSelectedChatroomId(null)
      : setSelectedChatroomId(selectedChat._id);
  }, [selectedChat, selectedChatroomId]);

  const StyledBox = styled(Box)`
    padding: 10px;
    padding-top: 6px;
    border-radius: 10px;
    border: 1px solid rgb(159, 145, 204);
    box-shadow: 3px 3px 0px 0px rgb(159, 145, 204, 40%);
  `;

  return (
    <StyledBox
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      bgcolor="white"
      width={{ md: "30.5%" }}
      height="90vh"
    >
      <Box
        display="flex"
        flexDirection="column"
        padding={3}
        width={{ md: "100%" }}
        height="100%"
        overflowY="scroll"
        borderRadius="8px"
      >
        {loading ? (
          <ChatLoading />
        ) : allChatrooms.length > 0 ? (
          <Stack
            spacing={2}
            padding={1}
            width={{ md: "100%" }}
            height={{ md: "100%" }}
            style={{ maxHeight: "100%", overflow: "auto" }}
          >
            {allChatrooms.map((chatroom) => (
              <Box
                onClick={() => onSelectChatroom(chatroom)}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                  borderRadius: 1,
                  px: 3,
                  py: 2,
                }}
                backgroundColor={
                  selectedChatroomId === chatroom._id
                    ? primary
                    : chatroom.latestMessage !== undefined &&
                      chatroom.latestMessage.senderRole !==
                        role.toUpperCase() &&
                      chatroom.latestMessageRead === false
                    ? "#CDCBCB"
                    : "#E8E8E8"
                }
                color={selectedChatroomId === chatroom.id ? "white" : "black"}
                key={chatroom._id}
              >
                <Typography variant="h6">
                  {getSenderName(role, chatroom)}
                </Typography>
                {chatroom.latestMessage && (
                  <div>
                    <Typography variant="body1">
                      <b>
                        {chatroom.latestMessage.senderRole === "VENDOR"
                          ? chatroom.vendor.companyName
                          : chatroom.latestMessage.senderRole === "CLIENT"
                          ? chatroom.client.name
                          : "Admin"}
                        {": "}
                      </b>
                      {chatroom.latestMessage.messageContent.length > 50
                        ? chatroom.latestMessage.messageContent.substring(
                            0,
                            51,
                          ) + "..."
                        : chatroom.latestMessage.messageContent}
                    </Typography>
                    <Typography variant="caption">
                      {chatroom.latestMessage &&
                        dayjs(chatroom.latestMessage.messageDate).format(
                          "DD-MMM-YY | HH:mm",
                        )}
                    </Typography>
                  </div>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          "Select a vendor or admin to start chatting."
        )}
      </Box>
    </StyledBox>
  );
};

export default ChatList;
