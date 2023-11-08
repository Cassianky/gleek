import styled from "@emotion/styled";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    Grid,
    Rating,
    Stack,
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

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
}));

const DashboardPage = () => {
  const theme = useTheme();
  const { data, isLoading, getDashboard } = useAnalyticsStore();
  const [selectedActivity, setActivity] = useState();

  const handleOpen = (activity) => {
    setActivity(activity);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getDashboard();
    };
    fetchData();
  }, []);

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
                difference={
                  data?.confirmedPendingPaidBookingsRevenue?.difference
                }
                positive={
                  data?.confirmedPendingPaidBookingsRevenue?.difference > 0
                }
                sx={{ height: "100%" }}
                value={data?.confirmedPendingPaidBookingsRevenue?.value}
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
                difference={data?.numberOfBookings?.difference}
                positive={data?.numberOfBookings?.difference > 0}
                sx={{ height: "100%" }}
                value={data?.numberOfBookings?.value}
                title="Number of bookings"
                icon={<EventAvailableIcon fontSize="medium" />}
                iconColor={theme.palette.light_green.main}
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
                data={data?.revenuesByMonth}
              />
            </Grid>
            <Grid item xs={6}>
              <BookingsChart
                sx={{ height: "100%" }}
                data={data?.revenuesByMonth}
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
                  Survey Analysis for {selectedActivity.activity.title}
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
                        <WordCloud data={selectedActivity.activityLiked} />
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
                          data={selectedActivity.activityImprovement}
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
                        <Box>
                          <Typography color={theme.palette.primary.main}>
                            How likely customer will recommend this activity
                          </Typography>
                          <Rating
                            max={10}
                            readOnly
                            required
                            name="recommendationScore"
                            value={selectedActivity.avgRecommendationScore}
                          />
                        </Box>
                        <Box>
                          <Typography color={theme.palette.primary.main}>
                            Recommendation Score
                          </Typography>
                          <Rating
                            max={10}
                            readOnly
                            required
                            name="recommendationScore"
                            value={selectedActivity.avgRecommendationScore}
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
    </StyledPage>
  );
};

export default DashboardPage;
