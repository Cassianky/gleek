import React, { useState } from "react";
import { useTheme } from "@emotion/react";
import {
  useClientStore,
  useSnackbarStore,
  useVendorStore,
} from "../../zustand/GlobalStore";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const ToggleIsDisabledButton = ({ userType, userId, userName, isDisabled }) => {
  const theme = useTheme();
  let isLoading;
  let toggleIsDisabled;
  let hasActiveBookingsFunction;
  const [hasActiveBookings, setHasActiveBookings] = useState(false);

  if (userType === "vendor") {
    const vendorStore = useVendorStore();
    isLoading = vendorStore.isLoading;
    toggleIsDisabled = vendorStore.toggleIsDisabled;
    hasActiveBookingsFunction = vendorStore.hasActiveBookings;
  } else {
    const clientStore = useClientStore();
    isLoading = clientStore.isLoading;
    toggleIsDisabled = clientStore.toggleIsDisabled;
    hasActiveBookingsFunction = clientStore.hasActiveBookings;
  }
  const { openSnackbar } = useSnackbarStore();

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = async (event) => {
    try {
      event.stopPropagation();
      const response = await hasActiveBookingsFunction(userId);
      console.log(response);
      setHasActiveBookings(response);
    } catch (error) {
      openSnackbar(error.message, "error");
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleEnableButton = async (event) => {
    console.log(userId);
    try {
      event.stopPropagation();
      const message = await toggleIsDisabled(userId, false);
      openSnackbar(message);
    } catch (error) {
      openSnackbar(error.message, "error");
    }
  };

  const handleDisableButton = async (event) => {
    try {
      event.stopPropagation();
      const message = await toggleIsDisabled(userId, true);
      openSnackbar(message);
    } catch (error) {
      openSnackbar(error.message, "error");
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  } else {
    if (isDisabled) {
      return (
        <Button
          variant="contained"
          color="success"
          onClick={handleEnableButton}
        >
          Enable
        </Button>
      );
    } else {
      return (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={async (event) => await handleDialogOpen(event)}
          >
            Disable
          </Button>
          <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>
              Disable{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: theme.palette.dark_purple.main,
                }}
              >
                {userName}
              </span>
              ?
            </DialogTitle>
            <DialogContent>
              <Typography>
                This user will no longer be able to login to their account until
                enabled again.
                {userType === "vendor" &&
                  " All published activities of this vendor will be unpublished."}
              </Typography>
              {hasActiveBookings && (
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "red",
                    mt: 2,
                  }}
                >
                  <WarningIcon color="error" sx={{ mr: 1 }} />
                  This {userType} account has active bookings!
                </Typography>
              )}

              <DialogContentText sx={{ pt: 2 }}>
                Are you sure you want to disable this {userType} account?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDisableButton} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </>
      );
    }
  }
};

export default ToggleIsDisabledButton;
