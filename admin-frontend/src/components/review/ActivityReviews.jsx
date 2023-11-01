import React from "react";

import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { Badge, CircularProgress, Tabs, Tab, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useActivityStore,
  useAdminSurveyResponseStore,
  useBookingStore,
  useSnackbarStore,
} from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";

import ReviewActivityTable from "./ReviewActivityTable";
function ActivityReviews() {
  const theme = useTheme();

  const { openSnackbar } = useSnackbarStore();
  const { activities, getActivity, isLoading, pendingApprovalActivities } =
    useActivityStore();

  useEffect(() => {
    const fetchData = async () => {
      await getActivity();
    };
    fetchData();
  }, [getActivity]);

  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"Manage Reviews"}
    >
      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
      >
        Manage Reviews
      </Typography>
      {activities && <ReviewActivityTable activities={activities} />}
    </MainBodyContainer>
  );
}

export default ActivityReviews;
