import React, { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import {
  useNewsletterStore,
  useSnackbarStore,
} from "../../zustand/GlobalStore";
import { CircularProgress, Tabs, Tab, Typography, Button } from "@mui/material";
import MainBodyContainer from "../common/MainBodyContainer";
import InfoIcon from "@mui/icons-material/Info";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import SendIcon from "@mui/icons-material/Send";
import NewslettersTable from "./NewslettersTable";
import Email from "@mui/icons-material/Email";
import CancelButton from "./CancelButton";
import DraftNewsletterButton from "./DraftNewsletterButton";

const ManageNewsletters = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState("scheduled");
  const { isLoading, newsletters, getAllScheduledNewsletters } =
    useNewsletterStore();

  const scheduledAdditionalColumns = [
    {
      field: "editAction",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params) => {
        return <DraftNewsletterButton newsletterData={params.row} />;
      },
    },
    {
      field: "cancelAction",
      headerName: "Cancel",
      flex: 0.2,
      renderCell: (params) => {
        return <CancelButton newsletterData={params.row} />;
      },
    },
  ];

  const failedAdditionalColumns = [
    {
      field: "errorLog",
      headerName: "Error Log",
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return <Typography color="error">{params.row.errorLog}</Typography>;
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await getAllScheduledNewsletters();
    };
    fetchData();
  }, [getAllScheduledNewsletters]);

  const handleChange = (event, newVal) => {
    setCurrentTab(newVal);
  };

  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"Manage Newsletters"}
    >
      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
      >
        Manage Newsletters
      </Typography>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <InfoIcon fontSize="small" sx={{ color: "#9F91CC" }} />
          <Typography color="#9F91CC">
            Schedule newsletters to be sent to clients subscribed to the mailing
            list.
          </Typography>
        </div>
        <DraftNewsletterButton />
      </div>
      <Tabs value={currentTab} onChange={handleChange} centered>
        <Tab icon={<ScheduleSendIcon />} value="scheduled" label="Scheduled" />
        <Tab icon={<SendIcon />} value="sent" label="Sent" />
        <Tab icon={<CancelScheduleSendIcon />} value="failed" label="Failed" />
      </Tabs>
      {isLoading ? (
        <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
      ) : (
        <>
          {currentTab === "scheduled" && (
            <NewslettersTable
              newsletters={newsletters}
              status="SCHEDULED"
              additionalColumns={scheduledAdditionalColumns}
            />
          )}
          {currentTab === "sent" && (
            <NewslettersTable
              newsletters={newsletters}
              status="SENT"
              additionalColumns={[]}
            />
          )}
          {currentTab === "failed" && (
            <NewslettersTable
              newsletters={newsletters}
              status="FAILED"
              additionalColumns={failedAdditionalColumns}
            />
          )}
        </>
      )}
    </MainBodyContainer>
  );
};

export default ManageNewsletters;
