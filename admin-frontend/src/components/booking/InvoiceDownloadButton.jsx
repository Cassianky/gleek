import React from "react";
import DownloadIcon from '@mui/icons-material/Download';

import {
  Button,
} from "@mui/material";

const handleDownload = () => {

    console.log("Download Invoice!");
};


const InvoiceDownloadButton = () => {
  
  return (
      <Button variant="contained" color="primary" onClick={handleDownload}>
        <DownloadIcon />
        Invoice
      </Button>
  );
};

export default InvoiceDownloadButton;
