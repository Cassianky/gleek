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
import { convertISOtoShortDate } from "../../utils/TimeFormatter";

const ActivityDetailsRecent = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await AxiosConnect.get(
        "/gleek/chatbot/get5MostRecentActivities",
      );
      setActivities(response.data.recentActivities);
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
            href={`/shop/activity/${activity._id.toString()}`}
            underline="none"
            onClick={(event) => {
              event.preventDefault();
              const clickedActivity = activities.find(
                (item) => item._id.toString() === activity._id.toString(),
              );
              navigate(`/shop/activity/${activity._id.toString()}`);
            }}
          >
            <Paper>
              <Box
                display="flex"
                justifyContent="flex-start"
                flexDirection="row"
              >
                <Box bgcolor={"grey.50"}>
                  {/* Apply styling to the image */}
                  {activity?.preSignedImages &&
                    activity?.preSignedImages.length > 0 && (
                      <img
                        src={activity.preSignedImages[0]}
                        alt={activity.title}
                        style={containerStyle}
                      />
                    )}
                  {!activity.preSignedImages.length > 0 && (
                    <img
                      src={notFound}
                      alt={activity.title}
                      style={containerStyle}
                    />
                  )}
                </Box>
                <Box display="flex" flexDirection="column" ml={1}>
                  <Typography>{activity.title}</Typography>
                  <Typography variant="subtitle2">
                    {activity.activityType}
                  </Typography>
                  <Typography variant="subtitle2">
                    {activity.duration} mins
                  </Typography>
                  <Typography variant="subtitle2">
                    Created: {convertISOtoShortDate(activity.createdDate)}
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

export default ActivityDetailsRecent;
