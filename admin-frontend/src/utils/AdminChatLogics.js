export const getSenderName = (chatroom) => {
  return chatroom.vendor === null
    ? chatroom.client.name
    : chatroom.vendor.companyName;
};

export const getSenderNameInChatWindow = (senderRole, message) => {
  return senderRole.toUpperCase() === "CLIENT"
    ? message.client.name
    : senderRole.toUpperCase() === "VENDOR"
      ? message.vendor.companyName
      : "Admin";
};

export const isSameSender = (messages, message, idx, userRole) => {
  return (
    idx < messages.length - 1 && message.senderRole !== userRole.toUpperCase()
  );
};

export const isLastMessage = (messages, idx, userRole) => {
  return (
    idx === messages.length - 1 &&
    messages[messages.length - 1].senderRole !== userRole.toUpperCase()
  );
};

export const isSameSenderMargin = (message, idx, userRole) => {
  if (message.senderRole !== userRole.toUpperCase()) {
    return 0;
  } else {
    return "auto";
  }
};

export const isSameUser = (messages, message, idx) => {
  if (idx > 0 && messages[idx - 1].senderRole === message.senderRole) {
    return 3;
  } else {
    return 15;
  }
};
