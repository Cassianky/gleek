import React, { useEffect, useState } from "react";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Badge,
  Grid,
  Link,
  Button,
  Alert,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import useBadgeStore from "../../../zustand/BadgeStore";
import BadgeCardItem from "../../../components/BadgeCardItem";
import { useTheme, lighten } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import overallBadge from "../../../assets/overall_badge.gif";
import { useNavigate } from "react-router-dom";
import useClientStore from "../../../zustand/ClientStore";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    color: "white",
    backgroundColor: theme.palette.success.pastel,
  },
}));

const MyBadges = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const initialTab = searchParams.get("tab") || "all";
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const { client } = useClientStore();
  const {
    getBadges,
    badges,
    isLoadingBadges,
    completedBadges,
    uncompletedBadges,
  } = useBadgeStore();
  const primary = theme.palette.accent.primary;
  const tertiary = theme.palette.tertiary.main;
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);

    // Update the query parameter with the selected tab
    setSearchParams({ tab: newValue });
  };

  useEffect(() => {
    const fetchData = async () => {
      await getBadges();
    };
    fetchData();
  }, []);

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === "light" ? tertiary : "#308fe8",
    },
  }));

  const completedBadgesCount = badges.filter(
    (badge) => badge.isCompleted,
  ).length;
  const totalBadgesCount = badges.length;

  const completionPercentage = totalBadgesCount
    ? Math.min((completedBadgesCount / totalBadgesCount) * 100, 100)
    : 0;

  let badgesCompleted = {
    height: "300px",
  };

  let badgesUncompleted = {
    height: "300px",
    filter: "grayscale(100%)",
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      p={5}
      width={"100%"}
    >
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography color="secondary" variant="h3">
          My Badges
        </Typography>
        <Button
          color="secondary"
          variant="outlined"
          onClick={(event) => {
            navigate(`/client/${client._id.toString()}`);
          }}
        >
          View My Profile with Badges
        </Button>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        mt={5}
        mb={5}
        alignItems="center"
      >
        <Typography color="secondary" variant="h6" alignSelf="flex-start">
          Overall Badges Progress
        </Typography>
        <img
          src={overallBadge}
          alt="overall badge GIF"
          style={
            completionPercentage === 100 ? badgesCompleted : badgesUncompleted
          } // Adjust height and margin as needed
        />
        {completionPercentage !== 100 && (
          <Alert severity="info">
            Complete all badges to get your overall badge!
          </Alert>
        )}
        <Box width="60%" mt={2}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography variant="subtitle1">
              {completionPercentage.toFixed(2)}%
            </Typography>
            <Typography variant="subtitle1">
              {" "}
              {completedBadgesCount} / {totalBadgesCount}
            </Typography>
          </Box>
          <BorderLinearProgress
            variant="determinate"
            value={completionPercentage}
          />
        </Box>
      </Box>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        indicatorColor="secondary"
        centered
      >
        <Tab label="ALL" value="all" />
        <Tab label="IN PROGRESS" value="in progress" />
        <Tab label="COMPLETED" value="completed" />
      </Tabs>
      <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
        {selectedTab === "all" && (
          <Grid
            container
            spacing={{ xs: 2, md: 3, lg: 3, xl: 3 }}
            columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 16 }}
          >
            {!isLoadingBadges &&
              badges.map((badge) => (
                <Grid item key={badge._id} xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Link
                    // href={}
                    underline="none"
                    onClick={(event) => {}}
                  >
                    <BadgeCardItem badge={badge} />
                  </Link>
                </Grid>
              ))}
          </Grid>
        )}
        {selectedTab === "in progress" && (
          <Grid
            container
            spacing={{ xs: 2, md: 3, lg: 3, xl: 3 }}
            columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 16 }}
          >
            {!isLoadingBadges &&
              uncompletedBadges.map((badge) => (
                <Grid item key={badge._id} xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Link
                    // href={}
                    underline="none"
                    onClick={(event) => {}}
                  >
                    <BadgeCardItem badge={badge} />
                  </Link>
                </Grid>
              ))}
          </Grid>
        )}
        {selectedTab === "completed" && (
          <Grid
            container
            spacing={{ xs: 2, md: 3, lg: 3, xl: 3 }}
            columns={{ xs: 4, sm: 8, md: 12, lg: 12, xl: 16 }}
          >
            {!isLoadingBadges &&
              completedBadges.map((badge) => (
                <Grid item key={badge._id} xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Link
                    // href={}
                    underline="none"
                    onClick={(event) => {}}
                  >
                    <BadgeCardItem badge={badge} />
                  </Link>
                </Grid>
              ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default MyBadges;
