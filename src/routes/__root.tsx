import * as React from "react";
import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Box,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  Theme,
  useTheme,
  Fab,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/logo.png";
import { AuthContextValue, useAuth } from "../context/auth";
import theme from "../theme/theme";
import { Header } from "../components/Layout/Header/Header";
import Sidebar from "../components/Layout/Sidebar/Sidebar";
import AddIcon from "@mui/icons-material/Add";

interface MyRouterContext {
  auth: AuthContextValue;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      {isAuthenticated && <Sidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          height: "100vh",
          overflowY: "auto",
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
      <Fab
        component={Link}
        to="/new-post"
        sx={{
          position: "absolute",
          right: 45,
          bottom: 30,
        }}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default RootComponent;
