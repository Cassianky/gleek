import { Container, Grid, Typography, useTheme } from "@mui/material";
import MainBodyContainer from "./common/MainBodyContainer";
import Clock from "react-live-clock";
import image from "../assets/imageUploadIcon/home.png";

const Home = () => {
  const theme = useTheme();
  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"Home"}
    >
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
              sx={{ fontWeight: 800, fontSize: "5rem" }}
              color={theme.palette.primary.main}
            >
              <Clock
                format={"HH:mm:ss a"}
                ticking={true}
                timezone={"Asia/Singapore"}
              />
            </Typography>
            <Typography
              variant="h2"
              gutterBottom
              sx={{ fontWeight: 800, fontSize: "3rem" }}
              color={theme.palette.primary.main}
            >
              Welcome to Gleek Admin!
            </Typography>

            <Typography
              variant="subtitle1"
              paragraph
              sx={{ fontWeight: 200, fontSize: "1.2rem" }}
              color={theme.palette.light_purple.main}
            >
              Elevate your event management experience with our Gleek Admin
              Portal. Effortlessly manage activities, engage with vendors, and
              connect with clients.
            </Typography>
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
    </MainBodyContainer>
  );
};
export default Home;
