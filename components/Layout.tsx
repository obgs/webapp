import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import LoginModal from "./auth/LoginModal";
import useAuth from "../utils/auth/useAuth";

import { useRouter } from "next/router";
import useUser from "../utils/user/useUser";

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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
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
      {children}
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </Box>
  );
};

export default Layout;
