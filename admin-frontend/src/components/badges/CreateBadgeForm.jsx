import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  FormGroup,
  Box,
  Dialog,
  DialogTitle,
  DialogActions,
  Stack,
} from "@mui/material";
import { Fragment, useCallback, useRef } from "react";
import Paper from "@mui/material/Paper";
import { ImageConfig } from "../../utils/ImageConfig";
import AxiosConnect from "../../utils/AxiosConnect";

const StyledContainer = styled(Paper)`
  padding: 20px;
  padding-top: 6px;
  border-radius: 10px;
  box-shadow: 4px 4px 0px 0px rgb(159 145 204 / 40%);
`;
const StyledSubmitButton = styled(Button)`
  && {
    background-color: ${({ theme }) => theme.palette.light_purple.main};
  }
`;
export const CustomBox = styled(Box)`
  &.MuiBox-root {
    background-color: #fff;
    border-radius: 2rem;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    padding: 1rem;
  }

  &:hover,
  &.dragover {
    opacity: 0.6;
  }
`;

const CreateBadgeForm = (theme) => {
  const inputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    badgeType: "",
    caption: "",
    description: "",
    sdgThreshold: "",
    bookingThreshold: "",
    sdg: "",
    badgeImage: null,
    image: null,
  });

  const [errorData, setErrorData] = useState({
    name: "",
    badgeType: "",
    caption: "",
    description: "",
    sdgThreshold: "",
    bookingThreshold: "",
    sdg: "",
  });

  // When a field loses focus, validate the field.
  const handleValidate = (event) => {
    const { name, value } = event.target;
    const errors = validator(formData, name);
    setErrorData((prevData) => ({
      ...prevData,
      [name]: errors[name] || "", // Replace the error with an empty string if it's empty
    }));
  };

  const validator = (formData, fieldName) => {
    let errors = {};
    switch (fieldName) {
      case "bookingThreshold":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "sdgThreshold":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "name":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "badgeType":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "caption":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "description":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      default:
    }
    return errors;
  };
  const validateIsRequired = (data, errors, fieldName) => {
    if (data === "") {
      errors[fieldName] = `${fieldName} is required`;
    }
  };

  const badgeTypes = {
    GOLD: "GOLD",
    BRONZE: "BRONZE",
    SILVER: "SILVER",
    OTHER: "OTHER",
  };

  const SustainableDevelopmentGoalsEnum = {
    NO_POVERTY: "No Poverty",
    ZERO_HUNGER: "Zero Hunger",
    GOOD_HEALTH_AND_WELL_BEING: "Good Health and Well-being",
    QUALITY_EDUCATION: "Quality Education",
    GENDER_EQUALITY: "Gender Equality",
    CLEAN_WATER_AND_SANITATION: "Clean Water and Sanitation",
    AFFORDABLE_AND_CLEAN_ENERGY: "Affordable and Clean Energy",
    DECENT_WORK_AND_ECONOMIC_GROWTH: "Decent Work and Economic Growth",
    INDUSTRY_INNOVATION_AND_INFRASTRUCTURE:
      "Industry, Innovation, and Infrastructure",
    REDUCED_INEQUALITIES: "Reduced Inequalities",
    SUSTAINABLE_CITIES_AND_COMMUNITIES: "Sustainable Cities and Communities",
    RESPONSIBLE_CONSUMPTION_AND_PRODUCTION:
      "Responsible Consumption and Production",
    CLIMATE_ACTION: "Climate Action",
    LIFE_BELOW_WATER: "Life Below Water",
    LIFE_ON_LAND: "Life on Land",
    PEACE_AND_JUSTICE_STRONG_INSTITUTIONS:
      "Peace and Justice Strong Institutions",
    PARTNERSHIPS_FOR_THE_GOALS: "Partnerships for the Goals",
  };

  // Badge Type Select Manu
  const handleBadgeTypeChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      badgeType: value,
      sdgThreshold: "",
      bookingThreshold: "",
    }));
    setErrorData((prevData) => ({
      ...prevData,
      badgeType: "",
    }));
  };

  // SDG Select Manu
  const handleSDGChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      sdg: value,
    }));
    setErrorData((prevData) => ({
      ...prevData,
      sdg: "",
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBadgeTypeErrorCheck = (event) => {
    const errors = validator(formData, "badgeType");
    setErrorData((prevData) => ({
      ...prevData,
      badgeType: errors["badgeType"] || "", // Replace the error with an empty string if it's empty
    }));
  };

  const wrapperRef = useRef(null);

  const [open, setOpen] = useState();

  const handleClose = () => {
    setOpen();
  };

  const onFileDrop = (e) => {
    const target = e.target;
    console.log(target);
    if (!target || !target.files || target.files.length === 0) {
      // Handle the case where the target or files array is missing or empty
      return;
    }

    const selectedFile = target.files[0];

    if (selectedFile.size > 5000000) {
      setOpen(`Image size must be smaller than ${5000000 / 1000000} MB`);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        badgeImagePreview: URL.createObjectURL(selectedFile), // Store the URL of the selected image
        badgeImage: selectedFile, // Store the URL of the selected image
      }));
      // Clear the input value
      inputRef.current.value = ""; // Use the ref to clear the input value
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataN = new FormData();

    formDataN.append("name", formData.name);
    formDataN.append("sdgBadgeType", formData.badgeType);
    formDataN.append("caption", formData.caption);
    formDataN.append("description", formData.description);

    if (formData.sdgThreshold) {
      formDataN.append("sdgThreshold", formData.sdgThreshold);
    }
    if (formData.bookingThreshold) {
      formDataN.append("bookingThreshold", formData.bookingThreshold);
    }
    if (formData.sdg) {
      formDataN.append("sdg", formData.sdg);
    }
    if (formData.badgeImage) {
      formDataN.append("image", formData.badgeImage);
    }
    if (!formData.badgeImage) {
      console.error("No file has been attached");
      return;
    }
    const responseStatus = await AxiosConnect.post(
      "/badge/createBadge",
      formDataN
    );

    console.log(responseStatus);
  };

  return (
    <form>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <StyledContainer elevation={3}>
          <Grid container spacing={2} alignItems="left" justifyContent="left">
            <Grid item xs={12}>
              <Typography
                // color={theme.palette.primary.main}
                paddingTop={2}
                component="div"
                fontSize={"1.25rem"}
              >
                Badge Name
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                variant="standard"
                id="name"
                name="name"
                placeholder="Name"
                label="Name"
                disabled={false}
                fullWidth
                onChange={handleChange}
                onBlur={handleValidate}
                helperText={errorData.name}
                error={errorData.name.length > 0}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel id="badgeTypeLabel" required>
                  Badge Type
                </InputLabel>
                <Select
                  labelId="badgeTypeLabel"
                  label="Badge Type"
                  placeholder="Badge Type"
                  onChange={handleBadgeTypeChange}
                  value={formData.badgeType}
                  onOpen={handleBadgeTypeErrorCheck}
                >
                  {Object.values(badgeTypes).map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
                {errorData.badgeType && (
                  <FormHelperText error id="badge-type-helper-text">
                    {errorData.badgeType}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="caption"
                id="caption"
                label="Caption"
                placeholder="Write the caption of badge here..."
                multiline
                rows={2}
                fullWidth
                onChange={handleChange}
                onBlur={handleValidate}
                helperText={errorData.caption}
                error={errorData.caption.length > 0}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="description"
                id="description"
                label="Description"
                placeholder="Write description about badge here..."
                multiline
                rows={4}
                fullWidth
                onChange={handleChange}
                onBlur={handleValidate}
                helperText={errorData.description}
                error={errorData.description.length > 0}
              />
            </Grid>
          </Grid>
        </StyledContainer>
        {formData.badgeType === "BRONZE" && (
          <StyledContainer elevation={3}>
            <Grid container spacing={2} alignItems="left" justifyContent="left">
              <Grid item xs={12}>
                <Typography
                  // color={theme.palette.primary.main}
                  paddingTop={2}
                  component="div"
                  fontSize={"1.25rem"}
                >
                  Badge Details
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="sdgLabel" required>
                    Sustainability Development Goal
                  </InputLabel>
                  <Select
                    labelId="sdgLabel"
                    label="SDG Type"
                    placeholder="Sustainability Development Goal"
                    onChange={handleSDGChange}
                    value={formData.sdg}
                  >
                    {Object.values(SustainableDevelopmentGoalsEnum).map(
                      (value) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      )
                    )}
                  </Select>
                  {errorData.sdg && (
                    <FormHelperText error id="badge-type-helper-text">
                      {errorData.sdg}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </StyledContainer>
        )}
        {(formData.badgeType === "GOLD" || formData.badgeType === "SILVER") && (
          <StyledContainer elevation={3}>
            <Grid container spacing={2} alignItems="left" justifyContent="left">
              <Grid item xs={12}>
                <Typography
                  // color={theme.palette.primary.main}
                  paddingTop={2}
                  component="div"
                  fontSize={"1.25rem"}
                >
                  Badge Details
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  type="number"
                  id="sdgThreshold"
                  name="sdgThreshold"
                  placeholder="Input an appropriate Goal number"
                  label="Number of Sustainability Goals to achieve Badge"
                  disabled={false}
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleValidate}
                  helperText={errorData.sdgThreshold}
                  error={errorData.sdgThreshold.length > 0}
                />
              </Grid>
            </Grid>
          </StyledContainer>
        )}
        {formData.badgeType === "OTHER" && (
          <StyledContainer elevation={3}>
            <Grid container spacing={2} alignItems="left" justifyContent="left">
              <Grid item xs={12}>
                <Typography
                  // color={theme.palette.primary.main}
                  paddingTop={2}
                  component="div"
                  fontSize={"1.25rem"}
                >
                  Badge Details
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  type="number"
                  id="bookingThreshold"
                  name="bookingThreshold"
                  placeholder="Input an appropriate Goal number"
                  label="Number of Bookings to achieve Badge"
                  disabled={false}
                  fullWidth
                  onChange={handleChange}
                  onBlur={handleValidate}
                  helperText={errorData.bookingThreshold}
                  error={errorData.bookingThreshold.length > 0}
                />
              </Grid>
            </Grid>
          </StyledContainer>
        )}
        <StyledContainer elevation={3}>
          <Grid container spacing={2} alignItems="left" justifyContent="left">
            <Grid item xs={12}>
              <Typography
                // color={theme.palette.primary.main}
                paddingTop={2}
                component="div"
                fontSize={"1.25rem"}
              >
                Badge Image
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {formData?.badgeImagePreview !== null && (
                <img
                  src={formData?.badgeImagePreview}
                  loading="lazy"
                  style={{ width: "200px", height: "auto" }}
                />
              )}
              <FormGroup>
                <CustomBox>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "13rem",
                      border: "2px dashed #4267b2",
                      borderRadius: "20px",
                    }}
                    ref={wrapperRef}
                  >
                    <Stack
                      justifyContent="center"
                      sx={{ p: 1, textAlign: "center" }}
                    >
                      <Typography sx={{ color: "#ccc" }}>
                        Browse file to upload for badge image
                      </Typography>
                      <div>
                        <img
                          src={ImageConfig["upload"]}
                          alt="file upload"
                          style={{ width: "5rem" }}
                        />
                      </div>
                      <Typography variant="body1" component="span">
                        <strong>Supported Files</strong>
                      </Typography>
                      <Typography variant="body2" component="span">
                        JPG, JPEG, PNG, SVG
                      </Typography>
                    </Stack>
                    <input
                      type="file"
                      name="badgeImage" // Use "badgeImage" here to match your state
                      onChange={onFileDrop}
                      accept="image/jpg, image/png, image/jpeg, image/svg"
                      style={{
                        opacity: 0,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                      }}
                      ref={inputRef}
                    />
                  </Box>
                </CustomBox>
              </FormGroup>
            </Grid>
          </Grid>
        </StyledContainer>
      </div>

      <Grid
        container
        paddingTop={2}
        spacing={1}
        alignItems="left"
        justifyContent="left"
      >
        <Grid item xs={5}>
          <StyledSubmitButton
            onClick={handleSubmit}
            type="submit"
            variant="contained"
            fullWidth
          >
            <Typography component="div">Submit</Typography>
          </StyledSubmitButton>
        </Grid>
        <Grid item xs={2}>
          <Button
            // onClick={handleCancel}
            variant="outlined"
            fullWidth
            color="unselected"
          >
            <Typography component="div">Cancel</Typography>
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateBadgeForm;
