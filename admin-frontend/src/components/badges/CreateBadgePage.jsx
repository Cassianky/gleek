import styled from "@emotion/styled";
import CreateIcon from "@mui/icons-material/Create";
import { Typography, useTheme } from "@mui/material";
import MainBodyContainer from "../common/MainBodyContainer";
// import CreateActivityForm from "./CreateActivityForm";
import CreateBadgeForm from "./CreateBadgeForm";

const StyledPage = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.grey.pale_grey,
}));

const CreateBadgePage = () => {
  const theme = useTheme();

  return (
    <StyledPage>
      <MainBodyContainer
        hasBackButton={true}
        breadcrumbNames={["View Badges"]}
        breadcrumbLinks={["/badges"]}
        currentBreadcrumbName={"Create Badge"}
      >
        <Typography
          alignItems={"center"}
          fontSize={25}
          fontWeight={700}
          noWrap
          component="div"
          color={theme.palette.primary.main}
          paddingBottom={2}
          style={{
            display: "flex",
          }}
        >
          <CreateIcon sx={{ marginRight: 1 }} />
          Create Badge
        </Typography>

        <CreateBadgeForm theme={theme} />
      </MainBodyContainer>
    </StyledPage>
  );
};
export default CreateBadgePage;
