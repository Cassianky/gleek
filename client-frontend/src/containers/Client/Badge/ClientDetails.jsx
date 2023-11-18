import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSnackbarStore from "../../../zustand/SnackbarStore";
import useBadgeStore from "../../../zustand/BadgeStore";
import { convertISOtoShortDate } from "../../../utils/TimeFormatter";
import { useTheme, lighten } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import overallBadge from "../../../assets/overall_badge.gif";

const ClientDetails = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const { openSnackbar } = useSnackbarStore();
  const {
    getClientProfile,
    isLoadingClientProfile,
    clientProfile,
    clientProfileBadges,
  } = useBadgeStore();

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === "light" ? tertiary : "#308fe8",
    },
  }));

  let containerStyleCompleted = {
    height: "12rem", // Default for extra-large screens
    maxWidth: "100%",
    objectFit: "cover",
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
  };

  const tertiary = theme.palette.tertiary.main;
  const accent = theme.palette.accent.main;
  const primary = theme.palette.primary.main;

  const completedBadgesCount = clientProfileBadges.filter(
    (badge) => badge.isCompleted
  ).length;
  const totalBadgesCount = clientProfileBadges.length;

  const completionPercentage = totalBadgesCount
    ? Math.min((completedBadgesCount / totalBadgesCount) * 100, 100)
    : 0;

  useEffect(() => {
    const getClient = async () => {
      try {
        const response = await getClientProfile(id);
      } catch (err) {
        console.error(err);
        openSnackbar("This client does not exist.", "error");
      }
    };

    getClient();
  }, []);

  let badgesCompleted = {
    height: "300px",
  };

  let badgesUncompleted = {
    height: "300px",
    filter: "grayscale(100%)",
  };

  if (!clientProfile)
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="left"
        p={5}
        width={"100%"}
      >
        <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
      </Box>
    );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      p={5}
      width={"100%"}
    >
      <Grid
        container
        spacing={{ xs: 2, md: 2 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        justifyContent="center"
        width={"100%"}
        sx={{ p: 5 }}
      >
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Stack direction="row" justifyContent="center" alignItems="center">
              <Avatar
                sx={{
                  bgcolor: primary,
                  width: 100,
                  height: 100,
                  fontSize: "80px",
                }}
                src={clientProfile?.preSignedPhoto || ""}
              >
                {clientProfile?.preSignedPhoto
                  ? null
                  : clientProfile.companyName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="h4"
                color={theme.palette.primary.dark}
                marginLeft={2}
              >
                {clientProfile.companyName}
              </Typography>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main}>
            Company Name
          </Typography>
          <Typography>{clientProfile.companyName}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color={theme.palette.primary.main}>
            Company Signed Up Date
          </Typography>
          <Typography>
            {convertISOtoShortDate(clientProfile.signupDate)}
          </Typography>
        </Grid>
      </Grid>
      <Divider variant="middle" />
      <Typography color="secondary" variant="h5" alignSelf="flex-start" mt={2}>
        Overall Badges Progress
      </Typography>
      <Box
        display="flex"
        flexDirection="row"
        mt={5}
        mb={5}
        alignItems="center"
        justifyContent="flex-start"
      >
        <img
          src={overallBadge}
          alt="overall badge GIF"
          style={
            completionPercentage === 100 ? badgesCompleted : badgesUncompleted
          } // Adjust height and margin as needed
        />
        <Box width="60%" mt={2}>
          <Chip
            sx={{ marginBottom: 3 }}
            label={completionPercentage === 100 ? "COMPLETED" : "NOT COMPLETED"}
            color={completionPercentage === 100 ? "success" : "error"}
          />
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography variant="subtitle1">
              {completionPercentage.toFixed(2)}%
            </Typography>
            <Typography variant="subtitle1">
              {" "}
              {completedBadgesCount} / {totalBadgesCount}
            </Typography>
          </Box>
          <BorderLinearProgress
            variant="determinate"
            value={completionPercentage}
          />
        </Box>
      </Box>
      <Typography variant="h5" color={theme.palette.primary.dark} mt={2}>
        Badges Completed
      </Typography>
      <Grid
        container
        spacing={{ xs: 2, md: 3, lg: 3, xl: 3 }}
        columns={{ xs: 4, sm: 6, md: 10, lg: 12, xl: 16 }}
      >
        {clientProfileBadges
          .filter((badge) => badge.isCompleted === true)
          .map((badge) => (
            <Grid item key={badge._id} xs={2} sm={2} md={2} lg={2} xl={2}>
              {/* Apply styling to the image */}
              {badge?.badge.badgePreSignedImage && (
                <img
                  src={badge.badge.badgePreSignedImage}
                  alt={badge.badge.name}
                  style={containerStyleCompleted}
                />
              )}
              <Typography
                color={accent}
                variant="body1"
                sx={{
                  maxWidth: "300px",
                  marginTop: "15px",
                }}
              >
                {badge.isCompleted ? "Completed" : "Updated"} on{" "}
                {convertISOtoShortDate(badge.updated)}
              </Typography>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default ClientDetails;
