import {
  Box,
  Tab,
  Chip,
  Tabs,
  Typography,
  Badge,
  Divider,
  Grid,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useBookingStore from "../../../zustand/BookingStore";
import useMediaQuery from "@mui/material/useMediaQuery";
import { lighten, useTheme } from "@mui/material/styles";
import notFound from "../../../assets/not_found.png";
import VendorProfileItem from "../../../components/Vendor/VendorProfileItem";
import { Link } from "react-router-dom";

const BookingsDetails = () => {
  const { bookingId } = useParams();
  const theme = useTheme();
  const { getBookingForClient, currentBooking } = useBookingStore();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  let color = "default"; // Default color

  let containerStyle = {
    height: "10rem",
    width: "10rem",
    objectFit: "cover",
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
  };

  if (
    currentBooking?.status === "PENDING_CONFIRMATION" ||
    currentBooking?.status === "PENDING_PAYMENT"
  ) {
    color = "warning";
  } else if (
    currentBooking?.status === "REJECTED" ||
    currentBooking?.status === "CANCELLED"
  ) {
    color = "error";
  } else if (
    currentBooking?.status === "CONFIRMED" ||
    currentBooking?.status === "PAID"
  ) {
    color = "success";
  }

  useEffect(() => {
    getBookingForClient(bookingId);
  }, [bookingId]);

  const isMediumScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const activityPath = `/shop/activity/${currentBooking?.activityId._id}`;

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="80%"
      bgcolor={"grey.50"}
      margin="20px auto"
      boxShadow={1}
      p={5}
    >
      <Typography color="secondary" variant="h4" mb={2}>
        Booking Overview
      </Typography>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={12}
          md={10 / 3}
          lg={10 / 3}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="subtitle1">
            BOOKING ID: {currentBooking?._id}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={1}
          lg={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {!isMediumScreen && (
            <Box height="35px">
              <Divider orientation="vertical" />
            </Box>
          )}
          {isMediumScreen && (
            <Box width="100%">
              <Divider orientation="horizontal" />
            </Box>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={10 / 3}
          lg={10 / 3}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="subtitle1">
            Order placed on{" "}
            {new Date(currentBooking?.creationDateTime).toLocaleTimeString()}
            {", "}
            {new Date(currentBooking?.creationDateTime).toLocaleDateString()}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={1}
          lg={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {!isMediumScreen && (
            <Box height="35px">
              <Divider orientation="vertical" />
            </Box>
          )}
          {isMediumScreen && (
            <Box width="100%">
              <Divider orientation="horizontal" />
            </Box>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={10 / 3}
          lg={10 / 3}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Chip
            label={currentBooking?.status.replace(/_/g, " ")}
            color={color}
          />
        </Grid>
      </Grid>
      <Typography color="secondary" variant="h5" mb={2} mt={4}>
        Billing information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box
            boxShadow={2}
            borderRadius={2}
            width="100%"
            bgcolor="white"
            p={3}
          >
            <Grid container xs={12} sm={12} md={12} lg={12}>
              <Grid item xs={6} sm={6} md={3} lg={3}>
                <Typography color={primary} variant="subtitle1">
                  Billing Party Name
                </Typography>
                <Typography variant="subtitle1">
                  {currentBooking?.billingPartyName}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6} md={3} lg={3}>
                <Typography color={primary} variant="subtitle1">
                  Billing Email
                </Typography>
                <Typography variant="subtitle1">
                  {currentBooking?.billingEmail}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6} md={3} lg={3}>
                <Typography color={primary} variant="subtitle1">
                  Billing Postal Code
                </Typography>
                <Typography variant="subtitle1">
                  {currentBooking?.billingOfficePostalCode}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6} md={3} lg={3}>
                <Typography color={primary} variant="subtitle1">
                  Billing Postal Code
                </Typography>
                <Typography variant="subtitle1">
                  {currentBooking?.billingOfficePostalCode}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Typography color="secondary" variant="h5" mt={4}>
        Booking Details
      </Typography>
      <Box mt={2}>
        {currentBooking?.vendorId && (
          <VendorProfileItem vendor={currentBooking?.vendorId} />
        )}
      </Box>
      <Box
        mt={2}
        boxShadow={2}
        borderRadius={2}
        width="100%"
        bgcolor="white"
        p={3}
      >
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Box display="flex" flexDirection="row">
            {currentBooking?.activityId?.preSignedImages &&
              currentBooking?.activityId?.preSignedImages?.length > 0 && (
                <img
                  src={currentBooking.activityId.preSignedImages[0]}
                  alt={currentBooking?.activityTitle}
                  style={containerStyle}
                />
              )}
            {!currentBooking?.activityId?.preSignedImages?.length > 0 && (
              <img
                src={notFound}
                alt={currentBooking?.activityTitle}
                style={containerStyle}
              />
            )}
            <Box display="flex" flexDirection="column" ml={5}>
              <Link
                to={activityPath}
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                  margin: 0,
                }}
              >
                <Typography color={secondary} fontWeight="700" variant="h6">
                  {currentBooking?.activityTitle}
                </Typography>
              </Link>
              <Typography color={secondary} variant="subtitle1">
                <b>Date: </b>
                {new Date(currentBooking?.startDateTime).toLocaleDateString()}
              </Typography>
              <Typography color={secondary} variant="subtitle1">
                <b>Start Time: </b>
                {new Date(currentBooking?.startDateTime).toLocaleTimeString()}
              </Typography>
              <Typography color={secondary} variant="subtitle1">
                <b>End Time: </b>
                {new Date(currentBooking?.endDateTime).toLocaleTimeString()}
              </Typography>
              <Typography color={secondary} variant="subtitle1">
                <b>Event Location Type: </b>
                {currentBooking?.eventLocationType}
              </Typography>
              {currentBooking?.additionalComments && (
                <Typography color={secondary} variant="subtitle1">
                  <b>Comments: </b>
                  {currentBooking?.additionalComments}
                </Typography>
              )}
            </Box>
          </Box>
          <Box>
            <Typography color={secondary} variant="h6">
              Adult: {currentBooking?.totalPax} pax
            </Typography>
          </Box>
        </Box>
        <Box mb={2} mt={2}>
          <Divider />
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography color={secondary} variant="subtitle1">
            Base Price
          </Typography>
          <Typography color={secondary} variant="subtitle1">
            S$ {currentBooking?.basePricePerPax?.toFixed(2)} x{" "}
            {currentBooking?.totalPax} Pax
          </Typography>
        </Box>
        {currentBooking?.weekendAddOnCost !== 0 && (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography color={secondary} variant="subtitle1">
              Weekend Discounts/Add-ons
            </Typography>
            <Typography color={secondary} variant="subtitle1">
              S$ {currentBooking?.weekendAddOnCost?.toFixed(2)}
            </Typography>
          </Box>
        )}
        {currentBooking?.onlineAddOnCost !== 0 && (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography color={secondary} variant="subtitle1">
              Online Discounts/Add-ons
            </Typography>
            <Typography color={secondary} variant="subtitle1">
              S$ {currentBooking?.onlineAddOnCost?.toFixed(2)}
            </Typography>
          </Box>
        )}
        {currentBooking?.offlineAddOnCost !== 0 && (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography color={secondary} variant="subtitle1">
              Offline Discounts/Add-ons
            </Typography>
            <Typography color={secondary} variant="subtitle1">
              S$ {currentBooking?.offlineAddOnCost?.toFixed(2)}
            </Typography>
          </Box>
        )}
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography color={secondary} variant="h6" fontWeight="700">
            Total
          </Typography>
          <Typography color={secondary} variant="h6" fontWeight="700">
            S$ {currentBooking?.totalCost?.toFixed(2)}
          </Typography>
        </Box>
      </Box>
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button
          mt={4}
          variant="contained"
          color="secondary"
          style={{ color: "white" }}
        >
          View Booking Summary
        </Button>
        <Box ml={1}>
          <Button variant="contained">Rate</Button>
        </Box>
      </Box>
    </Box>
  );
};
export default BookingsDetails;