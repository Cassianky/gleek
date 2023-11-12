import {
  Container,
  Stack,
  Typography
} from "@mui/material";
import { useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import useSnackbarStore from "../../zustand/SnackbarStore";
import { useTestimonialStore } from "../../zustand/TestimonialStore";
import ClientTestimonial from "./ClientTestimonial";

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

  function TestimonialSwiper() {
    return (
      <Swiper
        maxWidth="fit-content"
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
              position: "relative",
              padding: "10px",
              boxSizing: "border-box",
            }}
          >
            <ClientTestimonial
              key={testimonial._id}
              testimonial={testimonial}
              style={{}}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }
  function TestimonialGrid() {
    return (
      <Stack spacing={5} justifyContent="center" direction={"row"} width="100%">
        {testimonials.map((testimonial) => (
          <>
            <ClientTestimonial testimonial={testimonial} />
          </>
        ))}
      </Stack>
    );
  }

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
        variant="h4"
        gutterBottom
        py={6}
        sx={{ fontSize: "2rem", textAlign: "center" }}
      >
        Testimonials
      </Typography>
      {testimonials.length < 3 ? <TestimonialGrid /> : <TestimonialSwiper />}
    </Container>
  );
}

export default TestimonialSection;
