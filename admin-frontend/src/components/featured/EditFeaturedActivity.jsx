import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  TextField,
  Typography,
  Stack,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useFeaturedActivityStore,
  useSnackbarStore,
} from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";

function EditFeaturedActivity() {
  const theme = useTheme();
  const { activityId } = useParams();
  const { getFeaturedActivity, updateFeaturedActivity } =
    useFeaturedActivityStore();
  const { openSnackbar } = useSnackbarStore();
  const [featuredActivity, setFeaturedActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  // const getDefaultFeaturedActivity = () => ({
  //   activity: activityId,
  //   isFeatured: false,
  //   showOnSpecificDates: false,
  //   showOnDates: [],
  // });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getFeaturedActivity(activityId);

        setFeaturedActivity(res);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activityId, getFeaturedActivity]);

  const handleInputChange = (field, value) => {
    setFeaturedActivity((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDisplayDate = (date) => {
    // Display date as "YYYY-MM-DD"
    return dayjs(date).format("YYYY-MM-DD");
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddDate = () => {
    if (selectedDate) {
      // Store the date with timezone details
      handleInputChange("showOnDates", [
        ...featuredActivity.showOnDates,
        selectedDate.toISOString(),
      ]);
      setSelectedDate(null);
    }
  };

  const filterDates = (dates) => {
    const currentDate = dayjs();
    const upcomingDates = dates.filter((date) =>
      dayjs(date).isAfter(currentDate),
    );
    const pastDates = dates.filter((date) => dayjs(date).isBefore(currentDate));
    return { upcomingDates, pastDates };
  };

  const disableSaveChanges = () => {
    return (
      featuredActivity?.isFeatured &&
      featuredActivity?.showOnSpecificDates &&
      featuredActivity?.showOnDates.length === 0
    );
  };

  const handleClearDates = (section) => {
    const remainingDates = filterDates(featuredActivity.showOnDates)[
      section === "upcomingDates" ? "pastDates" : "upcomingDates"
    ];

    handleInputChange("showOnDates", remainingDates);
  };

  const handleRemoveDate = (date) => {
    handleInputChange(
      "showOnDates",
      featuredActivity.showOnDates.filter((d) => d !== date),
    );
  };

  const handleSaveChanges = async () => {
    try {
      console.log("Saving changes:", featuredActivity);
      await updateFeaturedActivity(activityId, featuredActivity);
      openSnackbar("Saved successfully", "success");
    } catch (error) {
      openSnackbar("Error occured when saving", "error");
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <MainBodyContainer
      hasBackButton={true}
      breadcrumbNames={["Manage Featured Activities"]}
      breadcrumbLinks={["/featured"]}
      currentBreadcrumbName={`Edit Featured ${featuredActivity?.activity.title} Settings`}
    >
      <Typography
        alignItems={"center"}
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
        paddingBottom={1}
        style={{
          display: "flex",
        }}
      >
        Edit Featured {featuredActivity?.activity.title} Settings
      </Typography>

      {featuredActivity.isFeatured && !featuredActivity.showOnSpecificDates && (
        <Alert severity="info">
          <AlertTitle>This activity will always be featured.</AlertTitle>
        </Alert>
      )}
      {!featuredActivity.isFeatured && (
        <Alert severity="info">
          <AlertTitle>This activity is not featured.</AlertTitle>
        </Alert>
      )}
      {featuredActivity.isFeatured && featuredActivity.showOnSpecificDates && (
        <Alert severity="info">
          <AlertTitle>
            This activity will be featured on specific days.
          </AlertTitle>
        </Alert>
      )}

      <Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={featuredActivity.isFeatured}
              onChange={(e) =>
                handleInputChange("isFeatured", e.target.checked)
              }
            />
          }
          label="Feature this activity"
        />

        {featuredActivity.isFeatured && (
          <FormControlLabel
            control={
              <Checkbox
                checked={featuredActivity.showOnSpecificDates}
                onChange={(e) =>
                  handleInputChange("showOnSpecificDates", e.target.checked)
                }
              />
            }
            label="Show on Specific Dates"
          />
        )}
        {featuredActivity.isFeatured &&
          featuredActivity.showOnSpecificDates && (
            <>
              <Box py={2}>
                <Box py={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
                    <FormControl>
                      <DatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        renderInput={(startProps) => (
                          <TextField {...startProps} />
                        )}
                        sx={{ marginRight: "12px" }}
                        shouldDisableDate={(date) =>
                          featuredActivity.showOnDates.includes(
                            date.toISOString(),
                          )
                        }
                      />
                    </FormControl>
                  </LocalizationProvider>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddDate}
                  >
                    Add Date
                  </Button>
                </Box>
                {featuredActivity.showOnDates.length > 0 ? (
                  <>
                    {/* Upcoming Dates */}
                    {filterDates(featuredActivity.showOnDates).upcomingDates
                      .length > 0 && (
                      <Box mb={3}>
                        <Stack direction="row" alignItems="center">
                          <Typography variant="h6" color="textPrimary">
                            Upcoming Dates
                          </Typography>
                          <DeleteIcon
                            style={{ marginLeft: "8px", cursor: "pointer" }}
                            onClick={() => handleClearDates("upcomingDates")}
                          />
                        </Stack>
                        {filterDates(featuredActivity.showOnDates)
                          .upcomingDates.sort((a, b) => a.localeCompare(b))
                          .map((date) => (
                            <Chip
                              key={date}
                              label={formatDisplayDate(date)}
                              onDelete={() => handleRemoveDate(date)}
                              style={{ marginRight: "8px", marginTop: "8px" }}
                            />
                          ))}
                      </Box>
                    )}
                    {/* Past Dates */}
                    {filterDates(featuredActivity.showOnDates).pastDates
                      .length > 0 && (
                      <>
                        <Stack direction="row" alignItems="center">
                          <Typography variant="h6" color="textPrimary">
                            Past Dates
                          </Typography>
                          <DeleteIcon
                            style={{ marginLeft: "8px", cursor: "pointer" }}
                            onClick={() => handleClearDates("pastDates")}
                          />
                        </Stack>

                        {filterDates(featuredActivity.showOnDates)
                          .pastDates.sort((a, b) => a.localeCompare(b))
                          .map((date) => (
                            <Chip
                              key={date}
                              label={formatDisplayDate(date)}
                              onDelete={() => handleRemoveDate(date)}
                              style={{ marginRight: "8px", marginTop: "8px" }}
                            />
                          ))}
                      </>
                    )}
                  </>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Start adding dates.
                  </Typography>
                )}
              </Box>
            </>
          )}
      </Box>

      <Box
        marginTop={2}
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveChanges}
          disabled={disableSaveChanges()}
        >
          Save Changes
        </Button>
      </Box>
    </MainBodyContainer>
  );
}

export default EditFeaturedActivity;
