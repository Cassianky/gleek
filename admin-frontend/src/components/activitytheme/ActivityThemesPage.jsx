import styled from "@emotion/styled";
import MainBodyContainer from "../common/MainBodyContainer";
import {
  CircularProgress,
  Divider,
  Typography,
  alpha,
  useTheme,
  Button,
  Box,
} from "@mui/material";
import { useSnackbarStore, useThemeStore } from "../../zustand/GlobalStore";
import InfoIcon from "@mui/icons-material/Info";
import { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import ActivityThemesTable from "./ActivityThemesTable";
import AddThemeModal from "./AddThemeModal";
import { useState } from "react";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey.pale_grey,
}));

const ActivityThemesPage = () => {
  const theme = useTheme();
  const { openSnackbar } = useSnackbarStore();
  const { themes, getThemes, isThemeLoading, addThemes, updateTheme } =
    useThemeStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await getThemes();
    };
    fetchData();
  }, [getThemes]);

  const handleOpen = () => {
    setOpen((prevState) => !prevState);
  };

  const handleCreateButtonClick = (event) => {
    setOpen(true);
  };

  return (
    <StyledPage>
      <MainBodyContainer
        hasBackButton={true}
        breadcrumbNames={[]}
        breadcrumbLinks={[]}
        currentBreadcrumbName={"Activity Themes"}
      >
        <Typography
          alignItems={"center"}
          fontSize={25}
          fontWeight={700}
          noWrap
          component="div"
          color={theme.palette.primary.main}
          paddingBottom={1}
          style={{
            display: "flex",
          }}
        >
          Activity Themes
        </Typography>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingBottom: "20px",
            }}
          >
            <InfoIcon fontSize="small" sx={{ color: "#9F91CC" }} />
            <Typography color="#9F91CC">
              Track your activity themes, activate or deactivate them
            </Typography>
          </div>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            paddingRight={2}
          >
            <Button
              variant="contained"
              color="light_purple"
              onClick={handleCreateButtonClick}
              style={{
                paddingLeft: 2,
                justifyContent: "center",
                paddingRight: 6,
                textTransform: "capitalize",
              }}
            >
              <Typography
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
                component="div"
                color="white"
                fontSize={"0.875rem"}
              >
                <AddIcon fontSize="small" />
                Add new theme
              </Typography>
            </Button>
            <AddThemeModal
              handleOpen={handleOpen}
              open={open}
              addThemes={addThemes}
              openSnackbar={openSnackbar}
              themes={themes}
            />
          </Box>
        </div>

        <Divider
          sx={{
            backgroundColor: alpha(theme.palette.light_purple.main, 0.5),
            marginBottom: 2,
          }}
        />
        {isThemeLoading ? (
          <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
        ) : (
          <>
            <ActivityThemesTable
              themes={themes}
              updateTheme={updateTheme}
              openSnackbar={openSnackbar}
            />
          </>
        )}
      </MainBodyContainer>
    </StyledPage>
  );
};
export default ActivityThemesPage;
