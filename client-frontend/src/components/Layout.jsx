import React from "react";
import NavBar from "./NavBar";
import { Alert, Box, Snackbar, SpeedDial } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Footer from "./Footer";
import useSnackbarStore from "../zustand/SnackbarStore";
import useClientStore from "../zustand/ClientStore";
import useVendorStore from "../zustand/VendorStore";
import AdminChatButton from "./Chat/AdminChatButton";

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
  const { authenticated } = useClientStore();
  const { vendorAuthenticated } = useVendorStore();
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
    </Box>
  );
};

export default Layout;
