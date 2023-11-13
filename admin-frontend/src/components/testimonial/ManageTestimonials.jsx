import { useTheme } from "@emotion/react";
import { CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useSnackbarStore,
  useTestimonialStore,
} from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TestimonialsTable from "./TestimonialsTable";

function ManageTestimonials() {
  const theme = useTheme();

  const { openSnackbar } = useSnackbarStore();
  const {
    testimonials,
    getAllTestimonials,
    isLoading,
    toggleTestimonialVisibility,
  } = useTestimonialStore();

  const handleToggle = async (testimonialId) => {
    try {
      await toggleTestimonialVisibility(testimonialId);
      openSnackbar(`Toggled testimonial successfully.`, "success");
    } catch (error) {
      console.error(error);
      openSnackbar("An error occurred", "error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllTestimonials();
      } catch (err) {
        console.error(err);
        openSnackbar("Error when retrieving testimonials.", "error");
      }
    };
    fetchData();
  }, [getAllTestimonials]);

  if (isLoading) {
    return <CircularProgress />;
  }
  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"Manage Testimonials"}
    >
      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
      >
        Manage Testimonials
      </Typography>
      {testimonials && (
        <TestimonialsTable
          testimonials={testimonials}
          handleToggle={handleToggle}
        />
      )}
    </MainBodyContainer>
  );
}

export default ManageTestimonials;
