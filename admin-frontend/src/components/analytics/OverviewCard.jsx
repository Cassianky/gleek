import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import {
  Avatar,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";

const OverviewCard = ({
  difference,
  positive,
  value,
  title,
  icon,
  iconColor,
  titleFontSize,
}) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        borderRadius: "20px",
        boxShadow: "4px 4px 0px 0px rgb(159 145 204 / 40%)",
        border: "2px solid rgb(159 145 204 / 40%)",
        backgroundColor: "white",
      }}
    >
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              variant="overline"
              fontSize={titleFontSize ?? "1rem"}
              sx={{ color: theme.palette.primary.main }}
              fontWeight={600}
            >
              {title}
            </Typography>
            <Typography
              fontSize={"2rem"}
              fontWeight={600}
              sx={{ color: theme.palette.grey[600] }}
            >
              {title === "Total Profit" ? "$" : ""}
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: iconColor,
              height: 56,
              width: 56,
            }}
          >
            {icon}
          </Avatar>
        </Stack>
        {difference && (
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
            <Stack alignItems="center" direction="row" spacing={0.5}>
              <SvgIcon color={positive ? "success" : "error"} fontSize="small">
                {positive ? <NorthIcon /> : <SouthIcon />}
              </SvgIcon>
              <Typography
                color={positive ? "success.main" : "error.main"}
                fontSize={"1rem"}
              >
                {difference}%
              </Typography>
            </Stack>
            <Typography color="grey.600" variant="caption">
              Since last month
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

OverviewCard.propTypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  value: PropTypes.string.isRequired,
  sx: PropTypes.object,
};

export default OverviewCard;
