import React from "react";
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
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";

const StyledPaper = styled(Paper)`
  padding: 20px;
  padding-top: 6px;
  border-radius: 10px;
  border: 1px solid rgb(159, 145, 204);
  box-shadow: 3px 3px 0px 0px rgb(159, 145, 204, 40%);
`;

function SurveyDetails({ surveyData }) {
  console.log(surveyData);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography color="#9F91CC" variant="h5">
            Feedback
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography paddingY={1} variant="h6">
              How likely is it that you would recommend this experience to a
              friend or colleague?
            </Typography>
            <Rating
              disabled
              max={10}
              name="recommendationScore"
              value={surveyData?.recommendationScore}
            />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography paddingTop={1} variant="h6">
              When do you intend to organize your next activity?
            </Typography>
            <TextField
              disabled
              variant="standard"
              fullWidth
              value={surveyData?.potentialNextActivityDate}
            />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography paddingY={1} variant="h6">
              How likely is it that you would choose to repeat the same activity
              with the same vendor?
            </Typography>
            <Typography variant="body1" paddingBottom={2}>
              i.e. you would choose to repeat everything as it happened for
              future events or batches of participants
            </Typography>
            <Rating
              disabled
              name="repeatActivityScore"
              value={surveyData?.repeatActivityScore}
            />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography paddingY={1} variant="h6">
              How likely is it that you would choose to repeat the same activity
              with a different vendor?
            </Typography>
            <Typography variant="body1" paddingBottom={2}>
              i.e. you would choose a similar activity from our catalogue, but
              run by a different facilitator with a difference in the programme
            </Typography>

            <Rating
              disabled
              name="repeatActivityDifferentVendorScore"
              value={surveyData?.repeatActivityDifferentVendorScore}
            />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography paddingY={1} variant="h6">
              How likely is it that you would choose a different activity from
              our catalogue for your next event?
            </Typography>
            <Rating
              disabled
              name="differentActivityScore"
              value={surveyData?.differentActivityScore}
            />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <Typography color="#9F91CC" variant="h5">
            Likes & Dislikes
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography paddingY={1} variant="h6">
              What did you like about the activity?
            </Typography>
            <TextField
              disabled
              label="Your thoughts"
              variant="standard"
              fullWidth
              required
              multiline
              rows={5}
              value={surveyData?.activityLiked}
            />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography paddingY={1} variant="h6">
              What do you think could be improved about the activity?
            </Typography>
            <TextField
              disabled
              label="Your thoughts"
              variant="standard"
              fullWidth
              required
              multiline
              rows={5}
              value={surveyData?.activityImprovements}
            />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography color="#9F91CC" variant="h5">
              Testimonial
            </Typography>
            <Button variant="contained" color="primary" startIcon={<AddIcon />}>
              Use Testimonial
            </Button>
          </Stack>
        </Grid>
      
        <Grid item xs={12}>
          <StyledPaper>
            <Typography paddingY={1} variant="h6">
              If you were satisfied with your experience, we would appreciate a
              short testimonial that we can share on our platforms.
            </Typography>
            <TextField
              disabled
              label="Testimonial"
              variant="standard"
              fullWidth
              multiline
              rows={5}
              value={surveyData?.testimonial}
            />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography paddingY={1} variant="h6">
              Please indicate your preferred display name and role that we can
              use with the testimonial.
            </Typography>
            <TextField
              disabled
              label="Display name"
              variant="standard"
              fullWidth
              value={surveyData?.displayName}
            />
          </StyledPaper>
        </Grid>
        <Grid item xs={12}>
          <Typography color="#9F91CC" variant="h5">
            Referrals
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography paddingY={1} variant="h6">
              Is there someone you know, whether in your own company or
              elsewhere, who might benefit from our activities?
            </Typography>
            <TextField
              disabled
              label="Referrals"
              variant="standard"
              fullWidth
              multiline
              rows={5}
              value={surveyData?.potentialReferrals}
            />
          </StyledPaper>
        </Grid>
      </Grid>
    </>
  );
}

export default SurveyDetails;
