import React from "react";

import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import {
  Badge,
  CircularProgress,
  Tabs,
  Tab,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  useAdminSurveyResponseStore,
  useBookingStore,
  useSnackbarStore,
} from "../../zustand/GlobalStore";
import InfoIcon from "@mui/icons-material/Info";
import MainBodyContainer from "../common/MainBodyContainer";
import SurveyDetails from "./SurveyDetails";
import { useParams } from "react-router-dom";

const convertISOtoDate = (value) => {
  const date = new Date(value);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-SG", options);
  return formattedDate;
};
function SubmittedSurvey() {
  const theme = useTheme();
  const { surveyId } = useParams();
  const { survey, getSurveyDetails, isLoading } = useAdminSurveyResponseStore();
  const { openSnackbar } = useSnackbarStore();

  useEffect(() => {
    const get = async () => {
      try {
        await getSurveyDetails(surveyId);
      } catch (err) {
        openSnackbar("Error retrieving survey.", "error");
      }
    };
    get();
  }, []);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <MainBodyContainer
      hasBackButton={true}
      breadcrumbNames={["All Submitted Surveys"]}
      breadcrumbLinks={["/surveys"]}
      currentBreadcrumbName={"View Submitted Survey"}
    >
      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
      >
        Survey Response for {survey?.activity.title} by{" "}
        {survey?.booking.clientId.name}
      </Typography>

      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
      />
      <Typography
        noWrap
        variant="h6"
        fontSize={18}
        color={theme.palette.primary.main}
      >
        Event Date: {convertISOtoDate(survey?.booking.endDateTime)}
      </Typography>
      <Typography
        noWrap
        variant="h6"
        fontSize={18}
        color={theme.palette.primary.main}
      >
        Response Date: {convertISOtoDate(survey?.created)}
      </Typography>

      <Box my={3}>
        <Divider />
      </Box>

      {survey && <SurveyDetails surveyData={survey} />}
    </MainBodyContainer>
  );
}

export default SubmittedSurvey;
