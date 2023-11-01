import React, { useEffect } from "react";
import styled from "@emotion/styled";
import { Box, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import useBookingStore from "../../../zustand/BookingStore";
import PendingSurveysTable from "./PendingSurveysTable";
import MainBodyContainer from "../../../components/Common/MainBodyContainer";

const StyledPaper = styled(Paper)`
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgb(159, 145, 204);
  box-shadow: 3px 3px 0px 0px rgb(159, 145, 204, 40%);
`;

function PendingSurveys() {
  const { bookings, getBookingsWithPendingSurvey, isLoading } =
    useBookingStore();

  useEffect(() => {
    const get = async () => {
      await getBookingsWithPendingSurvey();
    };

    get();
  }, []);

  return (
    <MainBodyContainer
      hasBackButton={true}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={`Pending Surveys`}
    >
      <Typography color="secondary" variant="h3">
        Pending Post-Event Surveys
      </Typography>
      {isLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : bookings && bookings.length > 0 ? (
        <PendingSurveysTable allBookings={bookings} />
      ) : (
        <StyledPaper>
          <Typography variant="h5" color="primary">
            No surveys open
          </Typography>
          <Typography variant="body1">
            You have no pending surveys at the moment.
          </Typography>
        </StyledPaper>
      )}
    </MainBodyContainer>
  );
}

export default PendingSurveys;
