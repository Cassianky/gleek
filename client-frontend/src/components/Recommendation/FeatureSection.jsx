import React, { useEffect } from "react";
import useClientStore from "../../zustand/ClientStore";
import useVendorStore from "../../zustand/VendorStore";
import { Container, Typography } from "@mui/material";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useFeaturedActivityStore } from "../../zustand/FeaturedActivityStore";
import ActivityCardItem from "../ActivityCardItem";
import useSnackbarStore from "../../zustand/SnackbarStore";
import FeatureCardItem from "./FeatureCardItem";

function FeatureSection() {
  const { authenticated } = useClientStore();
  const { activities, getTodayFeatures } = useFeaturedActivityStore();
  const { openSnackbar } = useSnackbarStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getTodayFeatures();
      } catch (err) {
        console.error(err);
        openSnackbar(
          "Error when retrieving today's featured activities.",
          "error",
        );
      }
    };
    fetchData();
  }, [getTodayFeatures]);

  if (!authenticated || activities?.length === 0) return <></>;

  return (
    <Container
      maxWidth="xl"
      sx={{
        width: "100%",
        maxWidth: "80vw",
        height: "100%",
        paddingTop: 5,
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        sx={{ fontWeight: 600, fontSize: "2rem" }}
      >
        Featured activities
      </Typography>
      <Swiper
        maxWidth="fit-content"
        slidesPerView={3}
        autoplay={{
          delay: 6000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        speed={1200}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay]}
        className="mySwiper"
        style={{
          boxShadow: "none",
          padding: 10,
          backgroundColor: "transparent",
        }}
        // breakpoints={{
        //   600: {
        //     slidesPerView: 2,
        //   },
        //   960: {
        //     slidesPerView: 3,
        //   },
        // }}
      >
        {activities?.map((a, index) => (
          <SwiperSlide
            key={index}
            style={{
              display: "flex",
              position: "relative",
              padding: "30px",
              boxSizing: "border-box",
              backgroundColor: "transparent",
            }}
          >
            <FeatureCardItem activity={a} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
}

export default FeatureSection;
