import React, { useState } from "react";
import { useTheme } from "@emotion/react";
import {
  useBookingStore,
  useNewsletterStore,
  useSnackbarStore,
} from "../../zustand/GlobalStore";
import EditNoteIcon from "@mui/icons-material/EditNote";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
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

const DraftNewsletterButton = ({ newsletterData }) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { openSnackbar } = useSnackbarStore();
  const { saveScheduledNewsletter, updateScheduledNewsletter } =
    useNewsletterStore();

  const [selectedOption, setSelectedOption] = useState(
    newsletterData === undefined ? "CUSTOM" : newsletterData.newsletterType,
  );
  const [selectedDateTime, setSelectedDateTime] = useState(
    newsletterData === undefined
      ? dayjs()
      : dayjs(newsletterData.scheduledTime),
  );
  const [emailSubject, setEmailSubject] = useState(
    newsletterData === undefined ? "" : newsletterData.subject ?? "",
  );
  const [messageBody, setMessageBody] = useState(
    newsletterData === undefined ? "" : newsletterData.messageBody ?? "",
  );

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

  const handleDialogOpen = (event) => {
    event.stopPropagation();
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    if (newsletterData === undefined) {
      setSelectedOption("CUSTOM");
      setSelectedDateTime(dayjs()); // Assuming dayjs() is the default value
      setEmailSubject("");
      setMessageBody("");
      setScheduledTimeError("");
    } else {
      setSelectedOption(newsletterData.newsletterType);
      setSelectedDateTime(dayjs(newsletterData.scheduledTime));
      setEmailSubject(newsletterData.subject ?? "");
      setMessageBody(newsletterData.messageBody ?? "");
      setScheduledTimeError("");
    }
    setDialogOpen(false);
  };

  const handleConfirm = async () => {
    try {
      if (!selectedDateTime.isValid()) {
        setScheduledTimeError("Invalid selection! Please select a valid time.");
        return;
      }
      setScheduledTimeError("");
      const message =
        newsletterData === undefined
          ? await saveScheduledNewsletter({
              newsletterType: selectedOption,
              scheduledTime: selectedDateTime,
              subject: emailSubject,
              messageBody: messageBody,
            })
          : await updateScheduledNewsletter(newsletterData.id, {
              newsletterType: selectedOption,
              scheduledTime: selectedDateTime,
              subject: emailSubject,
              messageBody: messageBody,
            });
      openSnackbar(message);
      handleDialogClose();
    } catch (error) {
      openSnackbar(error.message, "error");
    }
  };

  // const confirmationDisplayDetails = [
  //   { label: "Client Company", value: newsletterData.clientId.companyName },
  //   { label: "Vendor", value: newsletterData.vendorName },
  //   { label: "Activity", value: newsletterData.activityTitle },
  //   {
  //     label: "Date",
  //     value: new Date(newsletterData.startDateTime).toLocaleDateString(),
  //   },
  //   {
  //     label: "Timeslot",
  //     value: `${new Date(
  //       newsletterData.startDateTime,
  //     ).toLocaleTimeString()} - ${new Date(
  //       newsletterData.endDateTime,
  //     ).toLocaleTimeString()}`,
  //   },
  //   { label: "Total Cost", value: `$${newsletterData.totalCost}` },
  // ];

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
          <FormLabel>Newsletter Type</FormLabel>
          <RadioGroup
            value={selectedOption}
            onChange={handleOptionChange}
            row
            style={{ paddingBottom: "16px" }}
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
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
