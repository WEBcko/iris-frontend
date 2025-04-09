// components/Header.tsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  useTheme,
  Button,
  Popper,
  Paper,
  ClickAwayListener,
  IconButton,
  Box,
  Input,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useAuth } from "../../../context/auth";
import { useLayout } from "../../../context/layoutContext";
import { Link } from "@tanstack/react-router";
import { changeProfilePicture } from "../../../service/profile/profile";
import { useEffect } from "react";
import { getProfilePicture } from "../../../service/profile/profile";

export const Header = () => {
  const { collapsed, isMobile, handleToggleSidebar } = useLayout();
  const { logout, user, isAuthenticated } = useAuth();
  const theme = useTheme();
  const effectiveSidebarWidth = isMobile ? 240 : collapsed ? 0 : 240;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [file, setFile] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const handleOpenProfile = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleCloseProfile = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (user) {
        const profilePic = await getProfilePicture(user.id);
        if (profilePic.image_url) {
          setFile(profilePic.image_url);
        }
      }
    };

    fetchProfilePicture();
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    if (uploadedFile) {
      setFile(URL.createObjectURL(uploadedFile));
      changeProfilePicture(uploadedFile);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: theme.palette.primary.main,
        zIndex: theme.zIndex.drawer + 1,
        boxShadow: "0px",
        ml: !isAuthenticated ? 0 : isMobile ? 0 : `${effectiveSidebarWidth}px`,
        width: !isAuthenticated
          ? "100%"
          : isMobile
            ? "100%"
            : `calc(100% - ${effectiveSidebarWidth - 3}px)`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar>
        {isMobile && isAuthenticated && (
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            onClick={handleToggleSidebar}
            sx={{
              mr: 2,
              color: theme.palette.text.primary,
              background: theme.palette.primary.main,
              "&:hover": {
                background: theme.palette.primary.dark,
              },
            }}
          >
            <MenuIcon sx={{ color: "white" }} />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {isAuthenticated ? (
          <Button
            color="secondary"
            sx={{
              fontWeight: 600,
              p: 1,
              ml: 2,
              color: theme.palette.common.white,
              "&:hover": {
                color: theme.palette.primary.main,
                background: theme.palette.common.white,
              },
              "&:active": {
                color: theme.palette.primary.main,
                background: theme.palette.common.white,
              },
            }}
            variant="outlined"
            onClick={handleOpenProfile}
          >
            {file && typeof file === "string" ? (
              <img
                src={file}
                alt="Profile"
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: "50%",
                  marginRight: 8,
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            ) : (
              <AccountCircle
                sx={{
                  mr: {
                    xs: 0,
                    md: 1,
                  },
                }}
              />
            )}

            {!isMobile && user?.username}
          </Button>
        ) : (
          <Box display={"flex"} gap={2} alignItems={"center"}>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="secondary"
              sx={{}}
            >
              Entrar
            </Button>

            <Button
              component={Link}
              to="/register"
              variant="contained"
              color="secondary"
            >
              Cadastrar
            </Button>
          </Box>
        )}

        <Popper
          sx={{
            position: "absolute",
            zIndex: 999999,
          }}
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
        >
          <ClickAwayListener onClickAway={handleCloseProfile}>
            <Paper
              sx={{
                mt: 1,
                p: 2,
                width: 250,
                boxShadow: "none",
                backgroundColor: "#FFFFFF",
              }}
            >
              <Box
                display="flex"
                alignItems="flex-start"
                justifyContent="space-between"
              >
                <Box display="flex" alignItems={"center"} gap={2}>
                  <label
                    htmlFor="profile-upload"
                    style={{
                      position: "relative",
                      display: "inline-block",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                  >
                    {/* Imagem ou Ícone de Perfil */}
                    {file ? (
                      <img
                        src={file}
                        alt="Profile"
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <IconButton color="primary" component="span">
                        <PersonOutlineOutlinedIcon sx={{ fontSize: 50 }} />
                      </IconButton>
                    )}

                    {/* Ícone de Câmera Aparece no Hover */}
                    {hover && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo escurecido
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <PhotoCameraIcon
                          sx={{ color: "white", fontSize: 24 }}
                        />
                      </Box>
                    )}
                  </label>

                  <Input
                    id="profile-upload"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    inputProps={{ accept: "image/*" }}
                  />

                  <Box>
                    {user?.id === undefined ? (
                      <CircularProgress />
                    ) : (
                      <Link to="/user/$id" params={{ id: user.id.toString() }}>
                        <Box sx={{ fontWeight: "bold", fontSize: "0.875rem" }}>
                          {user?.username}
                        </Box>
                      </Link>
                    )}
                  </Box>
                </Box>
                <IconButton
                  onClick={() => {
                    handleCloseProfile();
                    logout();
                  }}
                  sx={{ alignSelf: "start", mt: 0.5 }}
                >
                  <LogoutIcon />
                </IconButton>
              </Box>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </Toolbar>
    </AppBar>
  );
};