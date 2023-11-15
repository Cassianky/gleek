import { useEffect, useState } from "react";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import { Chip, Typography, Drawer, Box, Button } from "@mui/material";
import PropTypes from "prop-types";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Send from "@mui/icons-material/Send";
import EmailIcon from "@mui/icons-material/Email";
import { useTheme } from "@emotion/react";
import PreviewIcon from "@mui/icons-material/Preview";
import PreviewButton from "./PreviewButton";

const NewslettersTable = ({ newsletters, status, additionalColumns }) => {
  const [filteredNewsletters, setFilteredNewsletters] = useState([]);

  useEffect(() => {
    setFilteredNewsletters(
      newsletters.filter((newsletter) => newsletter.status === status),
    );
  }, [newsletters]);

  const standardColumns = [
    {
      field: "subject",
      headerName: "Email Subject",
      flex: 1,
      renderCell: (params) => {
        return (
          <Typography color="primary">
            <div style={{ display: "flex", alignItems: "center" }}>
              <EmailIcon style={{ marginRight: "10px" }} />
              {params.row.subject}
            </div>
          </Typography>
        );
      },
    },
    {
      field: "scheduledTime",
      headerName: "Scheduled Time",
      flex: 1.2,
      sortable: false,
      renderCell: (params) => {
        const dateTimeOptions = {
          weekday: "long", // Display the full weekday name
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        };
        const scheduledTime = new Date(params.row.scheduledTime).toLocaleString(
          undefined,
          dateTimeOptions,
        );
        return (
          <div
            style={{
              display: "flex",
              width: "100%",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <Chip
              icon={<AccessTimeIcon />}
              label={
                <Typography fontSize={"0.875rem"}>{scheduledTime}</Typography>
              }
            />
          </div>
        );
      },
    },
    {
      field: "newsletterType",
      headerName: "Newsletter Type",
      flex: 0.6,
      renderCell: (params) => {
        const label =
          params.row.newsletterType === "CUSTOM"
            ? "Custom Newsletter"
            : "Personalised Recommendations";
        const color =
          params.row.newsletterType === "CUSTOM" ? "primary" : "success";
        return <Chip label={label} color={color} />;
      },
    },
    {
      field: "preview",
      headerName: "Preview",
      flex: 0.2,
      sortable: false,
      renderCell: (params) => <PreviewButton newsletterData={params.row} />,
    },
  ];

  const columns = [...standardColumns, ...additionalColumns];

  return (
    <div style={{ height: "100%", width: "99%" }}>
      <DataGrid
        rows={filteredNewsletters}
        columns={columns}
        autoHeight
        getRowHeight={() => "auto"}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
        }}
        disableRowSelectionOnClick
        slots={{ toolbar: GridToolbarFilterButton }}
      />
    </div>
  );
};

NewslettersTable.propTypes = {
  newsletters: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  additionalColumns: PropTypes.array.isRequired,
};

export default NewslettersTable;
