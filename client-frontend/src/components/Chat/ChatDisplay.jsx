import ScrollableFeed from "react-scrollable-feed";
import {
  getSenderName,
  getSenderNameInChatWindow,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../utils/ChatLogics";
import { Avatar, CircularProgress, Tooltip } from "@mui/material";
import useChatStore from "../../zustand/ChatStore";
import useGlobalStore from "../../zustand/GlobalStore";
import { useEffect } from "react";

const ChatDisplay = () => {
  const { currentChatroomMessages, user } = useChatStore();
  const { role } = useGlobalStore();

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <ScrollableFeed>
      {currentChatroomMessages &&
        currentChatroomMessages.map((message, idx) => (
          <div
            style={{
              display: "flex",
              padding: "5px",
              alignItems: "center",
            }}
            key={message._id}
          >
            {(isSameSender(currentChatroomMessages, message, idx, role) ||
              isLastMessage(currentChatroomMessages, idx, role)) && (
              <Tooltip placement="left-end" style={{ marginRight: "5px" }}>
                <Avatar sx={{ width: 40, height: 40 }}>
                  {getSenderNameInChatWindow(message.senderRole, message)
                    .charAt(0)
                    .toUpperCase()}
                </Avatar>
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor:
                  message.senderRole === role.toUpperCase()
                    ? "#BEE3F8"
                    : "#B9F5D0",
                marginLeft: isSameSenderMargin(message, idx, role),
                marginTop: isSameUser(currentChatroomMessages, message, idx),
                borderRadius: "20px",
                padding: "5px 15px",
              }}
            >
              {message.messageContent}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ChatDisplay;
