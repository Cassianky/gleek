import {
  Box,
  Grid,
  Typography,
  useMediaQuery,
  Rating,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Chip,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useTheme, lighten } from "@mui/material/styles";
import ReviewProfile from "./ReviewProfile";
import { convertISOtoDate } from "../utils/TimeFormatter";

const ActivityReview = ({ reviews, averageRating }) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const accent = theme.palette.accent.main;
  const tertiary = theme.palette.tertiary.main;
  const primaryLighter = lighten(theme.palette.primary.main, 0.4);
  const tertiaryLighter = lighten(theme.palette.tertiary.main, 0.4);

  let filteredReviews = reviews;

  let chipOptions = [];

  for (const review of reviews) {
    review.reviewSentiment.keywords
      .filter(
        (keyword) =>
          keyword.sentiment === "POSITIVE" || keyword.sentiment === "NEGATIVE"
      )
      .forEach((keyword) =>
        chipOptions.push({ word: keyword.word, sentiment: keyword.sentiment })
      );
  }

  const [chips, setChips] = useState([]);
  const [newChip, setNewChip] = useState("");

  const handleChipClick = (chip) => {
    // Add chip to the chips array
    setChips([...chips, chip]);
    // Clear the input field
    setNewChip("");
  };

  const handleChipDelete = (chipToDelete) => {
    // Remove the selected chip from the chips array
    setChips((prevChips) => prevChips.filter((chip) => chip !== chipToDelete));
  };

  const handleChange = (event) => {
    // Update the input field as the user types
    setNewChip(event.target.value);
  };

  const handleClick = (value) => {
    if (!chips.includes(value)) {
      setChips([...chips, value]);
    }
  };

  return filteredReviews.length > 0 ? (
    <Box>
      <Typography ml={5} mb={2} color={accent} variant="h5" fontWeight="700">
        Ratings
      </Typography>
      <Grid container spacing={3} px={5} paddingBottom={5}>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <Typography mb={1}>{reviews.length} reviews</Typography>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            bgcolor={primaryLighter}
            p={2}
          >
            <Rating
              name="rating-read"
              defaultValue={averageRating}
              precision={0.5}
              size="medium"
              readOnly
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "#5C4B99",
                },
              }}
            />
            <Typography color={accent} fontWeight={700} variant="h5" ml={1}>
              {averageRating.toFixed(1)}
            </Typography>
          </Box>
          <Box mb={2} mt={2}>
            <Divider />
          </Box>
          <Typography color={accent} fontWeight={700} variant="subtitle1">
            Filter reviews by
          </Typography>
          <Box mt={1} display="flex" flexDirection="column">
            <Box>
              {chipOptions.map((chip, index) => {
                return (
                  <Chip
                    key={index}
                    label={chip.word}
                    variant="outlined"
                    onClick={() => handleClick(chip.word)}
                    color={chip.sentiment === "POSITIVE" ? "success" : "error"}
                  />
                );
              })}
            </Box>
            <Typography
              mt={2}
              color={accent}
              fontWeight={700}
              variant="caption"
            >
              Selected Values:
            </Typography>
            <Box mt={1}>
              {chips.map((chip, index) => (
                <Chip
                  key={index}
                  label={chip}
                  onDelete={() => handleChipDelete(chip)}
                  sx={{ margin: 0.5 }}
                />
              ))}
            </Box>
          </Box>
          <Box mb={2} mt={2}>
            <Divider />
          </Box>
          <Typography color={accent} fontWeight={700} variant="subtitle1">
            Filter by ratings
          </Typography>
          <Box display="flex" flexDirection="row" alignItems="center" mt={1}>
            <Typography
              color={accent}
              fontWeight={700}
              variant="subtitle1"
              mr={2}
            >
              {averageRating.toFixed(1)}
            </Typography>
            <Rating
              name="rating-read"
              precision={0.5}
              size="small"
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "#5C4B99",
                },
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={8} lg={8}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-end"
            alignItems="center"
            mb={2}
          >
            <Typography mr={2} fontWeight={700} color={accent} variant="body1">
              Sort by:
            </Typography>
            <FormControl size="small">
              <InputLabel id="sort-by-label">Sort by:</InputLabel>
              <Select
                labelId="sort-by-label"
                id="sort-by-select"
                // value={sortBy}
                label="Sort By"
                // onChange={handleChange}
              >
                <MenuItem value={"Newest First"}>Newest First</MenuItem>
                <MenuItem value={"Price High to Low"}>
                  Price High to Low
                </MenuItem>
                <MenuItem value={"Price Low to High"}>
                  Price Low to High
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          {reviews.map((review, index) => {
            return (
              <Box key={index} bgcolor={tertiaryLighter} p={2} borderRadius={2}>
                <Box display="flex" flexDirection="column">
                  <ReviewProfile client={review.client} />
                  <Rating
                    name="rating-read"
                    defaultValue={review.rating}
                    precision={0.5}
                    size="small"
                    readOnly
                    sx={{
                      "& .MuiRating-iconFilled": {
                        color: "#5C4B99",
                      },
                      marginTop: 2,
                    }}
                  />
                  <Typography mt={2}>{review.comment}</Typography>
                  <Typography mt={2} color="grey" variant="caption">
                    {convertISOtoDate(review.date)}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Grid>
      </Grid>
    </Box>
  ) : (
    <Paper sx={{ marginX: 5, padding: 2 }}>No Ratings found.</Paper>
  );
};

export default ActivityReview;
