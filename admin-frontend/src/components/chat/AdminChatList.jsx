import { Box, Stack, Typography } from "@mui/material";
import { useChatStore } from "../../zustand/GlobalStore";
import AdminChatLoading from "./AdminChatLoading";
import { getSenderName } from "../../utils/AdminChatLogics";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import styled from "@emotion/styled";

const AdminChatList = ({ socket }) => {
  const {
    loading,
    allChatrooms,
    selectedChat,
    setSelectedChat,
    setChatroomMarkAsRead,
  } = useChatStore();
  const [selectedChatroomId, setSelectedChatroomId] = useState(null);

  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const primary = theme.palette.primary.main;

  const onSelectChatroom = (chatroom) => {
    console.log("selectedChatroom", chatroom);
    if (
      chatroom.latestMessage !== undefined &&
      chatroom.latestMessage.senderRole !== "ADMIN" &&
      chatroom.latestMessageRead === false
    ) {
      setChatroomMarkAsRead(chatroom._id);
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
      padding={2}
      bgcolor="white"
      width={{ md: "30%" }}
      height="75vh"
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
          <AdminChatLoading />
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
                      chatroom.latestMessage.senderRole !== "ADMIN" &&
                      chatroom.latestMessageRead === false
                    ? "#CDCBCB"
                    : "#E8E8E8"
                }
                color={selectedChatroomId === chatroom._id ? "white" : "black"}
                key={chatroom._id}
              >
                <Typography variant="h6">{getSenderName(chatroom)}</Typography>
                {chatroom.latestMessage && (
                  <div>
                    <Typography variant="body1">
                      {chatroom.latestMessage.senderRole === "VENDOR"
                        ? chatroom.vendor.companyName
                        : chatroom.latestMessage.senderRole === "CLIENT"
                        ? chatroom.client.name
                        : "Admin"}
                      {": "}
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
          "No chats currently."
        )}
      </Box>
    </StyledBox>
  );
};

export default AdminChatList;
