import {
  Box,
  Typography,
  useMediaQuery,
  Rating,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import React from "react";
import { useTheme, lighten } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import congrats from "../assets/congrats.gif";
import partyPopper from "../assets/party_popper.gif";
import {
  convertISOtoShortDate,
  convertISOtoTime,
} from "../utils/TimeFormatter";

const BadgeCardItem = ({ badge }) => {
  const theme = useTheme();
  const accent = theme.palette.accent.main;
  const primary = theme.palette.accent.primary;
  const tertiary = theme.palette.tertiary.main;
  const tertiaryLighter = lighten(theme.palette.tertiary.main, 0.4);

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === "light" ? primary : "#308fe8",
    },
  }));

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md")
  );
  const isLargeScreen = useMediaQuery((theme) =>
    theme.breakpoints.between("md", "lg")
  );
  let containerStyleUncompleted = {
    height: "15rem", // Default for extra-large screens
    maxWidth: "100%",
    objectFit: "cover",
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
    filter: "grayscale(100%)",
  };
  let containerStyleCompleted = {
    height: "15rem", // Default for extra-large screens
    maxWidth: "100%",
    objectFit: "cover",
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
  };

  if (isLargeScreen) {
    containerStyleUncompleted = {
      height: "15rem", // Customize for large screens
      maxWidth: "100%",
      objectFit: "cover",
      borderTopLeftRadius: "4px",
      borderTopRightRadius: "4px",
      filter: "grayscale(100%)",
    };
    containerStyleCompleted = {
      height: "15rem", // Customize for large screens
      maxWidth: "100%",
      objectFit: "cover",
      borderTopLeftRadius: "4px",
      borderTopRightRadius: "4px",
    };
  }

  if (isMediumScreen) {
    containerStyleUncompleted = {
      height: "12rem", // Customize for medium screens
      maxWidth: "100%",
      objectFit: "cover",
      borderTopLeftRadius: "4px",
      borderTopRightRadius: "4px",
      filter: "grayscale(100%)",
    };
    containerStyleCompleted = {
      height: "12rem", // Customize for medium screens
      maxWidth: "100%",
      objectFit: "cover",
      borderTopLeftRadius: "4px",
      borderTopRightRadius: "4px",
    };
  }

  if (isSmallScreen) {
    containerStyleUncompleted = {
      height: "20rem", // Customize for small screens
      maxWidth: "100%",
      objectFit: "cover",
      borderTopLeftRadius: "4px",
      borderTopRightRadius: "4px",
      filter: "grayscale(100%)",
    };
    containerStyleCompleted = {
      height: "20rem", // Customize for small screens
      maxWidth: "100%",
      objectFit: "cover",
      borderTopLeftRadius: "4px",
      borderTopRightRadius: "4px",
    };
  }

  const percentageCompleted =
    badge.bookingCount || badge.sdgCount
      ? Math.min(
          badge.bookingCount
            ? (badge.bookingCount / badge.badge.bookingThreshold) * 100
            : (badge.sdgCount / badge.badge.sdgThreshold) * 100,
          100
        )
      : 0;

  const countCompleted =
    badge.bookingCount || badge.sdgCount
      ? Math.min(
          badge.bookingCount || badge.sdgCount,
          badge.bookingCount
            ? badge.badge.bookingThreshold
            : badge.badge.sdgThreshold
        )
      : 0;
  return (
    <Paper
      display="flex"
      bgcolor={"grey.50"}
      sx={{ height: "100%", overflow: "hidden" }}
    >
      <Box
        display="flex"
        justifyContent="center"
        width={"100%"}
        bgcolor={"grey.50"}
      >
        {/* Apply styling to the image */}
        {badge?.badge.badgePreSignedImage && (
          <img
            src={badge.badge.badgePreSignedImage}
            alt={badge.badge.name}
            style={
              badge.isCompleted
                ? containerStyleCompleted
                : containerStyleUncompleted
            }
          />
        )}
      </Box>
      <Box p={2}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom={2}
        >
          <Chip
            label={badge.isCompleted ? "COMPLETED" : "NOT COMPLETED"}
            color={badge.isCompleted ? "success" : "error"}
          />
          <Button color="secondary" variant="outlined">
            View Badge Detail
          </Button>
        </Box>

        {badge.badge.sdgBadgeType !== "BRONZE" && (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography variant="subtitle1">
              {percentageCompleted.toFixed(2)}%
            </Typography>
            <Typography variant="subtitle1">
              {" "}
              {countCompleted} /{" "}
              {badge.bookingCount
                ? badge.badge.bookingThreshold
                : badge.badge.sdgThreshold}
            </Typography>
          </Box>
        )}
        {badge.badge.sdgBadgeType !== "BRONZE" && (
          <BorderLinearProgress
            variant="determinate"
            value={
              badge.bookingCount
                ? Math.min(
                    (badge.bookingCount / badge.badge.bookingThreshold) * 100,
                    100
                  )
                : Math.min(
                    (badge.sdgCount / badge.badge.sdgThreshold) * 100,
                    100
                  )
            }
          />
        )}
        {badge.isCompleted && (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <img
              src={congrats}
              alt="Congratulations GIF"
              style={{ height: "60px" }} // Adjust height and margin as needed
            />
            <img
              src={partyPopper}
              alt="Party Popper GIF"
              style={{ height: "60px" }} // Adjust height and margin as needed
            />
          </Box>
        )}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box>
            <Typography color={accent} mt={2} fontWeight="700" variant="h6">
              {badge.badge.name}
            </Typography>
            <Typography
              color={accent}
              variant="body1"
              sx={{
                maxWidth: "300px",
              }}
            >
              {badge.badge.caption}
            </Typography>
            <Typography
              color={accent}
              variant="body1"
              sx={{
                maxWidth: "300px",
                marginTop: "15px",
              }}
            >
              {badge.isCompleted ? "Completed" : "Updated"} on{" "}
              {convertISOtoTime(badge.updated)} at{" "}
              {convertISOtoShortDate(badge.updated)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default BadgeCardItem;
