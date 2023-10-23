import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const CancelField = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleConfirm = () => {
    // Handle your confirmation logic here, e.g., send API request
    console.log("Reason:", reason);
    // Close the dialog
    handleDialogClose();
  };

  return (
    <div>
      <Button variant="contained" color="error" onClick={handleDialogOpen}>
        Cancel
      </Button>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>Please provide a reason:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Reason"
            fullWidth
            variant="standard"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Back
          </Button>
          <Button
            onClick={handleConfirm}
            color="primary"
            disabled={!reason.trim()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CancelField;
