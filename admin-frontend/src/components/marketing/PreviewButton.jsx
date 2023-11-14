import React, { useState } from "react";
import { useTheme } from "@emotion/react";
import {
  useBookingStore,
  useNewsletterStore,
  useSnackbarStore,
} from "../../zustand/GlobalStore";
import PreviewIcon from "@mui/icons-material/Preview";
import Email from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";


import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
} from "@mui/material";

const PreviewButton = ({ newsletterData }) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { openSnackbar } = useSnackbarStore();
  const { getNewsletterPreview, testSendNewsletter } = useNewsletterStore();
  const [htmlContent, setHtmlContent] = useState("");
  const [email, setEmail] = useState('');

  const handleDialogOpen = async (event) => {
    event.stopPropagation();
    try {
      // console.log("message?", newsletterData.messageBody);
      // console.log("photo?", newsletterData.preSignedPhoto);
      const preview = await getNewsletterPreview(
        newsletterData.messageBody,
        newsletterData.preSignedPhoto,
        newsletterData.newsletterType,
      );
      // console.log(preview);
      setHtmlContent(preview);
      setDialogOpen(true);
      // console.log("dialog set to Open");
    } catch (error) {
      console.log(error);
      openSnackbar({
        message: error.message,
        type: "error",
      });
    }
  };

  const handleDialogClose = () => {
    setEmail('');
    setDialogOpen(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = async () => {
    // Add logic to handle sending email with the entered email address
    try {
      console.log('Sending email to:', email);
      setEmail(email.trim());
      const message = await testSendNewsletter(newsletterData, email);
      setEmail('');
      openSnackbar(message);
    } catch (error) {
      console.log(error);
      openSnackbar(error.message, "error");
    }
    
  };

  return (
    <div>
      <Button color="primary" onClick={handleDialogOpen}>
        <PreviewIcon />
      </Button>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle
          style={{
            display: "flex",
            alignItems: "center",
            color: theme.palette.primary.main,
          }}
        >
          <Email color="primary" style={{ marginRight: "8px" }} />
          Preview Newsletter
        </DialogTitle>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-evenly"
            alignItems="center"
            marginTop={4}
          >
            <TextField
              label="Email Address"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              sx={{ width: "60%" }}
            />
            <Button variant="contained" color="primary" onClick={handleSendEmail} startIcon={<SendIcon/>}>
              Send
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PreviewButton;
