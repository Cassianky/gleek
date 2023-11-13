import React from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Stack,
} from "@mui/material";

import image from "../assets/NatureOnScreen.png";
import useClientStore from "../zustand/ClientStore";
import useVendorStore from "../zustand/VendorStore";
import TestimonialSection from "../components/Home/TestimonialSection";
import FeatureSection from "../components/Recommendation/FeatureSection";

const ImageSection = () => {
  const { authenticated } = useClientStore();
  const { vendorAuthenticated } = useVendorStore();

  return (
    <Container
      maxWidth="xl"
      
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingY: "5rem",

      }}
    >
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h2"
            gutterBottom
            sx={{ fontWeight: 800, fontSize: "3rem" }}
          >
            Platform for Sustainability and Wellness Employee Activities.
          </Typography>

          <Typography
            variant="subtitle1"
            paragraph
            sx={{ fontWeight: 200, fontSize: "1.2rem" }}
          >
            Book or post employee engagement activities on Gleek. Explore
            sustainable activities and improve employee wellbeing.
          </Typography>
          {!authenticated && !vendorAuthenticated && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                href="/register"
              >
                Get Started as a Client
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                href="/vendor/register"
              >
                Get Started as a Vendor
              </Button>
            </Stack>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <img
            src={image}
            alt="NatureOnScreen"
            style={{ width: "100%", height: "auto" }}
          />
        </Grid>
      </Grid>
    </Container>
  );
};
const HomePage = () => {
  return (
    <>
      <Container elevation={0} maxWidth>
        <FeatureSection/>
        {<ImageSection />}
        <TestimonialSection />
      </Container>
    </>
  );
};

export default HomePage;
