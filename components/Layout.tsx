import React, { useMemo, useState } from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import LoginModal from "./auth/LoginModal";
import useAuth from "../utils/auth/useAuth";
import { useMeQuery } from "../graphql/generated";

const Layout = ({ children }: React.PropsWithChildren) => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const { authenticated, signout } = useAuth();

  const { data } = useMeQuery({
    skip: !authenticated,
  });

  const user = useMemo(() => data?.me, [data]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          {user && (
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Hi, {user.email}
            </Typography>
          )}
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
