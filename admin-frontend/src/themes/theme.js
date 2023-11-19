import { createTheme } from "@mui/material/styles";

// Color palette: https://colorhunt.co/palette/fff3dadfccfbd0bfffbeadfa
const theme = createTheme({
  palette: {
    primary: {
      main: "#5C4B99",
    },
    secondary: {
      main: "#FFDBC3",
    },
    backgroundColor: {
      secondary: "#F5F5F5",
    },
    light_purple: {
      main: "#9F91CC",
    },
    dark_purple: {
      main: "#3D246C",
    },
    grey: {
      pale_grey: "#FAFAFA",
      200: "#EEEEEE",
      100: "#F5F5F5",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
    },
    error: {
      main: "#D32F2F",
    },
    unselected: {
      main: "#919191",
    },
    success: {
      main: "#2e7d32",
      light: "#80af82",
      pastel: "#81c784",
    },
    yellow: {
      main: "#ffc65c",
    },
  },

  typography: {
    fontFamily: "Fredoka",
  },
});

export default theme;
