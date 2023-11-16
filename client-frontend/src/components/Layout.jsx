import React, { useState } from "react";
import NavBar from "./NavBar";
import {
  Alert,
  Box,
  Snackbar,
  SpeedDial,
  Tooltip,
  Typography,
  Avatar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Footer from "./Footer";
import useSnackbarStore from "../zustand/SnackbarStore";
import useClientStore from "../zustand/ClientStore";
import useVendorStore from "../zustand/VendorStore";
import AdminChatButton from "./Chat/AdminChatButton";
import { Chatbot, createChatBotMessage } from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import "./Layout.css";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MessageParser from "./ChatBot/MessageParser";
import ActionProvider from "./ChatBot/ActionProvider";
import Options from "./ChatBot/Options";
import { config } from "chai";

const CustomSnackbar = () => {
  const { isOpen, message, type, closeSnackbar } = useSnackbarStore();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    closeSnackbar();
  };

  return (
    <>
      {isOpen && (
        <Snackbar open={isOpen} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

const Layout = ({ children }) => {
  const theme = useTheme();
  const backgroundColor = theme.palette.backgroundColor.main;
  const { authenticated, client } = useClientStore();
  const { vendorAuthenticated } = useVendorStore();
  const [showBot, setShowBot] = useState(false);

  const options = {
    0: [
      "1a) About Gleek",
      "1b) My Account Settings",
      "1c) Checkout Process",
      "1d) Loyalty Program",
      "1e) Shopping for Activities",
    ],
  };

  const toggleBot = () => {
    setShowBot(!showBot);
  };

  const config = {
    initialMessages: [
      createChatBotMessage(`Hello ${client?.name}, welcome to Gleek!`),
      createChatBotMessage(
        `Good Day! How may I help you? You may want to know more about:`,
        {
          widget: "options0",
          delay: 1500,
        }
      ),
      createChatBotMessage(
        `Type option (e.g., 1a). Else type 'help' to be redirected to chat with an Admin.`,
        {
          delay: 3500,
        }
      ),
    ],
    customStyles: {
      // Overrides the chatbot message styles
      botMessageBox: {
        backgroundColor: "#9F91CC",
      },
      // Overrides the chat button styles
      chatButton: {
        backgroundColor: "#9F91CC",
      },
    },
    state: {
      step: 0,
      client: client,
    },
    widgets: [
      {
        widgetName: "options0",
        widgetFunc: (props) => <Options {...props} />,
        props: { options: options["0"] },
      },
    ],
    customComponents: {
      // Replaces the default header
      header: () => (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          sx={{
            backgroundColor: "#9F91CC",
            padding: "5px",
            borderRadius: "3px",
          }}
        >
          <IconButton onClick={toggleBot}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" color="white">
            Gleek Bot
          </Typography>
        </Box>
      ),
      userAvatar: () => {
        return client ? (
          <Avatar ml={1} alt={client?.name} src={client?.preSignedPhoto} />
        ) : (
          <Avatar ml={1} alt="Empty Avatar" />
        );
      },
    },
  };
  return (
    <Box bgcolor={backgroundColor} flexDirection="column" display="flex">
      <CustomSnackbar />
      <NavBar />
      <Box
        flex={1}
        display="flex"
        flexDirection="row"
        justifyContent="space-evenly"
        alignItems="stretch"
        minHeight="100vh"
      >
        <Box flex={1}>{children}</Box>
      </Box>
      <Footer />
      {authenticated || vendorAuthenticated ? <AdminChatButton /> : <></>}
      {authenticated && showBot && (
        <Chatbot
          config={config}
          actionProvider={ActionProvider}
          messageParser={MessageParser}
        />
      )}
      {authenticated && (
        <Tooltip title={"Chat with Bot"}>
          <SmartToyIcon
            sx={{
              fontSize: "3rem",
              position: "absolute",
              bottom: 24,
              right: 24,
              backgroundColor: "#9F91CC",
              color: "white",
              borderRadius: "50%",
              padding: "10px",
              cursor: "pointer",
            }}
            onClick={toggleBot}
          />
        </Tooltip>
      )}
    </Box>
  );
};

export default Layout;
