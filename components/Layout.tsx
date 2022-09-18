import React, { useState } from "react";
import { AppBar, Box, Button, Toolbar } from "@mui/material";
import LoginModal from "./auth/LoginModal";
import useAuth from "../utils/auth/useAuth";

const Layout = ({ children }: React.PropsWithChildren) => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const { authenticated, signout } = useAuth();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            onClick={() =>
              authenticated ? signout() : setLoginModalOpen(true)
            }
            color="inherit"
          >
            Log {authenticated ? "out" : "in"}
          </Button>
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
