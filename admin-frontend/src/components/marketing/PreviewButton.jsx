import React, { useState } from "react";
import { useTheme } from "@emotion/react";
import {
  useBookingStore,
  useNewsletterStore,
  useSnackbarStore,
} from "../../zustand/GlobalStore";
import PreviewIcon from "@mui/icons-material/Preview";
import Email from "@mui/icons-material/Email";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

const PreviewButton = ({ newsletterData }) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { openSnackbar } = useSnackbarStore();
  const { getNewsletterPreview } = useNewsletterStore();
  const [htmlContent, setHtmlContent] = useState("");

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
    setDialogOpen(false);
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
