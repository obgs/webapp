import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import LoginModal from "../auth/LoginModal";
import useAuth from "../../utils/auth/useAuth";

import { useRouter } from "next/router";
import useUser from "../../utils/user/useUser";
import NavBar from "./NavBar";
import Breadcrumbs from "./Breadcrumbs";

const drawerWidth = 240;

const Layout = ({ children }: React.PropsWithChildren) => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const router = useRouter();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    router.push("/profile");
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    signout();
  };

  const { user } = useUser();

  const { authenticated, signout } = useAuth();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Breadcrumbs />
          <Box sx={{ flexGrow: 1 }} />
          {authenticated ? (
            <Box>
              <Button color="inherit" size="large" onClick={handleMenu}>
                {!!user?.name && <Typography>{user.name}</Typography>}
                <Box ml={1}>
                  <Avatar src={user?.avatarURL} />
                </Box>
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button color="inherit" onClick={() => setLoginModalOpen(true)}>
              Log in
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <NavBar />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </Box>
  );
};

export default Layout;
