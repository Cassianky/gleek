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
import React, { useState, useEffect } from "react";
import { useTheme, lighten } from "@mui/material/styles";
import ReviewProfile from "./ReviewProfile";
import { convertISOtoDate } from "../utils/TimeFormatter";
import Pagination from "@mui/material/Pagination";

const ActivityReview = ({ reviews, averageRating }) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const accent = theme.palette.accent.main;
  const tertiary = theme.palette.tertiary.main;
  const primaryLighter = lighten(theme.palette.primary.main, 0.4);
  const tertiaryLighter = lighten(theme.palette.tertiary.main, 0.4);
  const [filter, setFilter] = useState({ rating: 0, words: [] });
  const [filteredReviews, setFilteredReviews] = useState([...reviews]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Most Recent");
  const reviewsPerPage = 10;
  let chipMap = new Map();
  let chipOptions = [];

  for (const review of reviews) {
    review.reviewSentiment.keywords
      .filter(
        (keyword) =>
          keyword.sentiment === "POSITIVE" || keyword.sentiment === "NEGATIVE",
      )
      .forEach(function (keyword) {
        if (chipMap.has(keyword)) {
          let value = chipMap.get(keyword).count;
          chipMap.set(keyword.word, {
            sentiment: keyword.sentiment,
            count: value + 1,
          });
        } else {
          chipMap.set(keyword.word, { sentiment: keyword.sentiment, count: 1 });
        }
      });
  }

  // Sorting the Map entries in descending order based on the count
  chipOptions = Array.from(chipMap.entries())
    .map(([key, value]) => ({
      key,
      value,
    }))
    .sort((a, b) => a.value.count - b.value.count);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    let tempFiltered = reviews;

    if (filter.rating > 0) {
      // Filter by rating
      tempFiltered = tempFiltered.filter(
        (review) => review.rating >= filter.rating,
      );
    }

    if (filter.words.length > 0) {
      // Filter by words
      tempFiltered = tempFiltered.filter((review) => {
        const keywords = review.reviewSentiment.keywords.map(
          (keyword) => keyword.word,
        );
        return filter.words.some((word) => keywords.includes(word));
      });
    }

    tempFiltered = tempFiltered.sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    setSortBy("Most Recent");

    setCurrentPage(1); // Reset to the first page when filters change
    // Update the state with the filtered array
    setFilteredReviews(tempFiltered);
  }, [filter.rating, filter.words, reviews]);

  const handleChipDelete = (chipToDelete) => {
    // Remove the selected chip from the chips array
    setFilter((prevFilter) => {
      return {
        ...prevFilter,
        words: prevFilter.words.filter((chip) => chip !== chipToDelete),
      };
    });
  };
  const handleClick = (value) => {
    if (!filter.words.includes(value)) {
      setFilter((prevFilter) => {
        return { ...prevFilter, words: [...prevFilter.words, value] };
      });
    }
  };
  const handleRatingsChange = (event) => {
    const value = event.target.value;
    setFilter((prevFilter) => {
      return { ...prevFilter, rating: value };
    });
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview,
  );

  const handleChange = (event) => {
    setSortBy(event.target.value);
    let sortedReviews = [...filteredReviews];
    if (event.target.value === "Most Recent") {
      sortedReviews = sortedReviews.sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );
    } else if (event.target.value === "Oldest") {
      sortedReviews = sortedReviews.sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );
    } else if (event.target.value === "From Most Highly Rated") {
      sortedReviews = sortedReviews.sort((a, b) => b.rating - a.rating);
    } else if (event.target.value === "From Lowest Rated") {
      sortedReviews = sortedReviews.sort((a, b) => a.rating - b.rating);
    }

    setFilteredReviews(sortedReviews);
    setCurrentPage(1); // Reset to the first page when sorting changes
  };

  return reviews.length > 0 ? (
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
            <Grid container spacing={2}>
              {chipOptions.map((chip, index) => {
                return (
                  <Grid item key={index}>
                    <Chip
                      label={`${chip.key} (${chip.value.count})`}
                      variant="outlined"
                      onClick={() => handleClick(chip.key)}
                      color={
                        chip.value.sentiment === "POSITIVE"
                          ? "success"
                          : "error"
                      }
                    />
                  </Grid>
                );
              })}
            </Grid>
            {filter.words.length > 0 && (
              <Typography
                mt={2}
                color={accent}
                fontWeight={700}
                variant="caption"
              >
                Selected Values:
              </Typography>
            )}
            <Box mt={1}>
              {filter.words.map((chip, index) => (
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
              {Number(filter.rating).toFixed(1)}
            </Typography>
            <Rating
              name="rating-read"
              precision={0.5}
              value={filter.rating}
              onChange={handleRatingsChange}
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
                value={sortBy}
                label="Sort By"
                onChange={handleChange}
              >
                <MenuItem value={"Most Recent"}>Most Recent</MenuItem>
                <MenuItem value={"Oldest"}>Oldest</MenuItem>
                <MenuItem value={"From Most Highly Rated"}>
                  From Most Highly Rated
                </MenuItem>
                <MenuItem value={"From Lowest Rated"}>
                  From Lowest Rated
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          {currentReviews.map((review, index) => {
            return (
              <Box
                key={index}
                mb={5}
                bgcolor={tertiaryLighter}
                p={2}
                borderRadius={2}
              >
                <Box display="flex" flexDirection="column">
                  <ReviewProfile client={review.client} />
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    mt={1}
                  >
                    <Rating
                      name="rating-read"
                      value={review.rating}
                      precision={0.5}
                      size="small"
                      readOnly
                      sx={{
                        "& .MuiRating-iconFilled": {
                          color: "#5C4B99",
                        },
                      }}
                    />
                  </Box>
                  <Typography mt={2}>{review.comment}</Typography>
                  <Typography mt={2} color="grey" variant="caption">
                    {convertISOtoDate(review.date)}
                  </Typography>
                </Box>
              </Box>
            );
          })}
          <Pagination
            count={Math.ceil(filteredReviews.length / reviewsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="small"
            sx={{ marginTop: 2 }}
          />
        </Grid>
      </Grid>
    </Box>
  ) : (
    <Paper sx={{ marginX: 5, padding: 2 }}>No Ratings found.</Paper>
  );
};

export default ActivityReview;
