import React from "react";
import { Box, Typography, Rating, TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const RatingsFilter = ({ handleChange, ratingValue }) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const accent = theme.palette.accent.main;

  return (
    <Box boxShadow={2} borderRadius={2} mt={5}>
      <Box
        bgcolor={primary}
        sx={{
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <Typography p={1} fontWeight={700} variant="h6" color={accent}>
          Ratings & Up
        </Typography>
      </Box>
      <Box
        p={3}
        display="flex"
        flexDirection="row"
        justifyContent="space-around"
        alignItems="center"
      >
        <Rating
          name="half-rating-read"
          value={ratingValue}
          precision={0.5}
          readOnly
          size="medium"
          sx={{
            "& .MuiRating-iconFilled": {
              color: "#5C4B99",
            },
          }}
        />
        <TextField
          id="outlined-number"
          label="Ratings & Up"
          type="number"
          value={ratingValue}
          onChange={handleChange}
          inputProps={{
            min: 0,
            step: 0.5,
          }}
        />
      </Box>
    </Box>
  );
};

export default RatingsFilter;
