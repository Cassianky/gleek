import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  useAdminStore,
  useChatStore,
  useNotificationStore,
} from "../../zustand/GlobalStore";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import ChatIcon from "@mui/icons-material/Chat";
import AxiosConnect from "../../utils/AxiosConnect";

const HomePageNavBar = ({ toggleSidebar }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const settings = ["Profile", "Account", "Dashboard", "Logout"];
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { authenticated, admin, logout, login } = useAdminStore();
  const { unreadNotificationsCount, retrieveAndSetAllNotifications } =
    useNotificationStore();
  const { unreadChatroomCount, retrieveAndSetAllChatRooms } = useChatStore();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleLogout = async (event) => {
    navigate("/");
    const response = await logout();
  };

  const handleNotificationClick = () => {
    navigate("/notificationList");
  };

  const handleChatClick = () => {
    navigate("/chats");
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const stringAvatar = () => {
    const initials = admin.name[0].toUpperCase();
    return {
      sx: {
        bgcolor: theme.palette.light_purple.main,
      },
      children: initials,
    };
  };

  useEffect(() => {
    retrieveAndSetAllChatRooms();
    retrieveAndSetAllNotifications();
  }, [retrieveAndSetAllChatRooms, retrieveAndSetAllNotifications]);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar style={{ paddingLeft: 16, justifyContent: "space-between" }}>
        {authenticated && (
          <IconButton color="inherit" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
        )}
        <Link to="/" style={{ all: "unset", cursor: "pointer" }}>
          <Typography fontSize={25} fontWeight={700} noWrap component="div">
            Gleek Admin
          </Typography>
        </Link>
        {authenticated ? (
          <Box sx={{ flexGrow: 0 }}>
            <Link
              to="/scheduledTaskDemo"
              style={{ all: "unset", cursor: "pointer" }}
            >
              <IconButton size="large" color="inherit">
                <AccessAlarmIcon />
              </IconButton>
            </Link>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={unreadChatroomCount} color="error">
                <ChatIcon onClick={handleChatClick} />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              sx={{ marginRight: "12px" }}
            >
              <Badge badgeContent={unreadNotificationsCount} color="error">
                <NotificationsIcon onClick={handleNotificationClick} />
              </Badge>
            </IconButton>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar {...stringAvatar()} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key="Logout" onClick={handleCloseUserMenu}>
                <Link
                  onClick={handleLogout}
                  style={{ all: "unset", cursor: "pointer" }}
                >
                  <Typography textAlign="center" onClick={handleLogout}>
                    Logout
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem key="manageProfile" onClick={handleCloseUserMenu}>
                <Link
                  to="/manageProfile"
                  style={{ all: "unset", cursor: "pointer" }}
                >
                  <Typography textAlign="center">Manage Account</Typography>
                </Link>
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Link to="/login" style={{ all: "unset", cursor: "pointer" }}>
            <Typography textAlign="center">Login</Typography>
          </Link>
        )}
      </Toolbar>
    </AppBar>
  );
};
export default HomePageNavBar;
