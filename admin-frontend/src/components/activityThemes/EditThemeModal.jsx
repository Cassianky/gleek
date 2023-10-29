import styled from "@emotion/styled";
import CategoryIcon from "@mui/icons-material/Category";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const StyledPaper = styled(Paper)`
  width: 90%;
  padding: 20px;
  padding-top: 6px;
  border-radius: 10px;
  border: 2px solid ${(props) => props.bordercolor};
  box-shadow: 4px 4px 0px 0px ${(props) => hexToRgba(props.bordercolor, 0.4)};
`;

const StyledBox = styled(Box)`
  padding: 20px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.palette.grey.pale_grey};
`;

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const EditThemeModal = ({
  open,
  handleOpen,
  openSnackbar,
  currentTheme,
  allThemes,
  updateTheme,
}) => {
  const theme = useTheme();
  const [status, setStatus] = useState(currentTheme?.status);
  const [parentTheme, setParentTheme] = useState(currentTheme?.name ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    setParentTheme(currentTheme?.name);
    setStatus(currentTheme?.status);
  }, [currentTheme, allThemes]);

  const handleClose = () => {
    reset();
    handleOpen();
  };

  const reset = () => {
    setStatus(currentTheme?.status);
    setParentTheme(currentTheme?.name ?? "");
    setError("");
  };

  const handleSubmit = async () => {
    let error = "";
    let found = "";
    let isChild = false;
    if (currentTheme?.parent) {
      isChild = true;
    }
    if (isChild) {
      found = allThemes?.find((t) => t?.name === parentTheme);
    } else {
      found = allThemes?.data?.find((t) => t?.parent?.name === parentTheme);
    }

    if (found) {
      error = isChild
        ? `Learning Point already exists for theme ${currentTheme.parent.name}! Please choose another name.`
        : "Theme already exists. Please choose another name.";
    } else {
      const updatedTheme = {
        ...currentTheme,
        status: status,
        name: parentTheme,
      };
      const response = await updateTheme(updatedTheme);
      handleOpen();
      reset();
      openSnackbar(response);
    }
    setError(error);
  };

  const handleRadioChange = (event) => {
    setStatus(event.target.value);
  };

  const handleParentThemeChange = (event) => {
    console.log(event.target.value);
    setParentTheme(event.target.value);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "10px",
          boxShadow: "4px 4px 0px 0px rgb(159 145 204 / 40%)",
          border: "2px solid rgb(159 145 204 / 40%)",
        },
        "& .MuiBackdrop-root": {
          backgroundColor: "transparent",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <DialogTitle sx={{ paddingBottom: 0 }}>
          <div style={{ display: "flex", color: theme.palette.primary.main }}>
            <CategoryIcon />
            <Typography fontSize={"1.25rem"} color={theme.palette.primary.main}>
              Edit Theme
            </Typography>
          </div>
        </DialogTitle>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent>
        <StyledBox>
          <div>
            <TextField
              label="Theme Name"
              variant="outlined"
              sx={{ marginBottom: 2 }}
              onChange={handleParentThemeChange}
              value={parentTheme ?? ""}
              helperText={error}
              error={error.length > 0}
            />
            <Divider sx={{ marginBottom: 2 }} />
            <FormControl>
              <FormLabel>
                <Typography
                  fontSize={"1.1rem"}
                  color={theme.palette.primary.main}
                >
                  Theme Status
                </Typography>
              </FormLabel>
              <RadioGroup row value={status ?? ""} onChange={handleRadioChange}>
                <StyledPaper
                  sx={{
                    marginRight: 2,
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "200px",
                  }}
                  bordercolor={
                    status === "Inactive"
                      ? theme.palette.unselected.main
                      : theme.palette.primary.main
                  }
                >
                  <FormControlLabel
                    value="Active"
                    control={<Radio />}
                    label="Active"
                  />
                  <Typography>
                    Vendors would be able to see this theme
                  </Typography>
                </StyledPaper>
                <StyledPaper
                  bordercolor={
                    status === "Active"
                      ? theme.palette.unselected.main
                      : theme.palette.primary.main
                  }
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "200px",
                  }}
                >
                  <FormControlLabel
                    value="Inactive"
                    control={<Radio />}
                    label="Inactive"
                  />
                  <Typography>
                    Vendors will not able to see this theme
                  </Typography>
                </StyledPaper>
              </RadioGroup>
            </FormControl>
          </div>
        </StyledBox>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogContent>
    </Dialog>
  );
};

EditThemeModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
  openSnackbar: PropTypes.func.isRequired,
  currentTheme: PropTypes.shape({
    status: PropTypes.string,
    name: PropTypes.string,
    parent: PropTypes.object,
  }),
  allThemes: PropTypes.object,
  updateTheme: PropTypes.func.isRequired,
};

export default EditThemeModal;
