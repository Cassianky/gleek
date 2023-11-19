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
import { useBadgeStore, useSnackbarStore } from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import AxiosConnect from "../../utils/AxiosConnect";
import BadgesTable from "./BadgesTable";

// import ReviewActivityTable from "./ReviewActivityTable";
function Badges() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { badges, getAllBadges, isLoadingBadges, updateAllBadgeRecords } =
    useBadgeStore();

  const { openSnackbar } = useSnackbarStore();

  useEffect(() => {
    const fetchData = async () => {
      await getAllBadges();
    };
    fetchData();
  }, [getAllBadges]);

  const handleCreateButtonClick = () => {
    navigate("/createBadge");
  };

  const handleUpdateAllBadgeRecords = async () => {
    const responseStatus = await AxiosConnect.post(
      "/badge/updateAllBadgeRecords",
    );
    try {
      const responseStatus = await updateAllBadgeRecords();

      if (responseStatus) {
        openSnackbar("Badge Record Update was successful!", "success");
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.msg;
      openSnackbar(errorMessage, "error");
    }
  };

  if (isLoadingBadges) {
    return <CircularProgress />;
  }
  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"Manage Badges"}
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        mb={5}
      >
        <Typography
          fontSize={25}
          fontWeight={700}
          noWrap
          component="div"
          color={theme.palette.primary.main}
        >
          Manage Badges
        </Typography>
        <Box display="flex" flexDirection="row">
          <Button
            variant="contained"
            color="light_purple"
            onClick={handleCreateButtonClick}
            style={{
              paddingLeft: 2,
              justifyContent: "center",
              paddingRight: 6,
              marginRight: 10,
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
          <Button
            variant="contained"
            color="light_purple"
            onClick={handleUpdateAllBadgeRecords}
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
              Update All Badge Records
            </Typography>
          </Button>
        </Box>
      </Box>
      {badges && <BadgesTable badges={badges} />}
    </MainBodyContainer>
  );
}

export default Badges;
