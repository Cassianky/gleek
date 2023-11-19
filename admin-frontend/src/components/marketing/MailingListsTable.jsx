import { useEffect, useState } from "react";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";

const MailingListsTable = ({ mailingLists, receiveNewsletterType }) => {
  const [filteredMailingLists, setFilteredMailingLists] = useState([]);

  useEffect(() => {
    setFilteredMailingLists(
      mailingLists.filter((subscriber) =>
        receiveNewsletterType === "adminNewslettersMailingList"
          ? subscriber.receiveAdminNewsletters
          : subscriber.receivePersonalisedRecommendations,
      ),
    );
  }, [mailingLists]);

  const columns = [
    {
      field: "name",
      headerName: "Client Name",
      flex: 1,
      renderCell: (params) => {
        return params.row.client?.name;
      },
    },
    {
      field: "company",
      headerName: "Client Company",
      flex: 1,
      renderCell: (params) => {
        return params.row.client?.companyName;
      },
    },
    {
      field: "email",
      headerName: "Client Email",
      flex: 1,
      renderCell: (params) => {
        return params.row.client?.email;
      },
    },
  ];

  return (
    <div style={{ height: "100%", width: "99%" }}>
      <DataGrid
        rows={filteredMailingLists}
        columns={columns}
        autoHeight
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

export default MailingListsTable;
