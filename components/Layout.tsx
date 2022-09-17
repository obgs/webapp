import React, { useState } from "react";
import { AppBar, Box, Button, Toolbar } from "@mui/material";
import LoginModal from "./auth/LoginModal";

const Layout = ({ children }: React.PropsWithChildren) => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={() => setLoginModalOpen(true)} color="inherit">
            Log in
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
