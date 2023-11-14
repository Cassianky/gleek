import React from "react";
import {
  CircularProgress,
  Divider,
  Typography,
  alpha,
  useTheme,
  Button,
  Box,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import MainBodyContainer from "../common/MainBodyContainer";
import { useActivityStore, useFeaturedActivityStore } from "../../zustand/GlobalStore";
import { useEffect } from "react";
import FeaturedActivitiesTable from "./FeaturedActivitiesTable";

function ManageFeaturedActivities() {
  const theme = useTheme();
  // const { activities, getActivity, isLoading, pendingApprovalActivities } =
  //   useActivityStore();
  const {activities, getActivitiesWithFeatureStatus} = useFeaturedActivityStore()
  useEffect(() => {
    const fetchData = async () => {
      await getActivitiesWithFeatureStatus();
    };
    fetchData();
  }, [getActivitiesWithFeatureStatus]);
  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"Manage Featured Activities"}
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
        Feature Activities
      </Typography>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingBottom: "20px",
        }}
      >
        <InfoIcon fontSize="small" sx={{ color: "#9F91CC" }} />
        <Typography color="#9F91CC">
          Feature activities on the Gleek homepage for Clients to see
        </Typography>
      </div>
      {activities && <FeaturedActivitiesTable activities={activities}/>}
    </MainBodyContainer>
  );
}

export default ManageFeaturedActivities;
