import { Box, Stack, Typography } from "@mui/material";
import { useChatStore } from "../../zustand/GlobalStore";
import AdminChatLoading from "./AdminChatLoading";
import { getSenderName } from "../../utils/AdminChatLogics";
import dayjs from "dayjs";

const AdminChatList = () => {
  const { allChatrooms, selectedChat, setSelectedChat } = useChatStore();

  const onSelectChatroom = (chatroom) => {
    console.log(chatroom);
    chatroom === selectedChat
      ? setSelectedChat(null)
      : setSelectedChat(chatroom);
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      padding={2}
      bgcolor="white"
      width={{ md: "26.5%" }}
      height="75vh"
      borderRadius="8px"
      border="1px solid #000"
    >
      <Box
        paddingBottom={1}
        paddingLeft={3}
        fontSize={{ xs: "28px", md: "30px" }}
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h4">My Chats</Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        padding={3}
        bgcolor="#F8F8F8"
        width={{ md: "90%" }}
        height="100vh"
        overflow="scroll"
        borderRadius="8px"
      >
        {allChatrooms.length > 0 ? (
          <Stack spacing={2} width={{ md: "100%" }} height={{ md: "100%" }}>
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
                  selectedChat === chatroom ? "#38B2AC" : "#E8E8E8"
                }
                color={selectedChat === chatroom ? "white" : "black"}
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
          <AdminChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default AdminChatList;
