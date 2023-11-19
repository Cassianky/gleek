import styled from "@emotion/styled";
import CelebrationIcon from "@mui/icons-material/Celebration";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MoneyIcon from "@mui/icons-material/Money";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  Rating,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import useAnalyticsStore from "../../../zustand/AnalyticsStore";
import ActivityTable from "./ActivityTable";
import BookingsChart from "./BookingsChart";
import OverviewCard from "./OverviewCard";
import RevenueChart from "./RevenueChart";
import WordCloud from "./WordCloud";
import ManageReviewsForActivityTable from "./ManageReviewsForActivityTable";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
}));

const lowBookingRatioText =
  "Offering incentives can be a powerful motivator for customers to leave reviews. Consider offering discounts, vouchers, or entry into a giveaway as a reward for their feedback.";

const DashboardPage = () => {
  const theme = useTheme();
  const { data, isLoading, getDashboard, reviews } = useAnalyticsStore();
  const [open, setOpen] = useState(false);
  const [selectedActivity, setActivity] = useState();
  const [activityReviews, setActivityReviews] = useState();

  const handleOpen = (activity) => {
    const filteredReviews = reviews.filter(
      (review) => review?.activity?._id === activity?.activity?._id
    );
    setActivityReviews(filteredReviews);
    setActivity(activity);
    setOpen(false);
  };

  const openSuggestion = () => {
    setOpen((prev) => !prev);
  };

  const getActivityWithMostBookings = () => {
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const rev = data?.revenuesByMonth.find((x) => x.month === month);

    if (rev && rev.activityByRevenue) {
      const sortedKeys = Object.keys(rev.activityByRevenue).sort(
        (a, b) =>
          rev.activityByRevenue[b].totalBookings -
          rev.activityByRevenue[a].totalBookings
      );

      if (sortedKeys.length > 0) {
        return rev.activityByRevenue[sortedKeys[0]].activityTitle;
      }
    }

    return null;
  };

  const getActivityWithMostRevenue = () => {
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const rev = data?.revenuesByMonth.find((x) => x.month === month);

    if (rev && rev.activityByRevenue) {
      const sortedKeys = Object.keys(rev.activityByRevenue).sort(
        (a, b) =>
          rev.activityByRevenue[b].totalRevenue -
          rev.activityByRevenue[a].totalRevenue
      );

      if (sortedKeys.length > 0) {
        return rev.activityByRevenue[sortedKeys[0]].activityTitle;
      }
    }

    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      await getDashboard();
    };
    fetchData();
  }, []);

  const calculateBookingReviewRatio = () => {
    const ratio =
      selectedActivity.numberOfReviews / selectedActivity.numberOfBookings;
    return ratio?.toFixed(2);
  };

  return (
    <StyledPage>
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
        <Container maxWidth="xl">
          <Grid
            container
            spacing={3}
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Grid item xs={3} sx={{ paddingRight: 2 }}>
              <OverviewCard
                difference={data?.confirmedPendingPaidBookingsRevenue?.difference?.toFixed(
                  2
                )}
                positive={
                  data?.confirmedPendingPaidBookingsRevenue?.difference > 0
                }
                sx={{ height: "100%" }}
                value={data?.confirmedPendingPaidBookingsRevenue?.value?.toFixed(
                  2
                )}
                title="Revenue"
                icon={<MonetizationOnIcon fontSize="medium" />}
                iconColor={theme.palette.yellow.main}
              />
            </Grid>
            <Grid item xs={3} sx={{ paddingRight: 2 }}>
              <OverviewCard
                difference={data?.numberOfBookings?.difference}
                positive={data?.numberOfBookings?.difference > 0}
                sx={{ height: "100%" }}
                value={data?.numberOfBookings?.value}
                title="Number of bookings"
                icon={<EventAvailableIcon fontSize="medium" />}
                iconColor={theme.palette.light_green.main}
              />
            </Grid>
            <Grid item xs={3} sx={{ paddingRight: 2 }}>
              <OverviewCard
                sx={{ height: "100%" }}
                value={getActivityWithMostBookings()}
                title="Activity with most bookings"
                icon={<CelebrationIcon fontSize="medium" />}
                iconColor={theme.palette.primary.main}
                titleFontSize={"0.8rem"}
              />
            </Grid>
            <Grid item xs={3} sx={{ paddingRight: 2 }}>
              <OverviewCard
                sx={{ height: "100%" }}
                value={getActivityWithMostRevenue()}
                title="Activity with highest revenue"
                icon={<MoneyIcon fontSize="medium" />}
                iconColor={theme.palette.yellow.main}
                titleFontSize={"0.8rem"}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={3}
            marginTop={2}
            display={"flex"}
            justifyContent={"space-between"}
          >
            <Grid item xs={6} paddingRight={2}>
              <RevenueChart
                sx={{ height: "100%" }}
                data={data?.activityRevenue}
              />
            </Grid>
            <Grid item xs={6} paddingRight={2}>
              <BookingsChart
                sx={{ height: "100%" }}
                data={data?.activityBookings}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={3}
            marginTop={2}
            display={"flex"}
            justifyContent={"space-between"}
          >
            {data?.activitySentiment && (
              <Grid item xs={12} paddingTop={2}>
                <ActivityTable
                  rows={data?.activitySentiment}
                  handleOpen={handleOpen}
                />
              </Grid>
            )}
            {selectedActivity && (
              <Grid item xs={12}>
                <Typography
                  fontSize={"1.5rem"}
                  color={theme.palette.primary.main}
                  marginBottom={2}
                >
                  Review Analysis for {selectedActivity.activity.title}
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
                        <div style={{ display: "flex", alignItems: "center" }}>
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
                      <CardContent sx={{ paddingTop: 0 }}>
                        {calculateBookingReviewRatio()}
                        {calculateBookingReviewRatio() < 0.5 && (
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
                        {calculateBookingReviewRatio() > 0.5 && (
                          <Alert severity="warning">
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
                      All reviews for {selectedActivity.activity.title}
                    </Typography>
                    <ManageReviewsForActivityTable reviews={activityReviews} />
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Container>
      )}
    </StyledPage>
  );
};

export default DashboardPage;
