import {
  Grid,
  List,
  ListItem,
  Typography,
  useTheme,
  Box,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StoreIcon from "@mui/icons-material/Store";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import PaidIcon from "@mui/icons-material/Paid";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CancelIcon from "@mui/icons-material/Cancel";
import ConfirmField from "./ConfirmField";
import CancelField from "./CancelField";
import PaidField from "./PaidField";
import InvoiceDownloadButton from "./InvoiceDownloadButton";

const BookingDetailsForm = ({ appointmentData }) => {
  const theme = useTheme();
  const vendorDisplayDetails = [
    { label: "Vendor Name", value: appointmentData?.vendorName || "-" },
    {
      label: "Contact Number",
      value: appointmentData?.vendorId?.companyPhoneNumber || "-",
    },
    {
      label: "Contact Email",
      value: appointmentData?.vendorId?.companyEmail || "-",
    },
  ];
  const clientDisplayDetails = [
    {
      label: "Company Name",
      value: appointmentData?.clientId?.companyName || "-",
    },
    { label: "Contact Name", value: appointmentData?.clientId?.name || "-" },
    {
      label: "Contact Number",
      value: appointmentData?.clientId?.phoneNumber || "-",
    },
    {
      label: "Contact Email",
      value: appointmentData?.clientId?.email || "-",
    },
    {
      label: "Billing Party Name",
      value: appointmentData?.clientId?.billingPartyName || "-",
    },
    {
      label: "Billing Email",
      value: appointmentData?.clientId?.billingEmail || "-",
    },
    {
      label: "Billing Address",
      value: appointmentData?.clientId?.billingAddress || "-",
    },
    {
      label: "Billing Postal Code",
      value: appointmentData?.clientId?.billingOfficePostalCode || "-",
    },
  ];

  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = new Date(appointmentData?.startDateTime).toLocaleDateString(
    undefined,
    options,
  );

  const eventDisplayDetails = [
    { label: "Activity", value: appointmentData?.activityTitle },
    {
      label: "Date",
      value: formattedDate,
    },
    { label: "Location", value: appointmentData?.eventLocationType },
    {
      label: "Timeslot",
      value: `${new Date(
        appointmentData?.startDateTime,
      ).toLocaleTimeString()} - ${new Date(
        appointmentData?.endDateTime,
      ).toLocaleTimeString()}`,
    },
    { label: "Total Pax", value: appointmentData?.totalPax },
    { label: "Total Cost", value: `$${appointmentData?.totalCost}` },
    { label: "Comments", value: appointmentData?.additionalComments || "-" },
  ];

  const allDetails = [
    {
      title: "Vendor Details",
      icon: <StoreIcon />,
      details: vendorDisplayDetails,
    },
    {
      title: "Client Details",
      icon: <AccountCircleIcon />,
      details: clientDisplayDetails,
    },
    {
      title: "Event Details",
      icon: <EventNoteIcon />,
      details: eventDisplayDetails,
    },
  ];

  const statusActions = {
    CONFIRMED: "Confirmed",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
    PENDING_PAYMENT: "Updated to Pending Payment",
    PAID: "Updated to Paid",
  };

  const statusIcons = {
    CONFIRMED: <ThumbUpAltIcon color="primary" />,
    REJECTED: <CancelIcon color="primary" />,
    CANCELLED: <EventBusyIcon color="primary" />,
    PENDING_PAYMENT: <PaidIcon color="primary" />,
    PAID: <EventAvailableIcon color="primary" />,
  };

  const actionHistoryDisplayDetails = {
    title: "Status Changelog",
    icon: <EventNoteIcon />,
    actionHistory: appointmentData?.actionHistory || [],
  };

  return (
    <Grid container sx={{ paddingLeft: 3 }}>
      <Grid item xs={12}>
        <Typography fontWeight={"bold"} fontSize={"2rem"} color="primary">
          Booking Details
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ paddingBottom: 2 }}>
        <Typography color="primary">
          {`Booked on ${new Date(
            appointmentData?.creationDateTime,
          ).toLocaleString()}`}
        </Typography>
      </Grid>
      {allDetails.map((category, categoryIndex) => (
        <Grid
          container
          rowSpacing={3}
          sx={{ paddingLeft: 2, paddingBottom: 2 }}
          key={categoryIndex}
        >
          <Grid item xs={12}>
            <Typography fontSize={"1.5rem"} color="primary">
              <div style={{ display: "flex", alignItems: "center" }}>
                {category.icon}
                {category.title}
              </div>
            </Typography>
          </Grid>
          {category.details.map((detail, index) => (
            <Grid container key={index} spacing={2}>
              <Grid item xs={4}>
                <Typography fontWeight="bold" color="primary" align="right">
                  {detail.label}:
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>{detail.value}</Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      ))}
      <Grid container rowSpacing={3} sx={{ paddingLeft: 2, paddingBottom: 2 }}>
        <Grid item xs={12}>
          <Typography fontSize={"1.5rem"} color="primary">
            <div style={{ display: "flex", alignItems: "center" }}>
              {actionHistoryDisplayDetails.icon}
              {actionHistoryDisplayDetails.title}
            </div>
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <List>
              {actionHistoryDisplayDetails.actionHistory.length === 0 && (
                <ListItem>
                  <ListItemText>No status changes</ListItemText>
                </ListItem>
              )}
              {actionHistoryDisplayDetails.actionHistory.map(
                (details, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {statusIcons[details.newStatus]}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <>
                          {statusActions[details.newStatus]} by{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: theme.palette.dark_purple.main,
                            }}
                          >
                            {details.actionByUserType}{" "}
                            {details.actionByUserName}
                          </span>{" "}
                          on{" "}
                          {new Date(details.actionTimestamp).toLocaleString()}
                        </>
                      }
                      secondary={
                        details.actionRemarks &&
                        "Reason: " + details.actionRemarks
                      }
                    />
                  </ListItem>
                ),
              )}
            </List>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {appointmentData?.status === "PENDING_CONFIRMATION" &&
          appointmentData.activityId.adminCreated && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Center items horizontally
                justifyContent: "center", // Center items vertically
                textAlign: "center", // Center text
                marginBottom: 3,
              }}
            >
              <Typography
                fontWeight={"bold"}
                fontSize={"1.5rem"}
                color="primary"
                sx={{ marginBottom: 2 }}
              >
                Confirm Booking?
              </Typography>
              <ConfirmField bookingData={appointmentData} />
            </Box>
          )}
        {appointmentData?.status === "CONFIRMED" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // Center items horizontally
              justifyContent: "center", // Center items vertically
              textAlign: "center", // Center text
              marginBottom: 3,
            }}
          >
            <Typography fontWeight={"bold"} fontSize={"1.5rem"} color="primary" sx={{ marginBottom: 2 }}>
              Cancel Booking?
            </Typography>
            <CancelField bookingData={appointmentData} />
          </Box>
        )}
        {appointmentData?.status === "PENDING_PAYMENT" && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // Center items horizontally
              justifyContent: "center", // Center items vertically
              textAlign: "center", // Center text
              marginBottom: 3,
            }}
          >
            <Typography fontWeight={"bold"} fontSize={"1.5rem"} color="primary" sx={{ marginBottom: 2 }}>
              Download Invoice
            </Typography>
            <InvoiceDownloadButton />
            <Typography fontWeight={"bold"} fontSize={"1.5rem"} color="primary" sx={{ margin: 2 }}>
              Update Booking Status to Paid?
            </Typography>
            <PaidField bookingData={appointmentData} />
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default BookingDetailsForm;
