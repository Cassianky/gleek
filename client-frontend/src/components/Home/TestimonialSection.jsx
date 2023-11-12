import {
  Box,
  Button,
  Container,
  Grid,
  MobileStepper,
  Slider,
  Typography,
} from "@mui/material";
import { useTestimonialStore } from "../../zustand/TestimonialStore";
import { useEffect } from "react";
import useSnackbarStore from "../../zustand/SnackbarStore";
import ClientTestimonial from "./ClientTestimonial";
import { useState } from "react";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

function TestimonialSection() {
  const { testimonials, getAllTestimonials } = useTestimonialStore();
  const { openSnackbar } = useSnackbarStore();
  const testimonialsPerSlide = 3;

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

  if (testimonials.length === 0) return <></>;

  return (
    <Container
      maxWidth="xl"
      sx={{
        width: "100%",
        maxWidth: "80vw",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontSize: "2rem", textAlign: "center" }}
      >
        What else our clients say
      </Typography>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
        style={{
          boxShadow: "none",

          padding: 30,
          backgroundColor: "transparent",
        }}
        breakpoints={{
          600: {
            slidesPerView: 2,
          },
          960: {
            slidesPerView: 3,
          },
        }}
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide
            key={index}
            style={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
              padding: "10px",
              boxSizing: "border-box",
            }}
          >
            <ClientTestimonial
              key={testimonial._id}
              testimonial={testimonial}
              style={{
                maxWidth: "100%",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* <Grid container spacing={3} justifyContent="center">
        {testimonials.map((testimonial) => (
          <Grid item key={testimonial._id} xs={12} md={4}>
            <ClientTestimonial testimonial={testimonial} />
          </Grid>
        ))}
      </Grid> */}
    </Container>
  );
}

export default TestimonialSection;
