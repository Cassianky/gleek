import styled from "@emotion/styled";
import { Typography, useTheme, Box } from "@mui/material";
import MainBodyContainer from "../common/MainBodyContainer";
import { Link, useParams } from "react-router-dom";
import { useBadgeStore } from "../../zustand/GlobalStore";
import React, { useState, useEffect } from "react";
import BadgeRecordsTable from "./BadgeRecordsTable";
import BadgeDetailsForm from "./BadgeDetailsForm";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey.pale_grey,
}));

const CreateBadgePage = () => {
  const theme = useTheme();
  const { badgeId } = useParams();
  const { currentBadge, badgeRecords, getAllBadgeRecords } = useBadgeStore();

  useEffect(() => {
    getAllBadgeRecords(badgeId);
    console.log("TET");
  }, []);

  return (
    <StyledPage>
      <MainBodyContainer
        hasBackButton={true}
        breadcrumbNames={["View Badges"]}
        breadcrumbLinks={["/badges"]}
        currentBreadcrumbName={"View Badge Details"}
      >
        <Typography
          alignItems={"center"}
          fontSize={25}
          fontWeight={700}
          noWrap
          component="div"
          color={theme.palette.primary.main}
          paddingBottom={2}
          style={{
            display: "flex",
          }}
        >
          View Badge Details
        </Typography>
        {currentBadge && <BadgeDetailsForm badge={currentBadge} />}
        <Box height={10}></Box>
        {badgeRecords && <BadgeRecordsTable badgeRecords={badgeRecords} />}
      </MainBodyContainer>
    </StyledPage>
  );
};
export default CreateBadgePage;
