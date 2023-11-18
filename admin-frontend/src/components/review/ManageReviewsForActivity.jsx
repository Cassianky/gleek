import React from "react";

import { useTheme } from "@emotion/react";
import { CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useActivityStore,
  useReviewStore,
  useSnackbarStore,
} from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";

import ManageReviewsForActivityTable from "./ManageReviewsForActivityTable";

function ManageReviewsForActivity() {
  const theme = useTheme();
  const { activityId } = useParams();

  const { openSnackbar } = useSnackbarStore();
  const { activities, getActivity, isLoading, pendingApprovalActivities } =
    useActivityStore();

  const { reviews, activity, getReviewsForActivity, toggleReviewVisibility } =
    useReviewStore();

  useEffect(() => {
    const fetchData = async () => {
      await getReviewsForActivity(activityId);
    };
    fetchData();
  }, [getActivity]);
  console.log(reviews);

  const handleToggle = async (reviewId) => {
    try {
      await toggleReviewVisibility(reviewId);
      console.log("after handle toggle", reviews);
      openSnackbar("Toggled review visibility", "success");
    } catch (error) {
      console.error(error);
      openSnackbar("An error occurred", "error");
    }
  };
  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <MainBodyContainer
      hasBackButton={true}
      breadcrumbNames={["Manage Reviews"]}
      breadcrumbLinks={["/reviews"]}
      currentBreadcrumbName={`For ${activity?.title || "Loading"}`}
    >
      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
      >
        Manage Reviews For {activity?.title}
      </Typography>
      {reviews && (
        <ManageReviewsForActivityTable
          reviews={reviews}
          handleToggle={handleToggle}
        />
      )}
    </MainBodyContainer>
  );
}

export default ManageReviewsForActivity;
