import styled from "@emotion/styled";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import useAdminSurveyResponseStore from "../../../zustand/AdminSurveyResponseStore";
import useSnackbarStore from "../../../zustand/SnackbarStore";
import MainBodyContainer from "../../../components/Common/MainBodyContainer";

const StyledPaper = styled(Paper)`
  padding: 20px;
  padding-top: 6px;
  border-radius: 10px;
  border: 1px solid rgb(159, 145, 204);
  box-shadow: 3px 3px 0px 0px rgb(159, 145, 204, 40%);
`;

function FillSurvey() {
  const { bookingId } = useParams();

  const {
    submitSurveyForBooking,
    getSurveyForBooking,
    isLoadingSurvey,
    isSurveyAvailable,
  } = useAdminSurveyResponseStore();

  const { openSnackbar } = useSnackbarStore();
  const navigate = useNavigate();

  const [surveyData, setSurveyData] = useState({
    email: "",
    name: "",
    company: "",
    activity: "",
    date: "",
    recommendationScore: 0,
    potentialNextActivityDate: "",
    repeatActivityScore: 0,
    repeatActivityDifferentVendorScore: 0,
    differentActivityScore: 0,
    activityLiked: "",
    activityImprovements: "",
    testimonial: "",
    displayName: "",
    potentialReferrals: "",
  });

  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: "",
  });

  useEffect(() => {
    const getSurvey = async () => {
      try {
        const data = await getSurveyForBooking(bookingId);

        if (data.survey) {
          setSurveyData(data.survey);
        }

        if (data.review) {
          setReviewData(data.review);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getSurvey();
  }, []);

  const handleFieldChange = (field, value) => {
    setSurveyData({
      ...surveyData,
      [field]: value,
    });
  };

  const [wantsToLeaveReview, setWantsToLeaveReview] = useState(false);

  const handleToggleReview = () => {
    setWantsToLeaveReview(!wantsToLeaveReview);
  };
  const handleReviewFieldChange = (field, value) => {
    setReviewData({
      ...reviewData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    try {
      console.log(surveyData);
      console.log(reviewData);
      submitSurveyForBooking(
        bookingId,
        surveyData,
        reviewData,
        wantsToLeaveReview,
      );
      openSnackbar("Submitted!", "success");
      navigate(`/booking/${bookingId}`);
    } catch (err) {
      console.log(err);
      openSnackbar("There was an error.", "error");
    }
  };

  if (isLoadingSurvey)
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );

  if (!isSurveyAvailable)
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={5}
        px={10}
        width={"100%"}
      >
        <StyledPaper>
          <Typography paddingY={1} variant="h5" color="primary">
            Survey not available
          </Typography>

          <Typography variant="body1">
            There is no survey available for this booking.
          </Typography>
        </StyledPaper>
      </Box>
    );

  return (
    <MainBodyContainer
      hasBackButton={true}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={`Respond to survey`}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={5}
        px={10}
        width={"100%"}
      >
        <Typography color="secondary" variant="h3">
          Post-Activity Survey
        </Typography>

        <Typography variant="body2">
          Thank you for choosing one of our activities! Your response will help
          us improve to meet your needs better.
        </Typography>

        <form>
          <Grid container spacing={2} p={7}>
            <Grid item xs={12}>
              <FormControlLabel
                checked={wantsToLeaveReview}
                onChange={handleToggleReview}
                color="primary"
                control={<Checkbox />}
                label="Do you want to leave a review on this activity?"
              />
            </Grid>

            {wantsToLeaveReview && (
              <>
                <Grid item xs={12}>
                  <Typography color="primary" variant="h4">
                    Activity Review
                  </Typography>
                  <Typography variant="h7" color="secondary">
                    This will be a publicly posted review on the activity.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <StyledPaper>
                    <Typography paddingY={1} variant="h6">
                      What would you rate this activity experience overall?
                    </Typography>
                    <Rating
                      max={5}
                      name="rating"
                      value={reviewData?.rating}
                      onChange={(event, newValue) =>
                        handleReviewFieldChange("rating", newValue)
                      }
                    />
                  </StyledPaper>
                </Grid>
                <Grid item xs={12}>
                  <StyledPaper>
                    <Typography paddingY={1} variant="h6">
                      What were your thoughts about the activity?
                    </Typography>
                    <TextField
                      variant="standard"
                      fullWidth
                      name="comment"
                      value={reviewData?.comment}
                      onChange={(e) =>
                        handleReviewFieldChange("comment", e.target.value)
                      }
                    />
                  </StyledPaper>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Typography color="primary" variant="h4" paddingTop={5}>
                Feedback for Urban Origins
              </Typography>
              <Typography variant="h7" color="secondary">
                This data is shared with Urban Origins and will not be shown
                publicly. Thank you for booking on Gleek!
              </Typography>
            </Grid>
            {/* <Grid item xs={12}>
            <StyledPaper>
              <Typography paddingTop={1}>Email</Typography>
              <TextField
                label="Email"
                variant="standard"
                fullWidth
                required
                value={surveyData?.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
              />
            </StyledPaper>
          </Grid>
          <Grid item xs={12}>
            <StyledPaper>
              <TextField
                label="Name"
                variant="standard"
                fullWidth
                required
                value={surveyData?.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
              />
            </StyledPaper>
          </Grid>
          <Grid item xs={12}>
            <StyledPaper>
              <TextField
                label="Company"
                variant="standard"
                fullWidth
                required
                value={surveyData?.company}
                onChange={(e) => handleFieldChange("company", e.target.value)}
              />
            </StyledPaper>
          </Grid>

          <Grid item xs={12}>
            <StyledPaper>
              <TextField
                label="Date of activity"
                variant="standard"
                fullWidth
                value={surveyData?.date}
                onChange={(e) => handleFieldChange("date", e.target.value)}
              />
            </StyledPaper>
          </Grid> */}
            <Grid item xs={12}>
              <StyledPaper>
                <Typography paddingY={1} variant="h6">
                  How likely is it that you would recommend this experience to a
                  friend or colleague?
                </Typography>
                <Rating
                  max={10}
                  name="recommendationScore"
                  value={surveyData?.recommendationScore}
                  onChange={(event, newValue) =>
                    handleFieldChange("recommendationScore", newValue)
                  }
                />
              </StyledPaper>
            </Grid>
            <Grid item xs={12}>
              <StyledPaper>
                <Typography paddingTop={1} variant="h6">
                  When do you intend to organize your next activity?
                </Typography>
                <TextField
                  variant="standard"
                  fullWidth
                  value={surveyData?.potentialNextActivityDate}
                  onChange={(e) =>
                    handleFieldChange(
                      "potentialNextActivityDate",
                      e.target.value,
                    )
                  }
                />
              </StyledPaper>
            </Grid>
            <Grid item xs={12}>
              <StyledPaper>
                <Typography paddingY={1} variant="h6">
                  How likely is it that you would choose to repeat the same
                  activity with the same vendor?
                </Typography>
                <Typography variant="body1" paddingBottom={2}>
                  i.e. you would choose to repeat everything as it happened for
                  future events or batches of participants
                </Typography>
                <Rating
                  name="repeatActivityScore"
                  value={surveyData?.repeatActivityScore}
                  onChange={(event, newValue) =>
                    handleFieldChange("repeatActivityScore", newValue)
                  }
                />
              </StyledPaper>
            </Grid>
            <Grid item xs={12}>
              <StyledPaper>
                <Typography paddingY={1} variant="h6">
                  How likely is it that you would choose to repeat the same
                  activity with a different vendor?
                </Typography>
                <Typography variant="body1" paddingBottom={2}>
                  i.e. you would choose a similar activity from our catalogue,
                  but run by a different facilitator with a difference in the
                  programme
                </Typography>

                <Rating
                  name="repeatActivityDifferentVendorScore"
                  value={surveyData?.repeatActivityDifferentVendorScore}
                  onChange={(event, newValue) =>
                    handleFieldChange(
                      "repeatActivityDifferentVendorScore",
                      newValue,
                    )
                  }
                />
              </StyledPaper>
            </Grid>
            <Grid item xs={12}>
              <StyledPaper>
                <Typography paddingY={1} variant="h6">
                  How likely is it that you would choose a different activity
                  from our catalogue for your next event?
                </Typography>
                <Rating
                  name="differentActivityScore"
                  value={surveyData?.differentActivityScore}
                  onChange={(event, newValue) =>
                    handleFieldChange("differentActivityScore", newValue)
                  }
                />
              </StyledPaper>
            </Grid>
            <Grid item xs={12}>
              <StyledPaper>
                <Typography paddingY={1} variant="h6">
                  What did you like about the activity?
                </Typography>
                <TextField
                  label="Your thoughts"
                  variant="standard"
                  fullWidth
                  required
                  multiline
                  rows={5}
                  value={surveyData?.activityLiked}
                  onChange={(e) =>
                    handleFieldChange("activityLiked", e.target.value)
                  }
                />
              </StyledPaper>
            </Grid>
            <Grid item xs={12}>
              <StyledPaper>
                <Typography paddingY={1} variant="h6">
                  What do you think could be improved about the activity?
                </Typography>
                <TextField
                  label="Your thoughts"
                  variant="standard"
                  fullWidth
                  required
                  multiline
                  rows={5}
                  value={surveyData?.activityImprovements}
                  onChange={(e) =>
                    handleFieldChange("activityImprovements", e.target.value)
                  }
                />
              </StyledPaper>
            </Grid>
            <Grid item xs={12}>
              <StyledPaper>
                <Typography paddingY={1} variant="h6">
                  If you were satisfied with your experience, we would
                  appreciate a short testimonial that we can share on our
                  platforms.
                </Typography>
                <TextField
                  label="Testimonial"
                  variant="standard"
                  fullWidth
                  multiline
                  rows={5}
                  value={surveyData?.testimonial}
                  onChange={(e) =>
                    handleFieldChange("testimonial", e.target.value)
                  }
                />
              </StyledPaper>
            </Grid>
            <Grid item xs={12}>
              <StyledPaper>
                <Typography paddingY={1} variant="h6">
                  Please indicate your preferred display name and role that we
                  can use with the testimonial.
                </Typography>
                <TextField
                  label="Display name"
                  variant="standard"
                  fullWidth
                  value={surveyData?.displayName}
                  onChange={(e) =>
                    handleFieldChange("displayName", e.target.value)
                  }
                />
              </StyledPaper>
            </Grid>
            <Grid item xs={12}>
              <StyledPaper>
                <Typography paddingY={1} variant="h6">
                  Is there someone you know, whether in your own company or
                  elsewhere, who might benefit from our activities?
                </Typography>
                <TextField
                  label="Referrals"
                  variant="standard"
                  fullWidth
                  multiline
                  rows={5}
                  value={surveyData?.potentialReferrals}
                  onChange={(e) =>
                    handleFieldChange("potentialReferrals", e.target.value)
                  }
                />
              </StyledPaper>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                size="large"
                disabled={
                  surveyData?.status && surveyData?.status === "SUBMITTED"
                }
                fullWidth
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </MainBodyContainer>
  );
}

export default FillSurvey;
