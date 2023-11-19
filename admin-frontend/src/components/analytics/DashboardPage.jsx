import styled from "@emotion/styled";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Rating,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAnalyticsStore } from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import ActivityProfitTable from "./ActivityProfitTable";
import ActivityTable from "./ActivityTable";
import ManageReviewsForActivityTable from "./ManageReviewsForActivityTable";
import RevenueChart from "./RevenueChart";
import WordCloud from "./WordCloud";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey.pale_grey,
}));

const lowBookingRatioText =
  "Offering incentives can be a powerful motivator for customers to leave reviews. Consider offering discounts, vouchers, or entry into a giveaway as a reward for their feedback.";

const DashboardPage = () => {
  const theme = useTheme();
  const {
    isLoading,
    getDashboard,
    reviews,
    calculateAdminProfit,
    activityDetails,
    profitPerMonth,
    sentiments,
  } = useAnalyticsStore();
  const [open, setOpen] = useState(false);
  const [selectedActivity, setActivity] = useState();
  const [activityReviews, setActivityReviews] = useState();
  const handleOpen = (activity) => {
    const filteredReviews = reviews.filter(
      (review) => review?.activity?._id === activity?._id,
    );
    setActivityReviews(filteredReviews);
    setActivity(activity);
    setOpen(false);
  };
  const allActivities = sentiments?.result.flatMap((item) =>
    item.sentiment.map((sentiment) => ({
      ...sentiment.activity,
      activityLiked: sentiment.activityLiked,
      activityImprovement: sentiment.activityImprovement,
      totalSentiment: sentiment.totalSentiment,
      numberOfBookings: sentiment.numberOfBookings,
      numberOfSurveys: sentiment.numberOfSurveys,
      numberOfReviews: sentiment.numberOfReviews,
      avgRecommendationScore: sentiment.avgRecommendationScore,
      avgRepeatActivityDifferentVendorScore:
        sentiment.avgRepeatActivityDifferentVendorScore,
      avgTotalRepeatActivityScore: sentiment.avgTotalRepeatActivityScore,
      avgReviewRating: sentiment.avgReviewRating,
      totalReviewSentiments: sentiment.totalReviewSentiments,
      reviewSentimentScore: sentiment.reviewSentimentScore,
    })),
  );
  const getDefaultStartDate = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    return new Date(currentYear, currentMonth, 1);
  };

  const getDefaultEndDate = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    return new Date(currentYear, currentMonth + 1, 0);
  };

  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (!endDate) {
      setError("Please fill in month and year for end range!");
    } else {
      setError("");
      await calculateAdminProfit(
        startDate.toISOString(),
        endDate.toISOString(),
      );
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleStartDateChange = (date) => {
    if (date > endDate) {
      setEndDate(null);
    }
    setStartDate(date);
  };

  const openSuggestion = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getDashboard();
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const startOfMonth = new Date(currentYear, currentMonth, 1);
      const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
      await calculateAdminProfit(
        startOfMonth.toISOString(),
        endOfMonth.toISOString(),
      );
    };
    fetchData();
  }, []);

  const calculateBookingReviewRatio = () => {
    const ratio =
      selectedActivity.numberOfReviews / selectedActivity.numberOfBookings;
    if (isNaN(ratio)) {
      return 0;
    }
    return ratio?.toFixed(2);
  };

  return (
    <StyledPage>
      <MainBodyContainer
        hasBackButton={false}
        breadcrumbNames={[]}
        breadcrumbLinks={[]}
        currentBreadcrumbName={"Dashboard"}
      >
        <Typography
          fontSize={25}
          fontWeight={700}
          noWrap
          component="div"
          color={theme.palette.primary.main}
          paddingLeft={2}
          paddingTop={2}
          paddingBottom={4}
        >
          Dashboard
        </Typography>
        {isLoading ? (
          <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
        ) : (
          <Container>
            <Grid
              container
              spacing={3}
              display={"flex"}
              justifyContent={"space-between"}
            >
              <Grid item xs={12}>
                <Typography
                  fontSize={"1.5rem"}
                  color={theme.palette.primary.main}
                >
                  Profit Analysis
                </Typography>
                <Divider
                  sx={{
                    backgroundColor: alpha(
                      theme.palette.light_purple.main,
                      0.5,
                    ),
                    marginBottom: 2,
                  }}
                />
              </Grid>
              {activityDetails && (
                <Grid item xs={12} paddingRight={2} marginBottom={3}>
                  <ActivityProfitTable
                    rows={activityDetails}
                    startDate={startDate}
                    endDate={endDate}
                    handleUpdate={handleUpdate}
                    handleEndDateChange={handleEndDateChange}
                    handleStartDateChange={handleStartDateChange}
                    rangeError={error}
                  />
                </Grid>
              )}
            </Grid>
            <Grid
              container
              spacing={3}
              display={"flex"}
              justifyContent={"space-between"}
            >
              <Grid item xs={12} paddingRight={2} marginBottom={3}>
                <RevenueChart sx={{ height: "100%" }} data={profitPerMonth} />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={3}
              display={"flex"}
              justifyContent={"space-between"}
            >
              <Grid item xs={12}>
                <Typography
                  fontSize={"1.5rem"}
                  color={theme.palette.primary.main}
                >
                  Review & Survey Analysis
                </Typography>
                <Divider
                  sx={{
                    backgroundColor: alpha(
                      theme.palette.light_purple.main,
                      0.5,
                    ),
                    marginBottom: 2,
                  }}
                />
              </Grid>
              {allActivities && (
                <Grid item xs={12} paddingTop={2}>
                  <ActivityTable rows={allActivities} handleOpen={handleOpen} />
                </Grid>
              )}
            </Grid>
            <Grid
              container
              spacing={3}
              marginTop={2}
              display={"flex"}
              justifyContent={"space-between"}
            >
              {selectedActivity && (
                <Grid item xs={12}>
                  <Typography
                    fontSize={"1.5rem"}
                    color={theme.palette.primary.main}
                    marginBottom={2}
                  >
                    Review Analysis for {selectedActivity?.title}
                  </Typography>
                  <Grid
                    container
                    spacing={3}
                    display={"flex"}
                    justifyContent={"space-between"}
                  >
                    <Grid item xs={6}>
                      <Card
                        sx={{
                          borderRadius: "20px",
                          boxShadow: "4px 4px 0px 0px rgb(159 145 204 / 40%)",
                          border: "0px solid rgb(159 145 204 / 40%)",
                          backgroundColor: "white",
                        }}
                      >
                        <CardHeader
                          title="What customers said about activity"
                          style={{ color: theme.palette.primary.main }}
                        />
                        <CardContent>
                          <WordCloud
                            data={selectedActivity.totalReviewSentiments}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card
                        sx={{
                          borderRadius: "20px",
                          boxShadow: "4px 4px 0px 0px rgb(159 145 204 / 40%)",
                          border: "0px solid rgb(159 145 204 / 40%)",
                          backgroundColor: "white",
                        }}
                      >
                        <CardHeader
                          title="Average Review Rating"
                          style={{ color: theme.palette.primary.main }}
                        />
                        <CardContent>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              fontFamily: theme.typography.fontFamily,
                            }}
                          >
                            <Rating
                              max={5}
                              readOnly
                              required
                              name="rating"
                              value={selectedActivity.avgReviewRating}
                            />
                            {selectedActivity.avgReviewRating?.toFixed(1)}
                          </div>
                        </CardContent>
                        <CardHeader
                          title="Booking-to-Review ratio"
                          style={{ color: theme.palette.primary.main }}
                        />
                        <CardContent
                          sx={{
                            paddingTop: 0,
                          }}
                        >
                          <Typography>
                            {calculateBookingReviewRatio()}
                          </Typography>

                          {calculateBookingReviewRatio() < 0.5 &&
                            selectedActivity.numberOfReviews > 0 && (
                              <Alert
                                severity="warning"
                                action={
                                  <Button
                                    color="inherit"
                                    size="small"
                                    onClick={openSuggestion}
                                  >
                                    View Suggestion
                                  </Button>
                                }
                              >
                                Your booking to review ratio is low.
                              </Alert>
                            )}
                          {calculateBookingReviewRatio() > 0.5 &&
                            selectedActivity.numberOfReviews > 0 && (
                              <Alert severity="info">
                                Your booking to review ratio is good.
                              </Alert>
                            )}
                          {open && (
                            <Box
                              sx={{
                                borderRadius: "20px",
                                border: "2px solid rgb(159 145 204 / 40%)",
                                backgroundColor: "white",
                                marginTop: 2,
                              }}
                            >
                              <Typography
                                paddingLeft={2}
                                paddingRight={2}
                                color={theme.palette.primary.main}
                              >
                                {lowBookingRatioText}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        fontSize={"1.5rem"}
                        color={theme.palette.primary.main}
                        marginBottom={2}
                      >
                        All reviews for {selectedActivity?.title}
                      </Typography>
                      <ManageReviewsForActivityTable
                        reviews={activityReviews}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {selectedActivity && (
                <Grid item xs={12}>
                  <Typography
                    fontSize={"1.5rem"}
                    color={theme.palette.primary.main}
                    marginBottom={2}
                  >
                    Survey Analysis for {selectedActivity?.title}
                  </Typography>
                  <Grid
                    container
                    spacing={3}
                    display={"flex"}
                    justifyContent={"space-between"}
                  >
                    <Grid item xs={3}>
                      <Card
                        sx={{
                          borderRadius: "20px",
                          boxShadow: "4px 4px 0px 0px rgb(159 145 204 / 40%)",
                          border: "0px solid rgb(159 145 204 / 40%)",
                          backgroundColor: "white",
                        }}
                      >
                        <CardHeader
                          title="What customers liked about activity"
                          style={{ color: theme.palette.primary.main }}
                        />
                        <CardContent>
                          <WordCloud data={selectedActivity?.activityLiked} />
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={3}>
                      <Card
                        sx={{
                          borderRadius: "20px",
                          boxShadow: "4px 4px 0px 0px rgb(159 145 204 / 40%)",
                          border: "0px solid rgb(159 145 204 / 40%)",
                          backgroundColor: "white",
                        }}
                      >
                        <CardHeader
                          title="Customer's feedback for activity"
                          style={{ color: theme.palette.primary.main }}
                        />
                        <CardContent>
                          <WordCloud
                            data={selectedActivity?.activityImprovement}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          borderRadius: "20px",
                          boxShadow: "4px 4px 0px 0px rgb(159 145 204 / 40%)",
                          border: "0px solid rgb(159 145 204 / 40%)",
                          backgroundColor: "white",
                        }}
                      >
                        <Stack spacing={2}>
                          <Box paddingLeft={2} paddingTop={2}>
                            <Typography color={theme.palette.primary.main}>
                              How likely customer will recommend this activity
                            </Typography>
                            <Rating
                              max={10}
                              readOnly
                              required
                              name="recommendationScore"
                              value={selectedActivity?.avgRecommendationScore}
                            />
                          </Box>
                          <Box paddingLeft={2} paddingTop={2}>
                            <Typography color={theme.palette.primary.main}>
                              Recommendation Score
                            </Typography>
                            <Rating
                              max={10}
                              readOnly
                              required
                              name="recommendationScore"
                              value={selectedActivity?.avgRecommendationScore}
                            />
                          </Box>
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Container>
        )}
      </MainBodyContainer>
    </StyledPage>
  );
};

export default DashboardPage;
