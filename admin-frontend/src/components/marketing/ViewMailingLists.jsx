import React, { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import {
  useMailingListStore,
  useSnackbarStore,
} from "../../zustand/GlobalStore";
import InfoIcon from "@mui/icons-material/Info";
import MailingListsTable from "./MailingListsTable";
import EmailIcon from "@mui/icons-material/Email";
import {
  Badge,
  CircularProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

import MainBodyContainer from "../common/MainBodyContainer";

const ViewMailingLists = () => {
  const theme = useTheme();
  const { isLoading, mailingLists, getMailingLists } = useMailingListStore();
  const [currentTab, setCurrentTab] = useState("adminNewslettersMailingList");

  useEffect(() => {
    const fetchData = async () => {
      await getMailingLists();
    };
    fetchData();
  }, [getMailingLists]);

  const handleChange = (event, newVal) => {
    setCurrentTab(newVal);
  };

  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"View Mailing Lists"}
    >
      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
      >
        View Mailing Lists
      </Typography>
      <div style={{ display: "flex", alignItems: "center" }}>
        <InfoIcon fontSize="small" sx={{ color: "#9F91CC" }} />
        <Typography color="#9F91CC">
          View clients who are subscribed to the mailing lists.
        </Typography>
      </div>
      <Tabs value={currentTab} onChange={handleChange} centered>
        <Tab
          icon={<EmailIcon />}
          value="adminNewslettersMailingList"
          label="Admin Newsletters"
        />
        <Tab
          icon={<EmailIcon />}
          value="personalisedNewslettersMailingList"
          label="Personalised Recommendations"
        />
      </Tabs>
      {isLoading ? (
        <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
      ) : (
        <>
          {currentTab === "adminNewslettersMailingList" && (
            <MailingListsTable
              mailingLists={mailingLists}
              receiveNewsletterType={currentTab}
            />
          )}
          {currentTab === "personalisedNewslettersMailingList" && (
            <MailingListsTable
              mailingLists={mailingLists}
              receiveNewsletterType={currentTab}
            />
          )}
        </>
      )}
    </MainBodyContainer>
  );
};

export default ViewMailingLists;
