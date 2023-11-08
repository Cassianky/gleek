import React, { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import {
  Avatar,
  Button, // Import Button
  Card,
  CardContent,
  CircularProgress,
  Divider, // Import Divider
  Grid,
  Paper,
  Typography,
  TextareaAutosize,
  TextField,
  Stack,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  useSnackbarStore,
  useTestimonialStore,
} from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";

function TestimonialDetails() {
  const theme = useTheme();
  const { testimonialId } = useParams();

  const { openSnackbar } = useSnackbarStore();
  const { testimonial, getTestimonialById, isLoading, updateTestimonialById } =
    useTestimonialStore();

  const StyledPaper = styled(Paper)`
    padding: 20px;
    padding-top: 6px;
    border-radius: 10px;
    border: 1px solid rgb(159, 145, 204);
    box-shadow: 3px 3px 0px 0px rgb(159, 145, 204, 40%);
  `;

  const handleUpdate = async () => {
    try {
      await updateTestimonialById(testimonialId, testimonialDetail);
      openSnackbar("Sucessfully updated testimonial.", "success");
    } catch (error) {
      console.log(error);
      openSnackbar(error.message, "error");
    }
  };

  const [testimonialDetail, setTestimonialDetail] = useState({
    testimonialBody: "",
    displayName: "",
    clientName: "",
    hidden: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const t = await getTestimonialById(testimonialId);

        setTestimonialDetail(t);
      } catch (err) {
        console.error(err);
        openSnackbar("Error when retrieving testimonial.", "error");
      }
    };
    fetchData();
  }, [getTestimonialById, testimonialId]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <MainBodyContainer
      hasBackButton={true}
      breadcrumbNames={["Manage Testimonials"]}
      breadcrumbLinks={["/testimonials"]}
      currentBreadcrumbName={"View Testimonial"}
    >
      <Typography
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
        mb={2}
      >
        Testimonial Details
      </Typography>

      {testimonial && (
        <div>
          <Stack spacing={2}>
            <TextField
              label="Testimonial Body"
              name="testimonialBody"
              variant="outlined"
              multiline
              rows={5}
              value={testimonialDetail.testimonialBody}
              fullWidth
              onChange={(e) =>
                setTestimonialDetail({
                  ...testimonialDetail,
                  testimonialBody: e.target.value,
                })
              }
            />
            <TextField
              label="Display Name"
              variant="outlined"
              value={testimonialDetail.displayName}
              fullWidth
              name="displayName"
              onChange={(e) =>
                setTestimonialDetail({
                  ...testimonialDetail,
                  displayName: e.target.value,
                })
              }
            />
            <TextField
              label="Client Company Name"
              variant="outlined"
              name="clientName"
              value={testimonialDetail.clientName}
              fullWidth
              onChange={(e) =>
                setTestimonialDetail({
                  ...testimonialDetail,
                  clientName: e.target.value,
                })
              }
            />
            <FormControlLabel
              label="Shown"
              control={
                <Switch
                  color="primary"
                  checked={!testimonialDetail.hidden}
                  onChange={() =>
                    setTestimonialDetail({
                      ...testimonialDetail,
                      hidden: !testimonialDetail.hidden,
                    })
                  }
                />
              }
            />
          </Stack>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
          >
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
          </Box>

          <Typography
            fontSize={20}
            fontWeight={500}
            noWrap
            component="div"
            color={theme.palette.primary.main}
          >
            Current Testimonial
          </Typography>

          <StyledPaper style={{ width: "500px" }}>
            <Card elevation={0}>
              <CardContent>
                <FormatQuoteIcon sx={{ transform: "scaleX(-1)" }} />

                <div
                  style={{
                    height: "200px",
                    overflowY: "scroll",
                    overflowWrap: "break-word",
                  }}
                >
                  <Typography variant="h5" align="center">
                    {testimonial.testimonialBody}
                  </Typography>
                </div>

                <Typography variant="body1" align="center">
                  - {testimonial.displayName}, {testimonial.clientName}
                </Typography>
              </CardContent>
            </Card>
          </StyledPaper>
        </div>
      )}
    </MainBodyContainer>
  );
}

export default TestimonialDetails;
