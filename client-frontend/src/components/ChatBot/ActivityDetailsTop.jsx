import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
  Box,
} from "@mui/material";
import AxiosConnect from "../../utils/AxiosConnect";
import notFound from "../../assets/not_found.png";
import { useNavigate } from "react-router-dom";

const ActivityDetailsTop = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await AxiosConnect.get(
        "/gleek/chatbot/getTop5BookedActivities",
      );
      setActivities(response.data.topActivities);
    };
    fetchData();
  }, []);

  let containerStyle = {
    height: "5rem", // Default for extra-large screens
    maxWidth: "5rem",
    width: "100%",
    objectFit: "cover",
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
  };

  return (
    <Box display="flex" flexDirection="column">
      {activities.map((activity, index) => {
        return (
          <Link
            key={index}
            mb={1}
            href={`/shop/activity/${activity.activityDetails._id.toString()}`}
            underline="none"
            onClick={(event) => {
              event.preventDefault();
              navigate(`/shop/activity/${activity._id.toString()}`);
            }}
          >
            <Paper>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
                flexDirection="row"
              >
                <Box bgcolor={"grey.50"}>
                  {/* Apply styling to the image */}
                  {activity?.activityDetails.preSignedImages &&
                    activity?.activityDetails.preSignedImages.length > 0 && (
                      <img
                        src={activity.activityDetails.preSignedImages[0]}
                        alt={activity.activityDetails.title}
                        style={containerStyle}
                      />
                    )}
                  {!activity.activityDetails.preSignedImages.length > 0 && (
                    <img
                      src={notFound}
                      alt={activity.activityDetails.title}
                      style={containerStyle}
                    />
                  )}
                </Box>
                <Box display="flex" flexDirection="column" ml={1}>
                  <Typography>{activity.activityDetails.title}</Typography>
                  <Typography variant="subtitle2">
                    {activity.activityDetails.activityType}
                  </Typography>
                  <Typography variant="subtitle2">
                    {activity.activityDetails.duration} mins
                  </Typography>
                  <Typography variant="subtitle2">
                    {"~"} {Math.ceil(activity.totalBookings / 10) * 10} Bookings
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Link>
        );
      })}
    </Box>
  );
};

export default ActivityDetailsTop;
