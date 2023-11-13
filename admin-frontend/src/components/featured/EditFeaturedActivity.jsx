import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  useTheme,
  FormControl,
  Chip,
  Alert,
  AlertTitle,
} from "@mui/material";
import MainBodyContainer from "../common/MainBodyContainer";
import InfoIcon from "@mui/icons-material/Info";
import { useFeaturedActivityStore } from "../../zustand/GlobalStore";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function EditFeaturedActivity() {
  const theme = useTheme();
  const { activityId } = useParams();
  const { getFeaturedActivity } = useFeaturedActivityStore();
  const [featuredActivity, setFeaturedActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  const getDefaultFeaturedActivity = () => ({
    activity: activityId,
    isFeatured: false,
    showOnSpecificDates: false,
    showOnDates: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getFeaturedActivity(activityId);

        if (!res) {
          setFeaturedActivity(getDefaultFeaturedActivity());
        } else {
          setFeaturedActivity(res);
        }
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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddDate = () => {
    if (selectedDate) {
      handleInputChange("showOnDates", [
        ...featuredActivity.showOnDates,
        selectedDate.format("YYYY-MM-DD"),
        
      ]);
      setSelectedDate(null);
    }
  };

  const handleRemoveDate = (date) => {
    handleInputChange(
      "showOnDates",
      featuredActivity.showOnDates.filter((d) => d !== date),
    );
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", featuredActivity);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"Edit Featured Activity Settings"}
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
        Edit Featured Activity Settings
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
      {featuredActivity.showOnSpecificDates && (
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
        {featuredActivity.showOnSpecificDates && (
          <>
            <Box py={2}>
              {featuredActivity.showOnDates.length > 0 ? (
                featuredActivity.showOnDates.map((date) => (
                  <Chip
                    key={date}
                    label={date}
                    onDelete={() => handleRemoveDate(date)}
                    style={{ marginRight: "8px", marginTop: "8px" }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Start adding dates.
                </Typography>
              )}
            </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs} locale="en">
              <FormControl>
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  renderInput={(startProps) => <TextField {...startProps} />}
                  sx={{ marginRight: "12px" }}
                  shouldDisableDate={(date) =>
                    featuredActivity.showOnDates.includes(
                      date.format("YYYY-MM-DD"),
                    )
                  }
                />
              </FormControl>
            </LocalizationProvider>
            <Button variant="contained" color="primary" onClick={handleAddDate}>
              Add Date
            </Button>
          </>
        )}
      </Box>

      <Box
        marginTop={2}
        sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
      >
        <Button variant="contained" color="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Box>
    </MainBodyContainer>
  );
}

export default EditFeaturedActivity;
