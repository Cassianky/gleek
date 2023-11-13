import React, { useState } from "react";
import { useTheme } from "@emotion/react";
import {
  useBookingStore,
  useNewsletterStore,
  useSnackbarStore,
} from "../../zustand/GlobalStore";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import FeedIcon from "@mui/icons-material/Feed";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import InfoIcon from "@mui/icons-material/Info";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Email from "@mui/icons-material/Email";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Box,
  Typography,
  FormLabel,
} from "@mui/material";
import { Form } from "react-router-dom";

const DraftNewsletterButton = ({ newsletterData }) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { openSnackbar } = useSnackbarStore();
  const { saveScheduledNewsletter, updateScheduledNewsletter } =
    useNewsletterStore();

  // const [selectedOption, setSelectedOption] = useState(
  //   newsletterData === undefined ? "CUSTOM" : newsletterData.newsletterType,
  // );
  // const [selectedDateTime, setSelectedDateTime] = useState(
  //   newsletterData === undefined
  //     ? dayjs()
  //     : dayjs(newsletterData.scheduledTime),
  // );
  // const [emailSubject, setEmailSubject] = useState(
  //   newsletterData === undefined ? "" : newsletterData.subject ?? "",
  // );
  // const [messageBody, setMessageBody] = useState(
  //   newsletterData === undefined ? "" : newsletterData.messageBody ?? "",
  // );

  const [selectedOption, setSelectedOption] = useState("CUSTOM");
  const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
  const [emailSubject, setEmailSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [image, setImage] = useState({ file: null, preview: null });
  const [scheduledTimeError, setScheduledTimeError] = useState("");

  const handleOptionChange = (event) => {
    const selectedOptionValue = event.target.value;
    setSelectedOption(selectedOptionValue);
    if (selectedOptionValue === "CUSTOM" && newsletterData === undefined) {
      setEmailSubject("");
      setMessageBody("");
    } else if (
      selectedOptionValue === "PERSONALISED" &&
      newsletterData === undefined
    ) {
      setEmailSubject(
        "Elevate Employee Wellbeing & Sustainability with Our Featured Picks!",
      );
      setMessageBody(
        "Greetings from Gleek! We're excited to share a specially curated selection of activities designed to promote employee wellness and sustainability within your organization.",
      );
    } else {
      setSelectedOption(selectedOptionValue);
      setEmailSubject(newsletterData.subject ?? "");
      setMessageBody(newsletterData.messageBody ?? "");
      setSelectedDateTime(dayjs(newsletterData.scheduledTime));
    }
  };

  const handleDateTimeChange = (dateTime) => {
    setSelectedDateTime(dayjs(dateTime));
  };

  const handleUploadImage = (e) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpeg"];
    //Can consider implementing file size limit check
    const selectedFile = e.target.files && e.target.files[0];
    if (allowedTypes.includes(selectedFile?.type)) {
      console.log("Valid file selected:", selectedFile);
      setImage({
        file: selectedFile,
        preview: URL.createObjectURL(selectedFile),
      });
    } else {
      alert("Please select a valid PNG, JPG or JPEG image.");
      e.target.value = "";
    }
  };

  const handleDialogOpen = (event) => {
    event.stopPropagation();
    if (newsletterData === undefined) {
      setSelectedOption("CUSTOM");
      setSelectedDateTime(dayjs());
      setEmailSubject("");
      setMessageBody("");
      setScheduledTimeError("");
    } else {
      setSelectedOption(newsletterData.newsletterType);
      setSelectedDateTime(dayjs(newsletterData.scheduledTime));
      setEmailSubject(newsletterData.subject ?? "");
      setMessageBody(newsletterData.messageBody ?? "");
      setImage({ file: null, preview: newsletterData.preSignedPhoto || null });
      setScheduledTimeError("");
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    // if (newsletterData === undefined) {
    setSelectedOption("CUSTOM");
    setSelectedDateTime(dayjs());
    setEmailSubject("");
    setMessageBody("");
    setScheduledTimeError("");
    setImage({ file: null, preview: null });
    setDialogOpen(false);
  };

  const handleConfirm = async () => {
    try {
      if (!selectedDateTime.isValid()) {
        setScheduledTimeError("Invalid selection! Please select a valid time.");
        return;
      }
      setScheduledTimeError("");

      const formData = new FormData();
      formData.append("newsletterType", selectedOption);
      formData.append("scheduledTime", selectedDateTime);
      formData.append("subject", emailSubject);
      formData.append("messageBody", messageBody);
      formData.append("image", image.file);

      console.log(formData);
      const message =
        newsletterData === undefined
          ? await saveScheduledNewsletter(formData)
          : await updateScheduledNewsletter(newsletterData.id, formData);
      openSnackbar(message);
      handleDialogClose();
    } catch (error) {
      openSnackbar(error.message, "error");
    }
  };

  return (
    <div>
      {newsletterData === undefined ? (
        <Button
          variant="contained"
          color="light_purple"
          onClick={handleDialogOpen}
        >
          <Typography
            style={{
              display: "flex",
            }}
            color="white"
          >
            <Email style={{ marginRight: "5px" }} />
            Schedule
          </Typography>
        </Button>
      ) : (
        <Button color="primary" onClick={handleDialogOpen}>
          <EditNoteIcon />
        </Button>
      )}

      <Dialog fullWidth open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle
          style={{
            display: "flex",
            alignItems: "center",
            color: theme.palette.primary.main,
          }}
        >
          <ScheduleSendIcon color="primary" style={{ marginRight: "8px" }} />
          Schedule Newsletter
        </DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center">
            <FeedIcon color="unselected" style={{ marginRight: "5px" }} />
            <FormLabel>Newsletter Type</FormLabel>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <RadioGroup
              value={selectedOption}
              onChange={handleOptionChange}
              row
            >
              <FormControlLabel
                value="CUSTOM"
                control={<Radio color="primary" />}
                label="Custom Newsletter"
              />
              <FormControlLabel
                value="PERSONALISED"
                control={<Radio color="primary" />}
                label="Personalised Recommendations"
              />
            </RadioGroup>
            <Box display="flex" flexDirection="row">
              <InfoIcon
                fontSize="small"
                color="primary"
                style={{ marginRight: "10px" }}
              />
              {selectedOption === "CUSTOM" && (
                <Typography fontSize={"0.875rem"} color="primary">
                  This option allows you to create your own newsletter to be
                  sent out to subcribers of the xxx mailing list.
                </Typography>
              )}
              {selectedOption === "PERSONALISED" && (
                <Typography fontSize={"0.875rem"} color="primary">
                  This option allows you to send out newsletters to subscribers
                  of the xxx mailing list with a curated list of activities
                  based on client preferences.
                </Typography>
              )}
            </Box>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              style={{ paddingTop: "30px" }}
            >
              <DateTimePicker
                label="Scheduled Time"
                value={selectedDateTime}
                onChange={handleDateTimeChange}
                format="YYYY/MM/DD hh:mm a"
                minDate={dayjs()}
              />
              {scheduledTimeError && (
                <Typography variant="caption" color="error">
                  {scheduledTimeError}
                </Typography>
              )}
            </Box>
          </LocalizationProvider>
          <TextField
            margin="dense"
            id="emailSubject"
            label="Email Subject"
            required
            fullWidth
            variant="standard"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />
          <TextField
            margin="dense"
            id="messageBody"
            label="Message Body"
            required
            fullWidth
            multiline
            rows={4}
            variant="standard"
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
          />
          <Box
            style={{ marginTop: "20px" }}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"flex-start"}
          >
            <Box display="flex" alignItems="center">
              <AddPhotoAlternateIcon
                color="unselected"
                style={{ marginRight: "5px" }}
              />
              <FormLabel>Newsletter Image</FormLabel>
            </Box>
            {image.preview && (
              <Box
                component="img"
                sx={{
                  mt: 2,
                  height: "auto",
                  width: "100%",
                }}
                alt="Image Preview"
                src={image.preview}
              />
            )}
            <Button
              style={{ marginTop: "20px" }}
              component="label"
              variant="contained"
              color="primary"
              startIcon={<FileUploadIcon />}
              onChange={handleUploadImage}
            >
              Image
              <input type="file" hidden />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Back
          </Button>
          <Button
            onClick={async () => await handleConfirm()}
            color="primary"
            disabled={!emailSubject.trim() || !messageBody.trim()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DraftNewsletterButton;
