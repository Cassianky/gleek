import React from "react";
import DownloadIcon from "@mui/icons-material/Download";

import { Button } from "@mui/material";
import { useBookingStore } from "../../zustand/GlobalStore";

const InvoiceDownloadButton = (data) => {
  const { getBookingSummaryPdf } = useBookingStore();

  const handleDownload = async (event) => {
    event.stopPropagation();
    try {
      await getBookingSummaryPdf(data.bookingId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleDownload}>
      <DownloadIcon />
      Invoice
    </Button>
  );
};

export default InvoiceDownloadButton;
