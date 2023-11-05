import React from "react";
import { useTheme } from "@emotion/react";
import {
  useClientStore,
  useSnackbarStore,
  useVendorStore,
} from "../../zustand/GlobalStore";
import { Button, Typography } from "@mui/material";

const ToggleIsDisabledButton = ({ userId, isDisabled }) => {
  const theme = useTheme();
  const { isLoading, toggleIsDisabled } = useVendorStore();
  const { openSnackbar } = useSnackbarStore();

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
        <Button variant="contained" color="error" onClick={handleDisableButton}>
          Disable
        </Button>
      );
    }
  }
};

export default ToggleIsDisabledButton;
