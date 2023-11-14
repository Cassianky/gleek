import { Box, Typography, Paper, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import notFound from "../../assets/not_found.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



const FeatureCardItem = ({ activity }) => {
  const theme = useTheme();
  const accent = theme.palette.accent.main;
  const navigate = useNavigate();

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery((theme) =>
    theme.breakpoints.between("sm", "md"),
  );
  const isLargeScreen = useMediaQuery((theme) =>
    theme.breakpoints.between("md", "lg"),
  );

  let containerStyle = {
    position: "relative",
    height: "15rem", // Default for extra-large screens
    width: "30rem",
    objectFit: "cover",
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
  };

  if (isLargeScreen) {
    containerStyle = {
      ...containerStyle,
      height: "15rem", // Customize for large screens
    };
  }

  if (isMediumScreen) {
    containerStyle = {
      ...containerStyle,
      height: "12rem", // Customize for medium screens
    };
  }

  if (isSmallScreen) {
    containerStyle = {
      ...containerStyle,
      height: "20rem", // Customize for small screens
    };
  }

  const textStyle = {
    position: "absolute",
    bottom: "0",
    left: "0",
    padding: "1rem",
    width: "100%",
    background: "rgba(255, 255, 255, 0.8)",
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
  };

  const handleCardClick = () => {
    navigate(`/shop/activity/${activity._id}`);
  };

  return (
    <Paper
      display="flex"
      bgcolor={"grey.50"}
      sx={{
        height: "100%",
        overflow: "hidden",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        cursor: "pointer",
      }}
      elevation={0}
      onClick={handleCardClick}
    >
      {/* Apply styling to the image */}
      {activity?.preSignedImages && activity?.preSignedImages.length > 0 && (
        <img
          src={activity.preSignedImages[0]}
          alt={activity.title}
          style={containerStyle}
        />
      )}
      {!activity.preSignedImages.length > 0 && (
        <img src={notFound} alt={activity.title} style={containerStyle} />
      )}

      <Box sx={textStyle}>
        <Typography color={accent} fontWeight="700" variant="h5" align="left">
          {activity.title}
        </Typography>
      </Box>
    </Paper>
  );
};

export default FeatureCardItem;
