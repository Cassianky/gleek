import styled from "@emotion/styled";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  MobileStepper,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CategoryIcon from "@mui/icons-material/Category";
import { useState } from "react";

const StyledPaper = styled(Paper)`
  width: 90%;
  padding: 20px;
  padding-top: 6px;
  border-radius: 10px;
  border: 2px solid ${(props) => props.borderColor};
  box-shadow: 4px 4px 0px 0px ${(props) => hexToRgba(props.borderColor, 0.4)};
`;

const StyledBox = styled(Box)`
  padding: 20px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.palette.grey.pale_grey};
`;

const StyledChip = styled(Chip)`
  color: #ffffff;
  background-color: ${({ theme, status }) =>
    status === "Active"
      ? theme.palette.success.light
      : theme.palette.error.main};
  opacity: 1;
`;

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const steps = ["Add new theme", "Add learning points"];

const AddThemeModal = ({
  open,
  handleOpen,
  addThemes,
  openSnackbar,
  themes,
}) => {
  const theme = useTheme();
  const [status, setStatus] = useState("Active");
  const [activeStep, setActiveStep] = useState(0);
  const [subthemes, setSubthemes] = useState([]);
  const [textFieldValue, setTextFieldValue] = useState("");
  const [parentTheme, setParentTheme] = useState("");
  const [errors, setErrors] = useState({ subthemes: "", parenttheme: "" });

  const maxSteps = steps.length;

  const handleNext = () => {
    let error = "";
    if (activeStep === maxSteps - 1) {
      handleOpen();
      handleSubmit();
    } else {
      const found = themes?.data?.find((t) => t?.parent?.name === parentTheme);
      if (found) {
        error = "Theme already exists! Please choose another name.";
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
      setErrors({ ...errors, parenttheme: error });
    }
  };

  const handleClose = () => {
    reset();
    handleOpen();
  };

  const reset = () => {
    setStatus("Active");
    setActiveStep(0);
    setSubthemes([]);
    setTextFieldValue("");
    setParentTheme("");
    setErrors({ subthemes: "", parenttheme: "" });
  };

  const handleSubmit = async () => {
    const payload = subthemes.map((s) => {
      return { ...s, parent: parentTheme };
    });
    const response = await addThemes(payload, status);
    reset();
    openSnackbar(response);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleRadioChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSubthemeAdd = () => {
    let error = "";
    const found = subthemes.find((s) => s.name === textFieldValue);
    if (found) {
      error = "Learning point already exists!";
    } else {
      const newSubtheme = { name: textFieldValue, status: "Active" };
      setSubthemes([...subthemes, newSubtheme]);
      setTextFieldValue("");
    }
    setErrors({ ...errors, subthemes: error });
  };

  const handleChipDelete = (name) => {
    const updatedSubthemes = subthemes.filter((item) => item.name !== name);
    setSubthemes(updatedSubthemes);
  };

  const handleStatusChange = (name) => {
    const found = subthemes.map((s) => {
      if (s.name === name) {
        return {
          ...s,
          status: s.status === "Active" ? "Inactive" : "Active",
        };
      }
      return s;
    });
    setSubthemes(found);
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
              Add new theme
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
          {activeStep === 0 && (
            <div>
              <TextField
                label="Theme Name"
                variant="outlined"
                sx={{ marginBottom: 2 }}
                onChange={(e) => setParentTheme(e.target.value)}
                value={parentTheme}
                helperText={errors?.parenttheme}
                error={errors?.parenttheme?.length > 0}
              />
              <Divider sx={{ marginBottom: 2 }} />
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  <Typography
                    fontSize={"1.1rem"}
                    color={theme.palette.primary.main}
                  >
                    Theme Status
                  </Typography>
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="Active"
                  name="radio-buttons-group"
                  row
                  value={status}
                  onChange={handleRadioChange}
                >
                  <StyledPaper
                    sx={{
                      marginRight: 2,
                      display: "flex",
                      flexDirection: "column",
                      maxWidth: "200px",
                    }}
                    borderColor={
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
                    borderColor={
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
          )}
          {activeStep === 1 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "600px",
              }}
            >
              <Typography
                fontSize={"1.1rem"}
                sx={{ marginBottom: 2 }}
                color={theme.palette.primary.main}
              >
                Add Learning Points
              </Typography>
              <TextField
                error={errors?.subthemes?.length > 0}
                label="Learning Point"
                variant="outlined"
                value={textFieldValue}
                onChange={(e) => setTextFieldValue(e.target.value)}
                sx={{ marginBottom: 2 }}
                InputProps={{
                  endAdornment: (
                    <Button onClick={handleSubthemeAdd}>Add</Button>
                  ),
                }}
                helperText={errors?.subthemes}
              />
              <Divider sx={{ marginBottom: 1 }} />
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "column",
                }}
              >
                {subthemes?.length > 0 && (
                  <Typography
                    fontSize={"0.75rem"}
                    color={theme.palette.unselected.main}
                    marginBottom={2}
                  >
                    Toggle learning point status by clicking on it!
                  </Typography>
                )}
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {subthemes.map((v, index) => {
                    return (
                      <StyledChip
                        key={index}
                        label={v.name}
                        sx={{ marginRight: 1, marginBottom: 1 }}
                        onDelete={() => handleChipDelete(v.name)}
                        onClick={() => handleStatusChange(v.name)}
                        status={v.status}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </StyledBox>
        <MobileStepper
          variant="dots"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={
                parentTheme?.length === 0 ||
                !parentTheme ||
                (subthemes?.length === 0 && activeStep === maxSteps - 1)
              }
            >
              {activeStep === maxSteps - 1 ? "Submit" : "Next"}
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                activeStep !== maxSteps - 1 && <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddThemeModal;
