import { Link, useLocation } from "@tanstack/react-router";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  useTheme,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";
import { SidebarItem, getSidebarItems } from "./SidebarItems";
import { useLayout } from "../../../context/layoutContext";
import { useAuth } from "../../../context/auth";

const Sidebar = () => {
  const {
    setCollapsed,
    collapsed,
    isMobile,
    toggled,
    setToggled,
  } = useLayout();
  const location = useLocation();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUserId(JSON.parse(storedUser).user?.id);
      }
    } catch (error) {
      console.error("Erro ao recuperar usuário do localStorage", error);
    }
  }, []);

  const SIDEBAR_ITEMS = getSidebarItems(userId);

  const renderSidebarItems = (items: SidebarItem[]) => {
    return items
      .filter((item) => item.path)
      .map((item) => (
        <ListItemButton key={item.label} component={Link} to={item.path!}>
          {item.icon && (
            <ListItemIcon sx={{ color: theme.palette.common.white }}>
              {item.icon}
            </ListItemIcon>
          )}
          {!collapsed && (
            <ListItemText
              sx={{ color: theme.palette.common.white }}
              primary={item.label}
            />
          )}
        </ListItemButton>
      ));
  };

  return (
    <>
      {collapsed && (
        <IconButton
          onClick={() => setCollapsed(false)}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1300,
            background: theme.palette.primary.main,
            color: "white",
            "&:hover": {
              background: theme.palette.primary.dark,
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? toggled : true}
        onClose={() => setToggled(false)}
        sx={{
          width: collapsed ? 64 : 240,
          height: "100vh",
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          "& .MuiDrawer-paper": {
            width: collapsed ? 64 : 240,
            position: "relative",
            background: theme.palette.primary.main,
            transition: theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            height: "100vh",
            overflowY: "auto",
          },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={2}
        >
          <Box component={Link} to="/" display="flex" alignItems="center">
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                objectFit: "contain",
                height: collapsed ? 40 : 50,
                transition: "height 0.3s ease",
              }}
            />
            {!collapsed && (
              <Typography
                variant="h6"
                component="div"
                sx={{ ml: 1, color: theme.palette.common.white }}
              >
                Iris
              </Typography>
            )}
          </Box>
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{ color: "white" }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <List>{renderSidebarItems(SIDEBAR_ITEMS)}</List>
      </Drawer>
    </>
  );
};

export default Sidebar;
