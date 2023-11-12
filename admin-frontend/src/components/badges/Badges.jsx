import React from "react";

import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import {
  Badge,
  CircularProgress,
  Tabs,
  Tab,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  useActivityStore,
  useAdminSurveyResponseStore,
  useBookingStore,
  useSnackbarStore,
} from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

// import ReviewActivityTable from "./ReviewActivityTable";
function Badges() {
  const navigate = useNavigate();
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

  const handleCreateButtonClick = () => {
    navigate("/createBadge");
  };
  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"Manage Badges"}
    >
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography
          fontSize={25}
          fontWeight={700}
          noWrap
          component="div"
          color={theme.palette.primary.main}
        >
          Manage Badges
        </Typography>
        <Button
          variant="contained"
          color="light_purple"
          onClick={handleCreateButtonClick}
          style={{
            paddingLeft: 2,
            justifyContent: "center",
            paddingRight: 6,
          }}
        >
          <Typography
            style={{
              display: "flex",
              alignItems: "center",
            }}
            component="div"
            color="white"
            fontSize={"0.875rem"}
          >
            <AddIcon fontSize="small" />
            Create Badge
          </Typography>
        </Button>
      </Box>
      {/* {activities && <ReviewActivityTable activities={activities} />} */}
    </MainBodyContainer>
  );
}

export default Badges;