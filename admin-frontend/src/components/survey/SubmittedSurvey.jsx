import React, { useState } from "react";

import { useTheme } from "@emotion/react";
import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAdminSurveyResponseStore,
  useSnackbarStore,
  useTestimonialStore,
} from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import SurveyDetails from "./SurveyDetails";
import { convertISOtoDate } from "../../utils/TimeFormatter";

function SubmittedSurvey() {
  const theme = useTheme();
  const { surveyId } = useParams();
  const { survey, getSurveyDetails, isLoading } = useAdminSurveyResponseStore();
  const { hasTestimonialForSurvey, createTestimonialForSurvey } =
    useTestimonialStore();
  const { openSnackbar } = useSnackbarStore();
  const [hasTestimonial, setHasTestimonial] = useState();
  const [testimonial, setTestimonial] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const get = async () => {
      try {
        await getSurveyDetails(surveyId);
        const testimonialData = await hasTestimonialForSurvey(surveyId);
        setHasTestimonial(testimonialData.hasTestimonial);
        if (testimonialData.hasTestimonial) {
          setTestimonial(testimonialData.testimonial);
        }
      } catch (err) {
        openSnackbar("Error retrieving survey.", "error");
      }
    };
    get();
  }, []);

  const handleCreateTestimonial = async () => {
    try {
      const newT = await createTestimonialForSurvey(surveyId);
      navigate(`/testimonials/${newT._id}`);
      openSnackbar("Created new testimonial.", "success");
    } catch (err) {
      console.log(err);
      openSnackbar("Error creating testimonial.", "error");
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <MainBodyContainer
      hasBackButton={true}
      breadcrumbNames={["All Submitted Surveys"]}
      breadcrumbLinks={["/surveys"]}
      currentBreadcrumbName={"View Submitted Survey"}
    >
      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
      >
        Survey Response for {survey?.activity.title} by{" "}
        {survey?.booking.clientId.name}
      </Typography>

      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
      />
      <Typography
        noWrap
        variant="h6"
        fontSize={18}
        color={theme.palette.primary.main}
      >
        Event Date: {convertISOtoDate(survey?.booking.endDateTime)}
      </Typography>
      <Typography
        noWrap
        variant="h6"
        fontSize={18}
        color={theme.palette.primary.main}
      >
        Response Date: {convertISOtoDate(survey?.created)}
      </Typography>

      <Box my={3}>
        <Divider />
      </Box>

      {survey && (
        <SurveyDetails
          surveyData={survey}
          hasTestimonial={hasTestimonial}
          testimonial={testimonial}
          handleCreateTestimonial={() => handleCreateTestimonial()}
        />
      )}
    </MainBodyContainer>
  );
}

export default SubmittedSurvey;
