import React from "react";

import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { Badge, CircularProgress, Tabs, Tab, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useAdminSurveyResponseStore,
  useBookingStore,
  useSnackbarStore,
} from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import SubmittedSurveysTable from "./SubmittedSurveysTable";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey.pale_grey,
}));

function SubmittedSurveys() {
  const theme = useTheme();
  const { getSubmittedSurveys, surveys, isLoading } =
    useAdminSurveyResponseStore();
  const { openSnackbar } = useSnackbarStore();

  useEffect(() => {
    const get = async () => {
      try {
        await getSubmittedSurveys();
      } catch (err) {
        openSnackbar("Error retrieving surveys.", "error");
      }
    };

    get();
  }, []);

  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <StyledPage>
      <MainBodyContainer
        hasBackButton={false}
        breadcrumbNames={[]}
        breadcrumbLinks={[]}
        currentBreadcrumbName={"All Submitted Surveys"}
      >
        <Typography
          fontSize={25}
          fontWeight={700}
          noWrap
          component="div"
          color={theme.palette.primary.main}
        >
          Submitted Feedback Surveys
        </Typography>
        <SubmittedSurveysTable allSurveys={surveys} />
      </MainBodyContainer>
    </StyledPage>
  );
}

export default SubmittedSurveys;
