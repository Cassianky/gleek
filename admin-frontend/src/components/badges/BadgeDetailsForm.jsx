import styled from "@emotion/styled";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";

import { Box, Grid, Typography, useTheme } from "@mui/material";
import Paper from "@mui/material/Paper";
const StyledContainer = styled(Paper)`
  padding: 20px;
  padding-top: 6px;
  border-radius: 10px;
  box-shadow: 4px 4px 0px 0px rgb(159 145 204 / 40%);
`;

export const CustomBox = styled(Box)`
  &.MuiBox-root {
    background-color: #fff;
    border-radius: 2rem;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    padding: 1rem;
  }

  &:hover,
  &.dragover {
    opacity: 0.6;
  }
`;

const BadgeDetailsForm = ({ badge }) => {
  const theme = useTheme();
  let containerStyle = {
    minHeight: "10rem", // Default for extra-large screens
    width: "10rem",
    objectFit: "cover",
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
    borderBottomRightRadius: "4px",
    borderBottomLeftRadius: "4px",
    borderRadius: "4px",
  };
  console.log(badge);
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <StyledContainer elevation={3}>
          <Grid container spacing={2} alignItems="left" justifyContent="left">
            <Grid item xs={12}>
              <Typography
                color={theme.palette.primary.main}
                paddingTop={2}
                component="div"
                fontSize={"1.25rem"}
                fontWeight={700}
              >
                Badge Details
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column">
                <Typography color={theme.palette.primary.main} fontWeight={700}>
                  Badge Name:{" "}
                </Typography>
                <Typography>{badge.name}</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column">
                <Typography color={theme.palette.primary.main} fontWeight={700}>
                  Badge Type:{" "}
                </Typography>
                <Typography>{badge.sdgBadgeType}</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column">
                <Typography color={theme.palette.primary.main} fontWeight={700}>
                  Badge Caption:{" "}
                </Typography>
                <Typography>{badge.caption}</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" flexDirection="column">
                <Typography color={theme.palette.primary.main} fontWeight={700}>
                  Badge Description:{" "}
                </Typography>
                <Typography>{badge.description}</Typography>
              </Box>
            </Grid>
            {badge.sdgBadgeType === "BRONZE" && (
              <Grid item xs={4}>
                <Box display="flex" flexDirection="column">
                  <Typography
                    color={theme.palette.primary.main}
                    fontWeight={700}
                  >
                    Badge Sustainable Development Goal:{" "}
                  </Typography>
                  <Typography>{badge.sdg}</Typography>
                </Box>
              </Grid>
            )}
            {(badge.sdgBadgeType === "GOLD" ||
              badge.sdgBadgeType === "SILVER") && (
              <Grid item xs={4}>
                <Box display="flex" flexDirection="column">
                  <Typography
                    color={theme.palette.primary.main}
                    fontWeight={700}
                  >
                    Badge Sustainable Development Goal Threshold:{" "}
                  </Typography>
                  <Typography color={theme.palette.primary.main}>
                    {badge.sdgThreshold}
                  </Typography>
                </Box>
              </Grid>
            )}
            {badge.sdgBadgeType === "OTHER" && (
              <Grid item xs={4}>
                <Box display="flex" flexDirection="column">
                  <Typography
                    color={theme.palette.primary.main}
                    fontWeight={700}
                  >
                    Badge Booking Threshold:{" "}
                  </Typography>
                  <Typography>{badge.bookingThreshold}</Typography>
                </Box>
              </Grid>
            )}
            <Grid item xs={6}>
              <Typography color={theme.palette.primary.main} fontWeight={700}>
                Badge Image:
              </Typography>
              {badge.badgePreSignedImage && (
                <img
                  src={badge.badgePreSignedImage}
                  alt={badge.name}
                  style={containerStyle}
                />
              )}
            </Grid>
          </Grid>
        </StyledContainer>
      </div>
    </div>
  );
};

export default BadgeDetailsForm;
